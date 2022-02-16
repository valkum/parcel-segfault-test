import {
  Attribute,
  Comment,
  Entry,
  Identifier,
  Message,
  Pattern,
  StringLiteral,
  Term,
  FunctionReference,
  CallArguments,
  NamedArgument,
  TextElement,
  SelectExpression,
  VariableReference,
  TermReference,
  Variant,
} from '@fluent/syntax';

interface SerializeOutput {
  key: string;
  value: string;
  comment?: SerializeOutput;
  attributes?: Array<SerializeOutput>;
}

const getTypeName = (item) => 'get' + item.type;

export default {
  serialize(item: Entry): SerializeOutput | void {
    if (this[getTypeName(item)]) {
      return this[getTypeName(item)](item);
    } else {
      console.warn('unknown type:', item.type, item);
    }
  },

  getComment(item: Comment): SerializeOutput {
    if (item.type == 'Comment') {
      return { key: 'comment', value: item.content };
    } else {
      throw new Error(`Tried to get comment from${item.type}`);
    }
  },

  getGroupComment() {
    return null;
  },

  getResourceComment() {
    return null;
  },

  getMessage(item: Message): SerializeOutput {
    const serializeAttributes = (attributes: Array<Attribute>) => {
      return attributes.map((attr) => {
        return this.serialize(attr);
      });
    };
    return {
      key: this[getTypeName(item.id)](item.id),
      value: this[getTypeName(item.value)](item.value),
      comment: item.comment && this[getTypeName(item.comment)](item.comment),
      attributes: item.attributes && serializeAttributes(item.attributes),
    };
  },

  getAttribute(item: Attribute): SerializeOutput {
    return {
      key: this[getTypeName(item.id)](item.id),
      value: this[getTypeName(item.value)](item.value),
    };
  },

  getTerm(item: Term): SerializeOutput {
    return {
      key: `-${this[getTypeName(item.id)](item.id)}`,
      value: this[getTypeName(item.value)](item.value),
      comment: item.comment && this[getTypeName(item.comment)](item.comment),
      attributes:
        item.attributes &&
        item.attributes.map((attr) => {
          return this.serialize(attr);
        }),
    };
  },

  getIdentifier(item: Identifier): string {
    return item.name;
  },

  getStringLiteral(item: StringLiteral): string {
    return item.value;
  },

  getPattern(item: Pattern): string {
    const items = item.elements.map((placeable) => {
      if (placeable.expression) {
        if (!this[getTypeName(placeable.expression)]) {
          return console.log('unknown1', getTypeName(placeable.expression), placeable.expression);
        }
        return this[getTypeName(placeable.expression)](placeable.expression);
      } else {
        if (!this[getTypeName(placeable)]) {
          return console.log('unknown2', getTypeName(placeable), placeable);
        }
        return this[getTypeName(placeable)](placeable);
      }
    });

    return items.join('');
  },

  getCallArguments(item: CallArguments): string {
    const positionals = item.positional.map((positional) => {
      return this[getTypeName(positional)](positional, true);
    });

    const nameds = item.named.map((named) => {
      return this[getTypeName(named)](named);
    });

    // return '{ ' + fcName + '($' + positionals.join(' ') + (nameds.length ? ', ' + nameds.join(', ') : '') + ') }';
    return '$' + positionals.join(' ') + (nameds.length ? ', ' + nameds.join(', ') : '');
  },

  getNamedArgument(item: NamedArgument): string {
    return this[getTypeName(item.name)](item.name) + ': "' + this[getTypeName(item.value)](item.value) + '"';
  },

  getTextElement(item: TextElement): string {
    return item.value;
  },

  getSelectExpression(item: SelectExpression) {
    const id = this[getTypeName(item.selector)](item.selector, true);

    const variants = item.variants.map((variant) => {
      return this[getTypeName(variant)](variant);
    });

    return '{ $' + id + ' ->\n' + variants.join('\n') + '\n}';
  },

  getVariableReference(item: VariableReference, plain) {
    if (plain) return this[getTypeName(item.id)](item.id);
    return '{ $' + this[getTypeName(item.id)](item.id) + ' }';
  },

  getVariant(item: Variant): string {
    const name = item.key.name ? item.key.name : item.key.value;
    const isDefault = item.default;
    const pattern = this[getTypeName(item.value)](item.value);

    const ret = '[' + name + '] ' + pattern;

    if (isDefault) return ' *' + ret;
    return '  ' + ret;
  },

  getFunctionReference(item: FunctionReference): string {
    return `{ ${item.id.name}(${this.getCallArguments(item.arguments)}) }`;
  },

  getTermReference(item: TermReference): string {
    return `{ -${item.id.name} }`;
  },

  getJunk(item) {
    const parts = item.content.split('=');
    const key = parts.shift().trim();
    const value = parts
      .join('=')
      .trim()
      .replace(/\n {3}/g, '\n ')
      .replace(/\n {2}}/g, '\n}');
    return { key, value };
  },
};

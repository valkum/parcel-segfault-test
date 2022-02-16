import { FluentIJs } from '.';

/**
 * Creates a k=value pair from two string arguments.
 *
 * As this probably handles remote origin inputs, we carefully check if the
 * types are correct additionally to typescripts warnings as these are not checked at runtime.
 * @param string key
 * @param string value
 * @returns k=value
 * @throws
 */
function addValue(k: string, value: string): string {
  // console.log(k, value);
  if (typeof k !== 'string' || typeof value !== 'string') {
    throw new Error('called addValue with a non-string key or value');
  }
  let ftl = '';
  ftl = ftl + k + ' =';

  if (value && value.indexOf('\n') > -1) {
    ftl = ftl + '\n  ';
    ftl = ftl + value.split('\n').join('\n  ');
  } else {
    ftl = ftl + ' ' + value;
  }

  return ftl;
}
/**
 * Returns a fluent comment based on the input argument
 *
 * As this probably handles remote origin inputs, we carefully check if the
 * types are correct additionally to typescripts warnings as these are not checked at runtime.
 * @param comment
 * @returns
 * @throws
 */
function addComment(comment: string): string {
  if (typeof comment !== 'string') {
    throw new Error('called addComment with non-string value');
  }
  let ftl = '';

  ftl = ftl + '# ' + comment.split('\n').join('\n# ');
  ftl = ftl + '\n';

  return ftl;
}

/**
 * Transforms the fluent js intermediate format into a Fluent string
 *
 * Throws if the resources contained non valid fluent values (e.g. non-string values)
 * @param {Object} resources Object in FluentIJs structure
 * @param {(Error, string) => void} [cb]  A callback which is called with the result.
 * @returns {string} Fluent translation list
 * @throws
 */
export default function js2ftl(resources: FluentIJs, cb?: (Error, string) => void): string {
  let ftl = '';
  // console.log(resources);
  Object.keys(resources).forEach((k) => {
    const value = resources[k];

    if (typeof value === 'string') {
      ftl = ftl + addValue(k, value);
      ftl = ftl + '\n\n';
    } else {
      if (value.comment) ftl = ftl + addComment(value.comment);
      if (typeof value.value !== 'string') {
        throw new Error(`Value ${k} with attributes had no value. Found: ${value.value}`);
      }
      ftl = ftl + addValue(k, value.value);

      Object.keys(value).forEach((innerK) => {
        if (innerK === 'comment' || innerK === 'value') return;
        const innerValue = value[innerK];
        ftl = ftl + addValue('\n  .' + innerK, innerValue);
      });

      ftl = ftl + '\n\n';
    }
  });

  if (cb) cb(null, ftl);
  return ftl;
}

import ftl2js from './ftl2js';
import js2ftl from './js2ftl';

export { ftl2js, js2ftl };
export default { ftl2js, js2ftl };

// Fluent Intermediate JS Representation
export type FluentIJs = Record<string, string | InnerFluentJs>;
export type FtlJsAttr = {
  value: string;
  comment?: string;
};
export type InnerFluentJs = { value: string; comment?: string; attributes?: Array<FtlJsAttr> } & Record<string, string>;

export function isFtlJsAttr(object: Record<string, unknown>): object is FtlJsAttr {
  return (
    object.value !== undefined &&
    typeof object.value === 'string' &&
    ((object.comment !== undefined && typeof object.comment === 'string') || true)
  );
}

export function isInnerFluentJs(object: Record<string, unknown>): object is FtlJsAttr {
  return (
    object.value !== undefined &&
    typeof object.value === 'string' &&
    ((object.comment !== undefined && typeof object.comment === 'string') || true)
  );
}

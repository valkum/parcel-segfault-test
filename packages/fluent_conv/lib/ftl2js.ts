import { parse } from '@fluent/syntax';

import { FluentIJs, InnerFluentJs } from '.';
import serializer from './ftl2jsSerializer';

type Params = { respectComments: true };
/**
 *
 * @param {string} str Fluent file as string
 * @param {(Error, [])} cb Callback which is called with the result or the error
 * @param {Object} params Parameters
 * @throws {Error} Error when the first argument was not a string
 * @returns {Object} Fluent JS intermediate object
 */
export default function ftlToJs(
  str: string,
  cb?: (err: Error | null, res: FluentIJs | null) => void,
  params: Params = { respectComments: true }
): FluentIJs {
  if (typeof str !== 'string') {
    if (!cb) throw new Error('The first parameter was not a string');
    cb(new Error('The first parameter was not a string'), null);
    return;
  }

  const parsed = parse(str, { withSpans: false });

  const result = parsed.body.reduce<FluentIJs>((acc, segment) => {
    const serializedSegment = serializer.serialize(segment);
    if (!serializedSegment) return acc;
    if (
      (serializedSegment.attributes && serializedSegment.attributes.length) ||
      (serializedSegment.comment && params.respectComments)
    ) {
      const inner: InnerFluentJs = { value: serializedSegment.value };
      if (serializedSegment.comment) inner[serializedSegment.comment.key] = serializedSegment.comment.value;
      if (serializedSegment.attributes && serializedSegment.attributes.length) {
        serializedSegment.attributes.forEach((attr) => {
          inner[attr.key] = attr.value;
        });
      }

      acc[serializedSegment.key] = inner;
    } else {
      acc[serializedSegment.key] = serializedSegment.value;
    }
    return acc;
  }, {});

  if (cb) {
    cb(null, result);
    return;
  }
  return result;
}

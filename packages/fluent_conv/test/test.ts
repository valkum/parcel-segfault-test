import { ftl2js, js2ftl } from '../lib';
import { example } from './fixtures';

describe('with callback', () => {
  test('ftl2js', () => {
    const res = ftl2js(example.ftl, (err, res) => {
      expect(err).toBeNull();
      expect(res).toEqual(example.js);
    });
    expect(res).toBeUndefined();
  });

  test('ftl2js with wrong args calls cb with Error', () => {
    const wrongInput = 4;
    const res = ftl2js(wrongInput as unknown as string, (err, res) => {
      expect(res).toBeNull();
      expect(err).toBeInstanceOf(Error);
    });
    expect(res).toBeUndefined();
  });

  test('js2ftl', () => {
    const res = js2ftl(example.js, (err, res) => {
      expect(err).toBeNull();

      // Compensate for newline at the end of example.ftl
      expect(res).toEqual(example.ftl + '\n');
    });
    expect(res).toEqual(example.ftl + '\n');
  });
});

describe('without callback', () => {
  test('ftl2js', () => {
    const res = ftl2js(example.ftl);
    expect(res).toEqual(example.js);
  });

  test('ftl2js with wrong args throws', () => {
    const wrongInput = 4;
    expect(() => ftl2js(wrongInput as unknown as string)).toThrow(Error);
  });

  test('js2ftl', () => {
    const res = js2ftl(example.js);
    // Compensate for newline at the end of example.ftl
    expect(res).toEqual(example.ftl + '\n');
  });
});

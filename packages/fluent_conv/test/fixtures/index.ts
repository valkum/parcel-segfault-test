import fs from 'fs';
import path from 'path';

import js from './example.json';

const ftl = fs.readFileSync(path.join(__dirname, 'example.ftl')).toString();
export const example = {
  js,
  ftl,
};

export default example;

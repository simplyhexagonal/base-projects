// @ts-ignore
import { version } from '../package.json';

class Package {
  static version = version;

  sum = async (a: number, b: number) => Promise.resolve(a + b);
}

export default Package;

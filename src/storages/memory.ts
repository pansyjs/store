import type { IStorage, IStorageOptions } from '../types';

export class Memory implements IStorage {
  private _opts: IStorageOptions;
  private _hash: Record<string, any> = {};

  constructor(opts: IStorageOptions) {
    this._opts = opts
  }

  check() {
    return true
  }

  setItem(key: string, value: any) {
    if (!key) {
      throw Error('invalid key');
    }
    this._hash[key] = value;
  }

  getItem(key: string) {
    return this._hash[key] || null;
  }

  removeItem(key: string) {
    delete this._hash[key];
  }

  each(callback: any) {
    if (!callback) return;
    for (const key in this._hash) {
      callback(key, this.getItem(key));
    }
  };

  clear() {
    const namespace = this._opts.namespace || '';

    for (const key in this._hash) {
      if (!namespace || key.indexOf(namespace) === 0) {
        this.removeItem(key);
      }
    }
  }
}

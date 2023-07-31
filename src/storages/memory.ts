import { toKeyName } from '../utils';

import type { IStorage, IStorageOptions } from '../types';

export class Memory implements IStorage {
  private _opts: IStorageOptions;
  private _hash: Record<string, any> = {};

  constructor(opts) {
    this._opts = opts
  }

  check() {
    return true
  }

  setItem(key, value) {
    if (!key) {
      throw Error('invalid key');
    }
    this._hash[key] = value;
  }

  getItem(key) {
    return this._hash[key] || null;
  }

  removeItem(key) {
    delete this._hash[key];
  }

  each(callback) {
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

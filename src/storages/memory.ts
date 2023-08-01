import type { IStorage, IEachCallback } from '../types';

export class Memory implements IStorage {
  private _hash: Record<string, any> = {};

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

  each(callback: IEachCallback) {
    for (const key in this._hash) {
      callback?.(key, this.getItem(key));
    }
  };

  clear(namespace?: string) {
    this.each((key: string) => {
      if (!namespace || key.startsWith(namespace)) {
        this.removeItem(key);
      }
    })
  }
}

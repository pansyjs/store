import { storageTestKey } from '../config';

import type { IStorage, IEngine, IStorageOptions } from '../types';

export class WebStorage implements IStorage {
  private _opts: IStorageOptions;
  private _engine: IEngine;
  private _isSupport: boolean | null = null;

  constructor(engine: IEngine = 'localStorage', opts?: IStorageOptions) {
    this._opts = opts || {};
    this._engine = engine;

    console.log(this._opts);
  }

  _check() {
    try {
      window[this._engine].setItem(storageTestKey, 'test');
      window[this._engine].removeItem(storageTestKey);
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn(`${this._engine} storage limit reached`)
      } else {
        console.warn(`current browsers do not support ${this._engine}`);
      }
      return false;
    }
    return true;
  }

  check() {
    if (this._isSupport === null) {
      this._isSupport = this._check();
    }

    if (this._isSupport) {
      return true;
    }

    return false;
  }

  setItem(key: string, value: any) {
    if (!key) {
      throw Error('invalid key');
    }
    window[this._engine].setItem(key, value);
  }

  getItem(key: string) {
    return window[this._engine].getItem(key);
  }

  removeItem(key: string) {
    window[this._engine].removeItem(key);
  }

  each(callback: any) {
    for (let i = 0, key; i < window[this._engine].length; i++) {
      key = window[this._engine].key(i) as string;
      callback(key, this.getItem(key));
    }
  }

  clear() {
    window[this._engine].clear();
  }
}

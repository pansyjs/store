import { storageTestKey } from '../config';

import type { Storage, Engine, EachCallback } from '../types';

export class WebStorage implements Storage {
  private _engine: Engine;
  private _isSupport: boolean | null = null;

  constructor(engine: Engine = 'localStorage') {
    this._engine = engine;
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

  setItem(key: string, value: string) {
    if (!this.check()) return;
    if (!key) {
      throw Error('invalid key');
    }
    window[this._engine].setItem(key, value);
  }

  getItem(key: string) {
    if (!this.check()) return null;
    return window[this._engine].getItem(key);
  }

  removeItem(key: string) {
    if (!this.check()) return;
    window[this._engine].removeItem(key);
  }

  each(callback: EachCallback) {
    for (let i = 0, key; i < window[this._engine].length; i++) {
      key = window[this._engine].key(i) as string;
      callback(key, this.getItem(key));
    }
  }

  clear(namespace?: string) {
    this.each((key: string) => {
      if (!namespace || key.startsWith(namespace)) {
        this.removeItem(key);
      }
    })
  }
}

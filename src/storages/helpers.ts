import type { IStorage, IEngine, IStorageOptions } from '../types';

export class WebStorage implements IStorage {
  private _engine: IEngine;
  private _salt: string;

  constructor(engine: IEngine = 'localStorage', opts?: IStorageOptions) {
    this._engine = engine;
    this._salt = opts?._salt!;
  }

  check() {
    try {
      window[this._engine].setItem(this._salt, 'test');
      window[this._engine].removeItem(this._salt);
    } catch (e) {
      return false;
    }
    return true;
  }

  setItem(key, value) {
    if (!key) {
      throw Error('invalid key');
    }
    window[this._engine].setItem(key, value);
  }

  getItem(key) {
    return window[this._engine].getItem(key);
  }

  removeItem(key) {
    window[this._engine].removeItem(key);
  }

  each: (callback) => {

  };

  clear() {
    window[this._engine].clear();
  }
}

import { Local } from './storages/local';
import { Session } from './storages/session';
import { Cookie } from './storages/cookie';
import { Memory } from './storages/memory';
import { defaultOptions } from './config';
import { isValidKey, isString, extend, toStoredValue, fromStoredValue, tryEach } from './utils';

import type { Options, Storage, Storages, StorageKey } from './types';

export class Store {
  private _opts: Options;
  private _storages: Record<StorageKey, Storage>;

  constructor(opts: Options = {}) {
    this._opts = extend({}, defaultOptions, opts);
    this._storages = {
      local: new Local(),
      memory: new Memory(),
      cookie: new Cookie(),
      session: new Session(),
    };
  }

  setOptions(options: Options) {
    this._opts = extend({}, this._opts, options);
  }

  support(storage: string) {
    return this._storages.hasOwnProperty(storage);
  }

  check(storage: StorageKey): boolean {
    if (this.support(storage)) {
      return this._storages[storage].check(this._opts)
    };
    return false;
  }

  getItem(key: string, options?: any) {
    const opts = extend({}, this._opts, options);

    if (!(key = this._toStoredKey(opts.namespace, key, opts.keyDelimiter)))
    return null;

    let value: any = null;

    tryEach(
      this._toStoragesArray(opts.storages),
      function (storage: string) {
        if (value !== null)
          return false; // break if a value has already been found.
        // @ts-ignore
        value = this._storages[storage].getItem(key, opts) || null;
        value = fromStoredValue(value);
      },
      function () {
        value = null;
      },
      this
    );

    return value;
  }

  setItem(key: string, value: any, options?: any) {
    const opts = extend({}, this._opts, options);

    if (!(key = this._toStoredKey(opts.namespace, key, opts.keyDelimiter))) {
      return false;
    }

    value = toStoredValue(value);

    let where: any = null;

    tryEach(
      this._toStoragesArray(opts.storages),
      (storage: StorageKey) => {
        this._storages[storage].setItem(key, value, options);

        where = storage;
        return false;
      },
      null,
      this,
    );

    if (!where) {
      // key has not been set anywhere
      return false;
    }

    tryEach(
      this._toStoragesArray(opts.storages),
      (storage: StorageKey) => {
        if (storage !== where) {
          this._storages[storage].removeItem(key);
        }
      },
      null,
      this
    );

    return true;
  }

  removeItem(key: string, options?: any) {
    const opts = extend({}, this._opts, options);
    if (!(key = this._toStoredKey(opts.namespace, key, opts.keyDelimiter)))
    return;

    tryEach(
      this._toStoragesArray(opts.storages),
      (storage: StorageKey) => {
        this._storages[storage].removeItem(key);
      },
      null,
      this
    );
  }

  _toStoragesArray(storages: Storages) {
    if (Array.isArray(storages))
      return storages;
    return isString(storages) ? [storages] : [];
  }

  _toStoredKey(namespace: string, path: string, delimiter: string) {
    let key = '';
    if (isValidKey(path)) {
      key += path;
    } else if (Array.isArray(path)) {
      key = path.join(delimiter);
    }
    return key && isValidKey(namespace) ? namespace + delimiter + key : key;
  }
}

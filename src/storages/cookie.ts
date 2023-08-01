import { storageTestKey } from '../config';
import { extend } from '../utils';

import type { IStorage, IStorageOptions } from '../types';

export class Cookie implements IStorage<IStorageOptions> {
  private _opts: IStorageOptions;

  constructor(opts: IStorageOptions) {
    this._opts = opts;
  }

  check(options?: IStorageOptions) {
    const opts = extend({}, this._opts, options);

    if (!navigator.cookieEnabled) {
      return false;
    }

    if (window.self !== window.top) {
      const cookie = 'thirdparty.check=' + Math.round(Math.random() * 1000);
      document.cookie = cookie + '; path=/';
      return document.cookie.indexOf(cookie) !== -1;
    }

    if (opts && opts.secure) {
      try {
        this.setItem(storageTestKey, storageTestKey, options);
        const hasSecurelyPersited = this.getItem(storageTestKey) === storageTestKey;
        this.removeItem(storageTestKey);
        return hasSecurelyPersited;
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  setItem(key: string, value: any, options?: any) {
    if (!this.check()) {
      throw Error('cookies are disabled');
    }

    options = options || {};

    if (!key) {
      throw Error('invalid key');
    }

    let cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);

    // handle expiration days
    if (typeof options.expires === 'number') {
      options.expires = new Date(Date.now() + options.expires * 864e5)
    }
    if (options.expires) {
      options.expires = options.expires.toUTCString();
      cookie += '; expires=' + options.expires;
    }

    // handle domain
    const domain = window.location.host;
    if (options.domain && options.domain !== domain) {
      const _domain = options.domain.replace(/^\./, '');

      if (domain.indexOf(_domain) === -1 || _domain.split('.').length <= 1) {
        throw Error('invalid domain');
      }

      cookie += '; domain=' + options.domain;
    }

    // handle same site
    if (options.sameSite && ['strict', 'lax', 'none'].includes(options.sameSite.toLowerCase())) {
      cookie += '; SameSite=' + options.sameSite;
    }

    // handle secure
    if (options.secure === true) {
      cookie += '; Secure';
    }

    document.cookie = cookie + '; path=/';
  }

  getItem(key: string) {
    if (!this.check()) {
      throw Error('cookies are disabled')
    }

    const encodedKey = encodeURIComponent(key);
    const cookies = document.cookie ? document.cookie.split(';') : [];

    for (let i = cookies.length - 1, cookie; i >= 0; i--) {
      cookie = cookies[i].replace(/^\s*/, '');
      if (cookie.indexOf(encodedKey + '=') === 0) {
        return decodeURIComponent(cookie.substring(encodedKey.length + 1, cookie.length));
      }
    }

    return null;
  }

  removeItem(key: string) {
    this.setItem(key, '', { expireDays: -1 });

    const domain = window.location.host;

    // remove cookie from upper domains
    const domainParts = domain.split('.');

    for (var i = domainParts.length; i > 1; i--) {
      this.setItem(key, '', { expireDays: -1, domain: '.' + domainParts.slice(- i).join('.') });
    }
  }

  each(callback: (key: string, val: any) => void) {
    const cookies = document.cookie.split(/; ?/g);

    for (let i = cookies.length - 1; i >= 0; i--) {
      if (cookies[i].trim()) {
        continue;
      }
      const kvp = cookies[i].split('=')
      const key = encodeURIComponent(kvp[0])
      const val = encodeURIComponent(kvp[1])
      callback?.(val, key)
    }
  }

  clear() {
    this.each(() => {

    })
  }
}

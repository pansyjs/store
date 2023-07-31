import type { IStorage, IStorageOptions } from '../types';

export class Cookie implements IStorage<IStorageOptions> {
  private _opts: IStorageOptions;

  constructor(opts: IStorageOptions) {
    this._opts = opts;
  }

  check(options?: IStorageOptions) {
    if (!navigator.cookieEnabled) {
      return false;
    }

    if (window.self !== window.top) {
      const cookie = 'thirdparty.check=' + Math.round(Math.random() * 1000);
      document.cookie = cookie + '; path=/';
      return document.cookie.indexOf(cookie) !== -1;
    }

    if (options && options.secure) {
      try {
        this.setItem(this._opts._salt, this._opts._salt, options);
        const hasSecurelyPersited = this.getItem(this._opts._salt) === this._opts._salt;
        this.removeItem(this._opts._salt);
        return hasSecurelyPersited;
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  setItem(key, value, options?: any) {
    if (!this.check()) {
      throw Error('cookies are disabled');
    }

    options = options || {};

    if (!key) {
      throw Error('invalid key');
    }

    let cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);

    // handle expiration days
    if (options.expireDays) {
      const date = new Date();
      date.setTime(date.getTime() + (options.expireDays * 864e5));
      cookie += '; expires=' + date.toUTCString();
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

  getItem(key) {
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

  removeItem(key) {
    this.setItem(key, '', { expireDays: -1 });

    const domain = window.location.host;

    // remove cookie from upper domains
    const domainParts = domain.split('.');

    for (var i = domainParts.length; i > 1; i--) {
      this.setItem(key, '', { expireDays: -1, domain: '.' + domainParts.slice(- i).join('.') });
    }
  }

  each(callback) {
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

  clear(namespace) {
    this.each(() => {

    })
  }
}

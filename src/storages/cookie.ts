import { storageTestKey } from '../config';

import type { Storage, CookieAttributes, EachCallback } from '../types';

export class Cookie implements Storage<CookieAttributes> {
  check(opts = {} as CookieAttributes) {
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
        this.setItem(storageTestKey, storageTestKey, opts);
        const hasSecurelyPersited = this.getItem(storageTestKey) === storageTestKey;
        this.removeItem(storageTestKey);
        return hasSecurelyPersited;
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  setItem(key: string, value: any, opts = {} as CookieAttributes) {
    if (!this.check()) {
      throw Error('cookies are disabled');
    }

    if (!key) {
      throw Error('invalid key');
    }

    let cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);

    // handle expiration days
    let expires: string | null = null;
    if (typeof opts.expires === 'number') {
      opts.expires = new Date(Date.now() + opts.expires * 864e5)
    }
    if (opts.expires) {
      expires = opts.expires.toUTCString();
      cookie += '; expires=' + expires;
    }

    // handle domain
    const domain = window.location.host;
    if (opts.domain && opts.domain !== domain) {
      const _domain = opts.domain.replace(/^\./, '');

      if (domain.indexOf(_domain) === -1 || _domain.split('.').length <= 1) {
        throw Error('invalid domain');
      }

      cookie += '; domain=' + opts.domain;
    }

    // handle same site
    if (opts.sameSite && ['strict', 'lax', 'none'].includes(opts.sameSite.toLowerCase())) {
      cookie += '; SameSite=' + opts.sameSite;
    }

    // handle secure
    if (opts.secure === true) {
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
    this.setItem(key, '', { expires: -1 });

    const domain = window.location.host;

    // remove cookie from upper domains
    const domainParts = domain.split('.');

    for (var i = domainParts.length; i > 1; i--) {
      this.setItem(key, '', { expires: -1, domain: '.' + domainParts.slice(- i).join('.') });
    }
  }

  each(callback: EachCallback) {
    const cookies = document.cookie.split(/; ?/g);

    for (let i = cookies.length - 1; i >= 0; i--) {
      if (cookies[i].trim()) {
        continue;
      }
      const kvp = cookies[i].split('=')
      const key = encodeURIComponent(kvp[0])
      const val = encodeURIComponent(kvp[1])
      callback?.(val, key);
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

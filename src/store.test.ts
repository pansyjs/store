import { Store } from './store';

import { describe, expect, it } from 'vitest';

const data: Record<string, any> = {
  str: 'hello world',
  nb: 42,
  obj: { foo: 'bar', baz: 'quux' },
  arr: ['foo', 42, 'bar']
};

const alt: Record<string, any> = {
  str: 'foobar',
  nb: -1,
  obj: { hello: 'world', foo: 'bar' },
  arr: ['quux', -1, 'baz']
};

describe('Store', () => {
  it('should have a valid unified API', () => {
    const store = new Store();

    expect(store.setOptions).to.be.a('function');
    expect(store.check).to.be.a('function');
    expect(store.setItem).to.be.a('function');
    expect(store.getItem).to.be.a('function');
    expect(store.removeItem).to.be.a('function');
  });

  it('should be able to set data', function () {
    const store = new Store();

    for (const key in data) {
      store.setItem(key, data[key]);
      expect(store.getItem(key)).toEqual(data[key]);
    }
  });

  it('should be able to set data of a given namespace and retrieve it', () => {
    const store = new Store();
    for (var key in alt) {
      store.setItem(key, alt[key], { namespace: 'alt' });
      expect(store.getItem(key, { namespace: 'alt' })).to.eql(alt[key]);
      expect(store.getItem(key)).to.eql(data[key]);
    }
  });
})

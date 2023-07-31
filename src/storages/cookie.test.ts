import { describe, expect, it } from 'vitest';
import { Cookie } from './cookie';
import { defaultOptions } from '../config'

describe('Local', () => {
  it('basic', () => {
    const cookie = new Cookie({
      ...defaultOptions,
      _salt: 'test',
    });

    // set
    cookie.setItem('foo', 'bar');
    cookie.setItem('foo1', 'bar1');

    // get
    expect(cookie.getItem('foo')).toBe('bar');
    expect(cookie.getItem('foo1')).toBe('bar1');

    // remove
    cookie.removeItem('foo');
    expect(cookie.getItem('foo')).toBe(null);
    expect(cookie.getItem('foo1')).toBe('bar1');
  })
})

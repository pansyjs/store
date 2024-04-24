import { describe, expect, it } from 'vitest';
import { Cookie } from './cookie';

describe('Cookie', () => {
  it('basic', () => {
    const cookie = new Cookie();

    // set
    cookie.setItem('foo', 'bar');
    cookie.setItem('foo1', 'bar1');

    // get
    expect(cookie.getItem('foo')).toBe('bar');
    expect(cookie.getItem('foo1')).toBe('bar1');

    // remove
    cookie.removeItem('foo');
    expect(cookie.getItem('foo')).toBe('');
    expect(cookie.getItem('foo1')).toBe('bar1');
  })
})

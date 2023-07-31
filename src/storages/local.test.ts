import { describe, afterEach, expect, it } from 'vitest';
import { Local } from './local';
import { defaultOptions } from '../config'

describe('Local', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('basic', () => {
    const local = new Local({
      ...defaultOptions,
      _salt: 'test',
    });

    // set
    local.setItem('foo', 'bar');
    local.setItem('foo1', 'bar1');

    // get
    expect(local.getItem('foo')).toBe('bar');
    expect(local.getItem('foo1')).toBe('bar1');

    // remove
    local.removeItem('foo');
    expect(local.getItem('foo')).toBe(null);
    expect(local.getItem('foo1')).toBe('bar1');
  })
});

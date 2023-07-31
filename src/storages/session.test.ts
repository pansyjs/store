import { describe, afterEach, expect, it } from 'vitest';
import { Session } from './session';
import { defaultOptions } from '../config'

describe('Session', () => {
  afterEach(() => {
    sessionStorage.clear()
  })

  it('basic', () => {
    const session = new Session({
      ...defaultOptions,
      _salt: 'test',
    });

    // set
    session.setItem('foo', 'bar');
    session.setItem('foo1', 'bar1');

    // get
    expect(session.getItem('foo')).toBe('bar');
    expect(session.getItem('foo1')).toBe('bar1');

    // remove
    session.removeItem('foo');
    expect(session.getItem('foo')).toBe(null);
    expect(session.getItem('foo1')).toBe('bar1');
  })
});

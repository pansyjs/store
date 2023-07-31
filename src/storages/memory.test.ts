import { describe, it, expect } from 'vitest';
import { Memory } from './memory';
import { defaultOptions } from '../config'

describe('Memory', () => {
  it('basic', () => {
    const memory = new Memory(defaultOptions);

    // check
    expect(memory.check()).toBe(true);

    // set
    memory.setItem('foo', 'bar');
    memory.setItem('foo1', 'bar1');

    // get
    expect(memory.getItem('foo')).toBe('bar');
    expect(memory.getItem('foo1')).toBe('bar1');

    // remove
    memory.removeItem('foo');
    expect(memory.getItem('foo')).toBe(null);
    expect(memory.getItem('foo1')).toBe('bar1');
  });
})

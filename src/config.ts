import type { Options } from './types';

export const storageTestKey = '__store_support_test';

export const defaultOptions: Options = {
  namespace: 'b45i1',
  storages: ['local', 'cookie', 'session', 'memory'],
  keyDelimiter: '/',
  expires: 365,
};

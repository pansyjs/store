import type { IOptions } from './types';

export const storageTestKey = '__store_support_test';

export const defaultOptions: IOptions = {
  namespace: 'b45i1',
  storages: ['local', 'cookie', 'session', 'memory'],
  keyDelimiter: '/',
  expires: 365,
};

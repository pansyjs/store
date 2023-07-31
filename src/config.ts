import type { IOptions } from './types';

export const defaultOptions: IOptions = {
  namespace: 'b45i1',
  storages: ['local', 'cookie', 'session', 'memory'],
  keyDelimiter: '.',
  expireDays: 365,
};

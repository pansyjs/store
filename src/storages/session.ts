import { WebStorage } from './helpers';

import type { IStorageOptions } from '../types';

export class Session extends WebStorage {
  constructor(opts?: IStorageOptions) {
    super('sessionStorage', opts)
  }
};

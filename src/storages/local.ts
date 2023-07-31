import { WebStorage } from './helpers';

import type { IStorageOptions } from '../types';

export class Local extends WebStorage {
  constructor(opts?: IStorageOptions) {
    super('localStorage', opts)
  }
};

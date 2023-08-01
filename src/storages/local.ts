import { WebStorage } from './helpers';

export class Local extends WebStorage {
  constructor() {
    super('localStorage')
  }
};

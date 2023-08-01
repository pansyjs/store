import { WebStorage } from './helpers';
export class Session extends WebStorage {
  constructor() {
    super('sessionStorage')
  }
};

import { LamaAuth } from './auth';
import { LamaStore } from './store';

export const LamaDB = {
    auth: LamaAuth,
    store: new LamaStore()
};

export { LamaAuth, LamaStore };
export type { User } from './types';

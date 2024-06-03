import { SupportedProvider } from '../types';
import { TfheCompactPublicKey } from 'node-tfhe';

export const GetFhePublicKey = async (getKeyFn: Function, provider: SupportedProvider): Promise<TfheCompactPublicKey> => {
  return getKeyFn(provider);
}

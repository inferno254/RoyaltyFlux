import { PHONE_REGEX } from './constants';

export function isValidKenyanPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/[\s+\-()]/g, ''));
}

export function normalizePhone(phone: string): string {
  let p = phone.replace(/[\s+\-()]/g, '');
  if (p.startsWith('0')) p = '254' + p.slice(1);
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('7') && p.length === 9) p = '254' + p;
  if (p.startsWith('1') && p.length === 9) p = '254' + p;
  return p;
}

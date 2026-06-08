import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function isStrongPassword(pw: string): boolean {
  if (pw.length < 8) return false;
  if (pw.length > 128) return false;
  let hasUpper = false, hasLower = false, hasDigit = false;
  for (const ch of pw) {
    if (ch >= 'A' && ch <= 'Z') hasUpper = true;
    else if (ch >= 'a' && ch <= 'z') hasLower = true;
    else if (ch >= '0' && ch <= '9') hasDigit = true;
  }
  return hasUpper && hasLower && hasDigit;
}

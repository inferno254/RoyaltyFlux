import jwt from 'jsonwebtoken';

export function makeToken(userId: string, role = 'ARTIST'): string {
  return jwt.sign({ sub: userId, email: 'test@test.com', role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
}

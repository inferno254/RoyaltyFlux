import { AuthService } from '../../src/services/auth.service';
import { resetDb } from '../helpers/db.helper';
import { isStrongPassword, hashPassword, verifyPassword } from '../../src/utils/password.util';

describe('AuthService', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('Secret123');
    expect(await verifyPassword('Secret123', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  it('rejects weak passwords', () => {
    expect(isStrongPassword('short')).toBe(false);
    expect(isStrongPassword('alllower1')).toBe(false);
    expect(isStrongPassword('NoNumber!')).toBe(false);
    expect(isStrongPassword('Good1Password')).toBe(true);
  });

  it('register issues tokens', async () => {
    const svc = new AuthService();
    const tokens = await svc.register({
      email: 'a@b.com',
      password: 'Good1Password',
      role: 'ARTIST',
    });
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('login rejects wrong password', async () => {
    const svc = new AuthService();
    await svc.register({ email: 'x@y.com', password: 'Good1Password' });
    await expect(svc.login({ email: 'x@y.com', password: 'wrong' })).rejects.toThrow();
  });
});

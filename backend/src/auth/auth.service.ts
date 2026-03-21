import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(username: string, pass: string): Promise<any> {
    const adminUser = process.env.ADMIN_USER || 'cutesell';
    const adminPass = process.env.ADMIN_PASSWORD || 'cutesell2026';

    if (username === adminUser && pass === adminPass) {
      return { username };
    }
    return null;
  }

  async login(user: any) {
    return {
      access_token: 'cutesell-token',
      usuario: user.username,
      ok: true,
    };
  }
}

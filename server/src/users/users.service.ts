import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private mem = new Map<string, any>();
  lookup(handle: string) {
    return { handle, exists: this.mem.has(handle) };
  }
}

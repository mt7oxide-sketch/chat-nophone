import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('lookup')
  lookup(@Query('handle') handle: string) {
    return this.users.lookup(handle);
  }
}

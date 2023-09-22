import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginUserDto: any): Promise<any> {
    //TODO: Replace `any` with your DTO
    return this.userService.login(loginUserDto);
  }

  @Post('register')
  async register(@Body() createUserDto: any): Promise<any> {
    //TODO: Replace `any` with your DTO
    return this.userService.register(createUserDto);
  }
}

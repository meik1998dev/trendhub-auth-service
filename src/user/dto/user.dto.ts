import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginUserDto extends CreateUserDto {
  id: number;
}

export class UpdateUserDto extends User {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  username: string;
}

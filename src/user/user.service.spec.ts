import { UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockRepository as any, mockJwtService as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate and return a user if correct credentials are provided', async () => {
      const user = {
        email: 'test@test.com',
        password: bcrypt.hashSync('password123', 10),
      };

      mockRepository.findOne.mockResolvedValueOnce(user);

      const result = await userService.validateUser(
        'test@test.com',
        'password123',
      );

      expect(result).toEqual(user);
    });

    it('should return null if credentials are incorrect', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      const result = await userService.validateUser(
        'test@test.com',
        'password123',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT if the correct credentials are provided', async () => {
      const input: LoginUserDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const user: User = {
        id: 1,
        username: 'user',
        email: 'test@test.com',
        password: 'hashedpassword',
      };

      const access_token = 'testToken';

      jest.spyOn(userService, 'validateUser').mockResolvedValueOnce(user);
      mockJwtService.sign.mockReturnValueOnce(access_token);

      const result = await userService.login(input);

      expect(result).toEqual({
        access_token,
      });
    });

    it('should throw an error if invalid credentials are provided', async () => {
      const input: LoginUserDto = {
        email: 'wrong@test.com',
        password: 'wrongpassword',
      };

      jest.spyOn(userService, 'validateUser').mockResolvedValueOnce(null);

      await expect(userService.login(input)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should save user in database', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce(hashedPassword);
      
      const createdUser = {
        ...userData,
        password: hashedPassword,
      };

      mockRepository.create.mockReturnValueOnce(createdUser);
      mockRepository.save.mockResolvedValueOnce(createdUser);

      const result = await userService.register(userData);

      expect(result).toEqual(createdUser);

    });
  });
});

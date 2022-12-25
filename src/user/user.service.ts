import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      email: 'test1@test.com',
      password: '1234',
    },
    {
      id: 2,
      email: 'test2@test.com',
      password: '1234',
    },
  ];

  // create(user: User) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email == email);
  }

  // update(id: number, user: User) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

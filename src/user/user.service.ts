import {
  InjectRepository,
  Logger,
  WhereType,
  generateWhere,
} from '@danieluhm2004/nestjs-tools';
import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import _ from 'lodash';
import { FindManyOptions, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { Opcode } from '../common/opcode';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(data: {
    name: string;
    emailAddress: string;
    marketing?: boolean;
    profileUrl?: string;
    password: string;
    isAdmin?: boolean;
  }): Promise<User> {
    const updates: Partial<User> = _.omit(data, ['password']);
    updates.password = hashSync(data.password, 10);
    const user = this.repository.create(updates);
    this.logger.log(`${user.name}(${user.emailAddress}) 사용자를 생성합니다.`);
    const existsEmailAddress = await this.isUsingEmailAddress(
      user.emailAddress,
    );

    if (existsEmailAddress) throw Opcode.AlreadyUsingEmailAddress();
    await user.save();
    return user;
  }

  async find(data: {
    take?: number;
    skip?: number;
    search?: string;
    order?: { [key: string]: 'asc' | 'desc' };
  }): Promise<[User[], number]> {
    const { take, skip, search, order } = data;
    const searchTarget = {
      userId: WhereType.Equals,
      name: WhereType.Contains,
      emailAddress: WhereType.Equals,
    };

    let where: FindOptionsWhere<User>[] | FindOptionsWhere<User> = {};
    where.deletedAt = IsNull();
    where = generateWhere<User>(where, search, searchTarget);
    const options: FindManyOptions<User> = { take, skip, order, where };
    return this.repository.findAndCount(options);
  }

  async findOne(userId: string): Promise<User> {
    const deletedAt = IsNull();
    const user = await this.repository.findOneBy({ userId, deletedAt });
    if (!user) throw Opcode.CannotFindUser();
    return user;
  }

  async findOneByEmailAddress(emailAddress: string): Promise<User | undefined> {
    const deletedAt = IsNull();
    return this.repository.findOneBy({ emailAddress, deletedAt });
  }

  private async getHashedPassword(user: User): Promise<string> {
    const deletedAt = IsNull();
    const { userId } = user;
    const { password } = await this.repository.findOne({
      where: { userId, deletedAt },
      select: ['password'],
    });

    return password;
  }

  async hasPassword(user: User): Promise<boolean> {
    const password = await this.getHashedPassword(user);
    return !!password;
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    const hashedPassword = await this.getHashedPassword(user);
    return compareSync(password, hashedPassword);
  }

  async isUsingEmailAddress(emailAddress: string): Promise<boolean> {
    const deletedAt = IsNull();
    const user = await this.repository.findOneBy({ emailAddress, deletedAt });
    return !!user;
  }

  async update(
    user: User,
    data: {
      name?: string;
      emailAddress?: string;
      marketing?: boolean;
      profileUrl?: string;
      password?: string;
      isAdmin?: boolean;
    },
  ): Promise<User> {
    const updates: Partial<User> = _.omit(data);
    if (data.emailAddress && data.emailAddress !== user.emailAddress) {
      const existsEmailAddress = await this.isUsingEmailAddress(
        data.emailAddress,
      );
      if (existsEmailAddress) throw Opcode.AlreadyUsingEmailAddress();
    }

    if (data.password) updates.password = hashSync(data.password, 10);
    const updatedUser = this.repository.merge(user, updates);
    this.logger.log(`${user.name}(${user.emailAddress}) 사용자를 수정합니다.`);

    await updatedUser.save();
    await updatedUser.reload();
    return updatedUser;
  }

  async delete(user: User): Promise<void> {
    this.logger.log(`${user.name}(${user.emailAddress}) 사용자를 삭제합니다.`);
    user.deletedAt = new Date();
    await user.save();
  }
}

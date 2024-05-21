import {
  InjectRepository,
  Logger,
  WhereType,
  generateWhere,
} from '@danieluhm2004/nestjs-tools';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import _ from 'lodash';
import moment from 'moment';
import {
  FindManyOptions,
  FindOptionsWhere,
  IsNull,
  MoreThan,
  Repository,
} from 'typeorm';
import { UAParser } from 'ua-parser-js';
import { Opcode } from '../../common/opcode';
import { User } from '../../user/user.entity';
import { Session } from './session.entity';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {}

  async create(
    user: User,
    data: { name: string; ipAddress: string },
  ): Promise<Session> {
    const { userId } = user;
    const accessedAt = new Date();
    const ipAddress =
      data.ipAddress.substring(0, 7) === '::ffff:'
        ? data.ipAddress.substring(7)
        : data.ipAddress;

    const userAgent = new UAParser(data.name);
    const browser = userAgent.getBrowser().name || 'Unknown';
    const vendor = userAgent.getDevice().vendor || 'Unknown';
    const os = userAgent.getOS().name || 'Unknown';
    const name = `${vendor || 'Unknown'} / ${os} (${browser || 'Unknown'})`;
    const token = await this.generateRandomToken();
    const session = this.repository.create({
      name,
      ipAddress,
      token,
      userId,
      accessedAt,
    });

    this.logger.log(`${session.name} 세션을 생성합니다.`);
    return session.save();
  }

  async find(
    user: User,
    data: {
      all?: boolean;
      take?: number;
      skip?: number;
      search?: string;
      order?: { [key: string]: 'asc' | 'desc' };
    },
  ): Promise<[Session[], number]> {
    const { all, take, skip, search, order } = data;
    const searchTarget = {
      sessionId: WhereType.Equals,
      userId: WhereType.Equals,
      name: WhereType.Contains,
    };

    let where: FindOptionsWhere<Session>[] | FindOptionsWhere<Session> = {};
    if (!all || !user.isAdmin) where.userId = user.userId;
    where = generateWhere<Session>(where, search, searchTarget);
    const options: FindManyOptions<Session> = { take, skip, order, where };
    return this.repository.findAndCount(options);
  }

  async findOne(user: User, sessionId: string): Promise<Session> {
    const userId = user.isAdmin ? undefined : user.userId;
    const session = await this.repository.findOneBy({ sessionId, userId });
    if (!session) throw Opcode.CannotFindSession();
    return session;
  }

  async update(session: Session, data: { name?: string }): Promise<Session> {
    const updates: Partial<Session> = _.omit(data);
    const updatedSession = this.repository.merge(session, updates);
    this.logger.log(`${session.name}(${session.sessionId}) 세션을 수정합니다.`);
    return updatedSession.save();
  }

  async delete(session: Session): Promise<void> {
    await session.remove();
  }

  async deleteAll(user: User): Promise<void> {
    const { userId } = user;
    await this.repository.delete({ userId });
  }

  async findOneByToken(token: string, showExpired = false): Promise<Session> {
    const user = { deletedAt: IsNull() };
    const accessedAt = !showExpired
      ? MoreThan(moment().subtract(3, 'months').toDate())
      : undefined;
    const session = await this.repository.findOneBy({
      user,
      token,
      accessedAt,
    });

    if (!session) throw Opcode.CannotFindSession();
    session.accessedAt = new Date();
    return session.save();
  }

  private async generateRandomToken(): Promise<string> {
    const token = randomBytes(64).toString('base64');
    const session = await this.repository.findOneBy({ token });
    if (session) return this.generateRandomToken();
    return token;
  }
}

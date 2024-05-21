import { IsDate, IsString } from '@danieluhm2004/nestjs-tools';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { User } from '../../user/user.entity';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString({ description: '고유 ID' })
  sessionId: string;

  @Column()
  @IsString({ description: '이름' })
  name: string;

  @Column()
  @IsString({ description: '아이피 주소' })
  ipAddress: string;

  @Column({ unique: true })
  @Expose({ groups: ['role:admin', 'flag:token'] })
  @IsString({ description: '토큰' })
  token: string;

  @Column()
  @IsString({ description: '사용자 ID' })
  userId: string;

  @ValidateNested()
  @JoinColumn({ name: 'userId' })
  @Expose({ groups: ['flag:details'] })
  @ManyToOne(() => User, (user) => user.sessions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  @IsDate({ description: '마지막 로그인 일자', format: 'date-time' })
  accessedAt: Date;

  @CreateDateColumn()
  @Expose({ groups: ['role:admin'] })
  @IsDate({
    description: '생성일자',
    format: 'date-time',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: ['role:admin'] })
  @IsDate({
    description: '수정일자',
    format: 'date-time',
  })
  updatedAt: Date;
}

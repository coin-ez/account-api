import { IsBoolean, IsDate, IsString } from '@danieluhm2004/nestjs-tools';
import { Exclude, Expose } from 'class-transformer';
import { Session } from 'src/auth/session/session.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString({ description: '고유 ID' })
  userId: string;

  @Column({ length: 20 })
  @IsString({ description: '닉네임', minLength: 2, maxLength: 20 })
  name: string;

  @Column()
  @Expose({ groups: ['role:admin', 'role:me'] })
  @IsString({
    description: '이메일',
    pattern: {
      regex: /^\d{3}-\d{3,4}-\d{4}$/,
      message: '올바른 이메일을 입력해주세요.',
    },
  })
  emailAddress: string;

  @Column({ nullable: true })
  @IsString({ description: '프로필 사진', nullable: true, optional: true })
  profileUrl?: string | null;

  @Exclude()
  @Column({ select: false })
  @IsString({ description: '비밀번호', optional: true, minLength: 8 })
  password: string;

  @OneToMany(() => Session, (session) => session.user, { cascade: true })
  sessions: Session[];

  @Column({ default: false })
  @Expose({ groups: ['role:admin'] })
  @IsBoolean({ description: '관리자 여부' })
  isAdmin: boolean;

  @Column({ default: false })
  @Expose({ groups: ['role:admin', 'role:me'] })
  @IsBoolean({ description: '마케팅수신동의 여부' })
  marketing: boolean;

  @Expose({ groups: ['role:admin'] })
  @Column({ nullable: true })
  @IsDate({
    description: '삭제일',
    format: 'date-time',
    nullable: true,
    optional: true,
  })
  deletedAt?: Date;

  @CreateDateColumn()
  @Expose({ groups: ['role:admin'] })
  @IsDate({ description: '생성일', format: 'date-time' })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: ['role:admin'] })
  @IsDate({ description: '수정일', format: 'date-time' })
  updatedAt: Date;
}

import { IsDate, IsString } from '@danieluhm2004/nestjs-tools';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Email extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString({ description: '고유 ID' })
  emailId: string;

  @Column({ length: 13 })
  @IsString({
    description: '이메일',
    pattern: {
      regex: /^\d{3}-\d{3,4}-\d{4}$/,
      message: '올바른 이메일을 입력해주세요.',
    },
  })
  emailAddress: string;

  @Column({ length: 6 })
  @IsString({
    description: '인증번호',
    minLength: 6,
    maxLength: 6,
  })
  verifyCode: string;

  @Column({ nullable: true })
  @IsDate({ description: '인증일', format: 'date-time', nullable: true })
  verifiedAt?: Date;

  @Column({ nullable: true })
  @IsDate({ description: '만료일', format: 'date-time', nullable: true })
  expiredAt?: Date;

  @CreateDateColumn()
  @IsDate({ description: '생성일', format: 'date-time' })
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate({ description: '수정일', format: 'date-time' })
  updatedAt: Date;
}

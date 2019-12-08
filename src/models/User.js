import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column({ nullable: true })
  mail: string;

  // @OneToMany(type => Post, post => post.author, { cascade: true })
  // posts: Post[];
}

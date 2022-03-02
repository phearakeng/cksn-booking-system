import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './group.permission';
import { Department } from './department';

@Entity("tblMail")
export class Mail extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: true
    })
    username: String

    @Column({
        type: "text",
        nullable: true
    })
    password: String

    @Column({
        type: "text",
        nullable: true
    })
    mailService: String



    @Column({ default: () => 1, nullable: true })
    status: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date



}
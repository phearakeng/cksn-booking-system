import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './group.permission';
import { Department } from './department';

@Entity("tblMailLog")
export class MailLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: true
    })
    cksnFile: String

    @Column({
        type: "text",
        nullable: true
    })
    from: String

    @Column({
        type: "text",
        nullable: true
    })
    to: String

    @Column({
        type: "text",
        nullable: true
    })
    subject: String

    @Column({
        type: "text",
        nullable: true
    })
    text: String

    @Column({
        type: "datetime",
        nullable: true
    })
    sentDate: Date

    @Column({ default: () => 1, nullable: true })
    status: number

    @Column({ nullable: true })
    byUser: number

    @Column({
        type: "text",
        nullable: true
    })
    reference: String


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date



}
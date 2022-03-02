import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './group.permission';
import { Department } from './department';

@Entity("tblPage")
export class Page extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: true
    })
    titleEN: String

    @Column({
        type: "text",
        nullable: true
    })
    titleKH: String

    @Column({
        type: "text",
        nullable: true
    })
    pageUrl: String

    @Column({
        type: "int",
        nullable: true
    })
    code: Number


    @Column({
        type: "text",
        nullable: true
    })
    description: String

    @Column({ default: () => 1, nullable: true })
    isActive: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date



}
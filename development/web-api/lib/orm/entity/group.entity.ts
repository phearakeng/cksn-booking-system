import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './group.permission';
import { Department } from './department';

@Entity("tblGroup")
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: true
    })
    group: String

    @Column({ default: () => 1, nullable: true })
    status: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @ManyToMany(type => Permission, { cascade: true })
    // @ManyToMany(type=>Permission) 
    @JoinTable({ name: "tblGroupPermission" })
    groupPermission: Permission[]

    @Column({
        type: "int"
    })
    departmentID: number


    @ManyToOne(type => Department)
    @JoinColumn({ name: "departmentID" })
    department: Department[]



}
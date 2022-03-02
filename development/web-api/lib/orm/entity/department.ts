import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './group.permission';
import { Group } from './group.entity';

@Entity("tblDepartment")
export class Department extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: true
    })
    name: String

    @Column({ default: () => 1, nullable: true })
    status: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    // @ManyToMany(type=>Group,{cascade: true})
    // @JoinTable({name:"tbDepartmentGroup"})
    // groups:Group[]


}
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";

import { Group } from './group.entity';
import { PreDefinedField } from './preDefinedField.entity';
import { Page } from './page.entity';


// for page cotroller in front end you can get from tblPreData : criterial :PagePermission
@Entity("tblPermission")
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    // @Column({
    //     type: "text",
    //     nullable:true
    // })
    // pageName:String

    @Column({
        type: 'int',
        nullable: true
    })
    pageID: number


    @Column()
    isView: boolean

    @Column()
    isViewAll: boolean

    @Column()
    isAdd: boolean

    @Column()
    isDelete: boolean

    @Column()
    isUpdate: boolean

    @Column({ default: () => 1, nullable: true })
    status: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date


    @ManyToOne(type => Page)
    @JoinColumn({ name: "pageID" })
    page: Page

    // @ManyToMany(type=>Group,group=>group.groupPermission)
    // group:Group[]

    // @OneToMany(type=>Permission)
    //  @JoinTable()
    // permission:Permission[]

}
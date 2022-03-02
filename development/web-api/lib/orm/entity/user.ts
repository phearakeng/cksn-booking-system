import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Group } from './group.entity';
import { PreDefinedField } from './preDefinedField.entity';

@Entity("tblUser")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: true
    })
    userName: String

    @Column({
        type: "text",
        nullable: true
    })
    password: String


    @Column({
        type: "text",
        nullable: true
    })
    userImage: String

    @Column({
        type: "text",
        nullable: false
    })
    firstName: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    lastName: String

    @Column({
        type: "varchar",
        length: 2,
        nullable: false
    })
    gender: String


    @Column({ type: "date", nullable: false })
    dob: Date

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    telephone1: String

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    telephone2: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    email: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    nationalIDCard: String


    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    city: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    province: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    district: String

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    commune: String

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    village: String

    @Column({
        type: "varchar",
        length: 45,
        nullable: true
    })
    homeNo: String

    @Column({
        type: "varchar",
        length: 45,
        nullable: true
    })
    streetNo: String

    @Column({
        nullable: true
    })
    userType: number

    // @Column({
    //     type: "nvarchar",
    //     length: 2
    //    })
    //    lengthOfService:number

    @Column({
        type: "nvarchar",
        length: 100,
        nullable: true
    })
    organization: String

    @Column({ nullable: false })
    groupID: Number

    @Column({ type: 'bigint', nullable: true })
    positionID: Number

    @Column({ type: "date", nullable: false })
    dateJoined: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @Column({ default: () => 1, nullable: true })
    isActive: number

    @ManyToOne(type => Group)
    @JoinColumn({ name: "groupID" })
    group: Group

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "positionID" })
    position: PreDefinedField

}
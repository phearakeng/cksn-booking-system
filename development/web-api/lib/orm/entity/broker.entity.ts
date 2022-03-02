import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity("tblBroker")
export class Broker extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: false
    })
    firstName: String

    @Column({
        type: "text",
        nullable: false
    })
    lastName: String

    @Column({
        type: "varchar",
        length: 2,
        nullable: false
    })
    gender: String


    @Column({ type: "date", nullable: true })
    dob: Date

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    telephone1: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    telephone2: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    email: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    city: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    province: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    district: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    commune: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    village: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    homeNo: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    streetNo: String

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @Column({ default: () => 1, nullable: true })
    isActive: number

}
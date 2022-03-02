import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from './group.permission';
import { Department } from './department';
import { Booking } from './booking.entity';
import { PreDefinedField } from './preDefinedField.entity';
import { Truck } from './truck.entity';
import { User } from './user';
import { MultipleDelivery } from './multipleDelivery.entity';

@Entity("tblContainer")
export class Container extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "text",
        nullable: true
    })
    containerNo: String

    @Column({
        type: "text",
        nullable: true
    })
    containerSize: String

    @Column({
        type: "double",
        nullable: true
    })
    quantity: number

    @Column({
        type: "int",
        nullable: true,
        default: () => 80
    })
    containerStatusID: number

    @Column({
        type: "text",
        nullable: true
    })
    customerToReceive: String

    @Column({
        type: "text",
        nullable: true
    })
    customerReceiveContact: String

    @Column({
        type: "text",
        nullable: true
    })
    destination: String

    @Column({
        type: "text",
        nullable: true
    })
    pickUpFrom: String

    @Column({
        type: 'datetime',
        nullable: true
    })
    pickUpDate

    @Column({
        type: 'bigint',
        nullable: true
    })
    driverID: Number

    @Column({
        type: 'bigint',
        nullable: true
    })
    bookingID: Number

    @Column({
        type: "bigint",
        nullable: true
    })
    truckID: number

    @Column({
        type: "text",
        nullable: true
    })
    extraDeliveryFee: String

    @Column({
        type: 'datetime',
        nullable: true
    })
    deliveryDate

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    dlv: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    emptyDepo: String

    @Column({
        type: 'datetime',
        nullable: true
    })
    emptyReturn: Date

    @Column({
        type: 'datetime',
        nullable: true
    })
    emptyNotifyAgent: Date

    @Column({
        type: 'datetime',
        nullable: true
    })
    agentPickUpEmpty: Date


    @Column({
        type: 'date',
        nullable: true
    })
    demDue: Date

    @Column({
        type: 'datetime',
        nullable: true
    })
    detDue: Date


    @Column({
        type: 'double',
        nullable: true
    })
    gw: Number

    @Column({
        type: 'bigint',
        nullable: true
    })
    gwUnitTypeID: Number

    @Column({
        type: 'double',
        nullable: true
    })
    cbm: Number

    @Column({
        type: 'bigint',
        nullable: true
    })
    cbmUnitTypeID: Number

    @Column({
        type: 'double',
        nullable: true
    })
    quantityUnitTypeID: Number

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "containerStatusID" })
    containerStatus: PreDefinedField

    @ManyToOne(type => Truck, { cascade: false })
    @JoinColumn({ name: "truckID" })
    truck: Truck

    @ManyToOne(type => User, { cascade: false })
    @JoinColumn({ name: "driverID" })
    driver: User

    @Column({ default: () => 1, nullable: true })
    isActive: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @ManyToOne(type => Booking, booking => booking.container)
    @JoinColumn({ name: "bookingID" })
    booking: Booking

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "cbmUnitTypeID" })
    cbmUnitType: PreDefinedField

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "gwUnitTypeID" })
    gwUnitType: PreDefinedField

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "quantityUnitTypeID" })
    quantityUnitType: PreDefinedField

    @OneToMany(type => MultipleDelivery, multiDelivery => multiDelivery.container)
    @JoinColumn()
    multiDelivery: MultipleDelivery[]

    @Column({
        type: 'int',
        nullable: true
    })
    modify_by: number

    @Column({
        type: 'text',
        nullable: true
    })
    modify_date: String


    @ManyToOne(type => User)
    @JoinColumn({ name: "modify_by" })
    modify_by_user: User


}
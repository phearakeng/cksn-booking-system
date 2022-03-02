import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from "./customer.entity";
import { BusinessPartner } from './businesspartner';
import { Carrier } from './carrier.entity';
import { PreDefinedField } from './preDefinedField.entity';
import { User } from './user';
import { Port } from './port.entity';
import { Container } from './container.entity';
import { Broker } from './broker.entity';

@Entity({ name: "tblBooking" })
export class Booking {
    @PrimaryGeneratedColumn()
    ID: number

    // require relationship with predata
    @Column({ type: 'int' })
    operationID: number // user

    @Column({ type: "nvarchar", length: 100, unique: true })
    CKSNFile: String

    @Column({ type: "bigint", nullable: true })
    fileTypeID: Number

    // require relationship with customer ID
    @Column({ type: "bigint" })
    customerID: number // customer

    @Column({ type: "bigint", nullable: true })
    shipperExporterSellerID: number

    @Column({ type: "bigint", nullable: true })
    consigneeID: number

    @Column({ type: "bigint", nullable: true })
    notifyPartyID: number

    // require relationship with predata
    // @Column({type:"int",default:()=>0,nullable:true})
    // statusCargo:number

    // @Column({type:"text",nullable:true})
    // BLNo:String

    @Column({ type: "text", nullable: true })
    mbl: String

    @Column({ type: "text", nullable: true })
    hbl: String

    @Column({ type: "text", nullable: true })
    dimension: String

    //looseContainerLoad
    // @Column({type:'text',nullable:true,default:()=>0})
    // lclID:number
    @Column({ nullable: true })
    lcl: boolean

    // @Column({type:"int",nullable:true})
    // quantity:number

    @Column({ type: "text", nullable: true })
    gw: String

    // cubic meter
    @Column({ type: "text", nullable: true })
    cbm: string

    @Column({ type: 'text', nullable: true })
    commodity: String


    @Column({ type: 'text', nullable: true })
    selling: String

    // require relationship with bussiness
    @Column({ type: 'int', nullable: true })
    agentID: number

    @Column({ type: 'int', nullable: true })
    borderID: number


    @Column({ type: 'int', nullable: true })
    portID: number

    // require relationship with broker
    @Column({ type: 'int', nullable: true })
    brokerID: number

    // require relationship with predata
    @Column({ type: 'int', nullable: true })
    modeID: number

    @Column({ type: 'text', nullable: true })
    docVN: String

    // require relationship with predata
    @Column({ type: 'int', nullable: true })
    carrierID: number




    // @Column({type:'text',nullable:true})
    // finalDistination:String

    @Column({ type: 'int', nullable: true })
    polID: number

    @Column({
        type: 'date',
        nullable: true
    })
    etdPOL: Date;

    @Column({ type: 'text', nullable: true })
    podID: number

    @Column({
        type: 'date',
        nullable: true
    })
    etaPOD: Date;


    // @Column({
    //     type: 'date',
    //     nullable:true
    //    })
    // ETAPort:Date;

    @Column({
        type: 'date',
        nullable: true
    })
    ETABorder: Date;

    // @Column({
    //     type: 'date',
    //     nullable:true
    //    })
    // ETAPNH:Date;

    // @Column({type:"int",nullable:true})
    // distinationID:number

    @Column({
        type: 'date',
        nullable: true
    })
    etaDestination: Date

    // @Column({type:'text',nullable:true})
    // vassel:String

    @Column({ type: 'text', nullable: true })
    finalDestination: String

    @Column({
        type: 'date',
        nullable: true
    })
    docSubmitDate: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    docRLSDate: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    docBrokerDate: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    clearance: Date;

    // @Column({
    //     type: 'date',
    //     nullable:true
    //    })
    // bookingTruck:Date

    // @Column({
    //     type: 'text',
    //     nullable:true
    //    })
    // CNEE:String

    @Column({
        type: 'text',
        nullable: true
    })
    deliveryContactName: String

    @Column({
        type: 'text',
        nullable: true
    })
    deliveryAddress: String

    @Column({
        type: 'text',
        nullable: true
    })
    deliveryContactPhone1: String

    @Column({
        type: 'text',
        nullable: true
    })
    deliveryContactPhone2: String

    @Column({
        type: 'date',
        nullable: true
    })
    deliveryTimeArrival: Date

    @Column({ type: "int", nullable: true })
    incotermID: number

    @Column({ type: "int", nullable: true })
    billTypeID: number

    @Column({
        type: 'text',
        nullable: true
    })
    contractNo: String

    // relationship with table card
    //    @Column({
    //     type: "int",
    //     nullable:true
    //    })
    //     truckID:number

    @Column({
        type: "double",
        nullable: true,
        default: () => 0
    })
    extraDeliveryFee: number

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    dlv: String

    @Column({
        type: 'date',
        nullable: true
    })
    MTBorder: Date

    @Column({
        type: 'date',
        nullable: true
    })
    MTNotifyAgent: Date

    @Column({
        type: 'date',
        nullable: true
    })
    agentPickUp: Date

    @Column({
        type: 'int',
        nullable: true
    })
    dem: number

    @Column({
        type: 'date',
        nullable: true
    })
    demDue: Date

    @Column()
    combileDetWithDem: boolean
    // tran
    @Column({
        type: 'int',
        nullable: true
    })
    det: number

    @Column({
        type: 'date',
        nullable: true
    })
    detDue: Date

    // @Column({
    //     type: 'int',
    //     nullable:true
    //    })
    // detFreeLeft:number

    @Column({
        type: 'text',
        nullable: true
    })
    billingInfo: String

    @Column({
        type: 'date',
        nullable: true
    })
    dateIssue: Date

    @Column({
        type: 'text',
        nullable: true
    })
    remarks: String

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createDate: String;

    // require relationship with predata
    @Column({ type: "int", nullable: true })
    bookingStatusID: number

    @Column({ type: "int", default: () => 1, nullable: true })
    isActive: number

    @ManyToOne(type => Customer)
    @JoinColumn({ name: "customerID" })
    customer: Customer

    @ManyToOne(type => Customer)
    @JoinColumn({ name: "shipperExporterSellerID" })
    shipperExporterSeller: Customer

    @ManyToOne(type => Customer)
    @JoinColumn({ name: "consigneeID" })
    consignee: Customer

    @ManyToOne(type => Customer)
    @JoinColumn({ name: "notifyPartyID" })
    notifyParty: Customer


    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "incotermID" })
    incoterm?: PreDefinedField

    // @ManyToOne(type=>PreDefinedField)
    // @JoinColumn({name:"distinationID"})
    // distination:PreDefinedField

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "billTypeID" })
    billType?: PreDefinedField


    @ManyToOne(type => BusinessPartner)
    @JoinColumn({ name: "agentID" })
    businessPartner: BusinessPartner

    @ManyToOne(type => Carrier)
    @JoinColumn({ name: "carrierID" })
    carrier: Carrier

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "borderID" })
    border: PreDefinedField

    //    @ManyToOne(type=>Broker)
    //    @JoinColumn({name:"brokerID"})
    //    broker:Broker

    @ManyToOne(type => BusinessPartner)
    @JoinColumn({ name: "brokerID" })
    broker: BusinessPartner


    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "modeID" })
    mode: PreDefinedField

    @ManyToOne(type => Port)
    @JoinColumn({ name: "polID" })
    // pol:PreDefinedField
    pol: Port

    @ManyToOne(type => Port)
    @JoinColumn({ name: "podID" })
    // pod:PreDefinedField
    pod: Port

    @ManyToOne(type => User)
    @JoinColumn({ name: "operationID" })
    operation: User

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "bookingStatusID" })
    bookingStatus: PreDefinedField

    //    @ManyToOne(type=>Port)
    //    @JoinColumn({name:"portID"})
    //    port:Port

    @OneToMany(type => Container, container => container.booking)
    @JoinColumn()
    container: Container[]

    @Column({
        type: 'int',
        nullable: true
    })
    modify_by: number

    @Column({
        type: 'text',
        nullable: true
    })
    modify_date: string


    @ManyToOne(type => User)
    @JoinColumn({ name: "modify_by" })
    modify_by_user: User

}
//import { validateOrReject } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { CustomerType } from './customer.type.entity';

@Entity({ name: "tblCustomer" })
export class Customer {

    @PrimaryGeneratedColumn()
    ID: number;

    @Column("text")
    name: String;

    @Column("text")
    nameKH: String;

    @Column()
    isCustomer: number

    @Column("text")
    contactName: String

    @Column({
        type: "nvarchar",
        length: 22,
        nullable: false
    })
    contactPhone: String

    @Column({
        type: "nvarchar",
        length: 45,
        nullable: true
    })
    VATNo: String

    @Column({
        type: "nvarchar",
        length: 22,
        nullable: false
    })
    telephone1: String;

    @Column({
        type: "nvarchar",
        length: 22,
        nullable: false
    })
    telephone2: String;

    @Column({
        type: "nvarchar",
        length: 45,
        nullable: true
    })
    email1: String

    @Column({
        type: "nvarchar",
        length: 45,
        nullable: true
    })
    email2: String


    @Column({
        type: "text",
        nullable: true
    })
    webSite: String;

    @Column({
        type: "nvarchar",
        length: 45,
        nullable: true
    })
    city: String;

    @Column({
        type: "nvarchar",
        length: 60,
        nullable: false
    })
    country: String;

    @Column({
        type: "nvarchar",
        length: 100,
        nullable: false
    })
    countryCode: String;

    @Column({
        type: "text",
        nullable: false
    })
    address1: String;

    @Column({
        type: "text",
        nullable: false
    })
    address2: String;

    //    @Column({
    //     type: "nvarchar",
    //     length:30,   
    //     nullable:true
    //    })
    //    streetNo:String;

    //    @Column({
    //     type: "nvarchar",
    //     length:30,   
    //     nullable:true
    //    })
    //    homeNo:String;

    @OneToMany(type => CustomerType, customerType => customerType.customer)
    customerType: CustomerType[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createDate: String;

    @Column({ type: "int", default: () => 1, nullable: true })
    isActive: number

    //    @BeforeInsert()
    //    @BeforeUpdate()
    //    async validate() {
    //      await validateOrReject(this);
    //    }


}
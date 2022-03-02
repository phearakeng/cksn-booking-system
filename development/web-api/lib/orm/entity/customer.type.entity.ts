import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PreDefinedField } from './preDefinedField.entity';
import { Customer } from './customer.entity';

@Entity({ name: "tblCustomerType" })
export class CustomerType {

   @PrimaryGeneratedColumn()
   ID: number;

   @Column("text")
   predataID: String;

   @ManyToOne(type => PreDefinedField)
   @JoinColumn({ name: "predataID" })
   predata: PreDefinedField

   @ManyToOne(type => Customer, customer => customer.customerType)
   customer: Customer

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createDate: String;

   @Column({ type: "int", default: () => 1, nullable: true })
   isActive: number

}
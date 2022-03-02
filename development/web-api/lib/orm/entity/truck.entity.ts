import { Entity, Column, OneToOne, JoinColumn, Unique } from "typeorm";
import { PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { BusinessPartner } from './businesspartner';



@Entity("tblTruck")
@Unique(["plateNo"])
export class Truck {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "nvarchar",
        length: 100,
        nullable: true
    })
    model: String


    @Column({
        type: "nvarchar",
        length: 100,
        nullable: true
    })
    weight: String

    @Column({
        type: "nvarchar",
        length: 20,
        nullable: true
    })
    plateNo: String


    @Column({
        type: "nvarchar",
        length: 20,
        nullable: true
    })
    assetOf: String

    @Column({ type: 'int', nullable: true, default: () => '0' })
    bizID: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @Column({ default: () => 1, nullable: true })
    status: number

    @ManyToOne(type => BusinessPartner)
    @JoinColumn({ name: "bizID" })
    bizPartner: BusinessPartner


}

// @Entity("tblTruck")
// export class Truck{
//     @PrimaryGeneratedColumn()
//     ID:number

//     @Column({type:"int",nullable:true})
//     userID:number

//     @Column({
//         type: "nvarchar",
//         length: 100,
//         nullable:true
//     })
//     model:String


//     @Column({
//         type: "nvarchar",
//         length: 100,
//         nullable:true
//     })
//     weight:String

//     @Column({
//         type: "nvarchar",
//         length: 20,
//         nullable:true
//     })
//     plateNo:String

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
//     created:Date

//     @Column({default:()=>1,nullable:true})
//     status:number

//     @ManyToOne(type=>User)
//     @JoinColumn({name:"userID"})
//     driver:User

// }
import { Entity, Column } from "typeorm";
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "tblBusinessPartner" })
export class BusinessPartner {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column({ type: "text", nullable: true })
    company: String;

    @Column("text")
    name: String;

    @Column("text")
    position: String;

    @Column({
        type: "text",
        nullable: false
    })
    email: String;

    @Column({
        type: "text",
        nullable: true
    })
    handPhone: String;

    @Column({
        type: "text",
        nullable: false
    })
    telephone: String;

    @Column({
        type: "text",
        nullable: false
    })
    fax: String;

    @Column({
        type: "text",
        nullable: true
    })
    address: String;

    @Column({
        type: "text",
        nullable: true
    })
    website: String;


    @Column({
        type: "text",
        nullable: true
    })
    description: String;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @Column({ default: () => 1, nullable: true })
    isActive: number

}
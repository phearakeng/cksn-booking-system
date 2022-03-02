import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity("tblCountry")
export class Country extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "nvarchar",
        length: 10,
        nullable: true
    })
    countryCode: String

    @Column({
        type: "nvarchar",
        length: 15,
        nullable: true
    })
    isoCode2

    @Column({
        type: "nvarchar",
        length: 15,
        nullable: true
    })
    isoCode3


    @Column({
        type: "text",
        nullable: true
    })
    description: String

    @Column({
        type: "text",
        nullable: true
    })
    capital: String



    @Column({ default: () => 1, nullable: true })
    isActive: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date
}
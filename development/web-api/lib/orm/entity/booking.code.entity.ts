import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: "tblBookingCode" })
export class BookingCode {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: 'text'
    })
    value: String

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createDate: String;

    // predata config
    @Column({
        type: 'bigint'
    })
    fileTypeID: Number

    @Column({ type: "int", default: () => 1, nullable: true })
    isActive: number
}
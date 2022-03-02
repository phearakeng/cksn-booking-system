import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("tblToken")
export class Token {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({ type: "text" })
    jti: String


    @Column({ type: "text" })
    token: String

    @Column({ type: "nvarchar", length: 50 })
    expirationDate: String

    @Column()
    userId: String

    @Column({ type: "int", default: 1, nullable: true })
    isActive: number


}
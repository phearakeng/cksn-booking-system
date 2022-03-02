import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "tblDocument", database: "CKSNDB_DOCUMENT" })
export class DocumentModel {
    @PrimaryGeneratedColumn()
    ID: Number

    @Column({
        type: "text",
        nullable: true
    })
    IDGenerate: String

    @Column({
        type: "text",
        nullable: true
    })
    fileName: String

    @Column({
        type: "bigint",
        nullable: true
    })
    bookingID: Number

    @Column({
        type: "text",
        nullable: true
    })
    ext: String

    @Column({
        type: "longtext",
        nullable: true
    })
    file: String

    @Column({
        type: "text",
        nullable: true
    })
    folder: String

    @Column({ default: () => 1, nullable: true })
    status: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date
}
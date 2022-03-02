import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from 'typeorm';

@Entity("tblPreDefinedField")
export class PreDefinedField extends BaseEntity {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({
        type: "varchar",
        length: 45,
        nullable: false
    })
    criterial: String

    @Column({
        type: "text",
        nullable: true
    })
    description: String

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    value: String

    @Column({ nullable: true })
    code: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date

    @Column({ default: () => 1, nullable: true })
    status: number

}
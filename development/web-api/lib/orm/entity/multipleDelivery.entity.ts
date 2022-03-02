import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Container } from './container.entity';
import { PreDefinedField } from './preDefinedField.entity';

@Entity("tblMultipleDelivery")
export class MultipleDelivery {
    @PrimaryGeneratedColumn()
    ID: Number

    @Column({
        type: "nvarchar",
        length: "100",
        nullable: true
    })
    contactName: String

    @Column({
        type: "nvarchar",
        length: "45",
        nullable: true
    })
    phoneContact: String

    @Column({
        type: "nvarchar",
        length: "300",
        nullable: true
    })
    address: String

    @Column({
        type: "bigint",
        nullable: true
    })
    containerID: Number

    @Column({
        type: "datetime",
        nullable: true
    })
    deliveryDate: Date

    @Column({
        type: "bigint",
        nullable: true
    })
    deliveryStatusID: Number

    @Column({ default: () => 1, nullable: true })
    isActive: Number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date

    @ManyToOne(type => Container, container => container.multiDelivery)
    @JoinColumn({ name: "containerID" })
    container: Container

    @ManyToOne(type => PreDefinedField)
    @JoinColumn({ name: "deliveryStatusID" })
    deliveryStatus: PreDefinedField

}
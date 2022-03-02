import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Customer } from "./customer.entity";
import { Truck } from "./truck.entity";
import { BusinessPartner } from './businesspartner';
import { Carrier } from './carrier.entity';
import { PreDefinedField } from './preDefinedField.entity';
import { User } from './user';

@Entity({ name: "tblPort" })
export class Port {
    @PrimaryGeneratedColumn()
    ID: number

    @Column({ type: 'text', nullable: true })
    country: String

    @Column({ type: 'text', nullable: true })
    port: String

    @Column({ type: 'text', nullable: true })
    code: String

    @Column({ type: 'text', nullable: true })
    latlong: String

    @Column({ type: 'text', nullable: true })
    telephone: String

    @Column({ type: 'text', nullable: true })
    web: String

    @Column({ type: 'int', default: () => 1, nullable: true })
    portType: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createDate: String;


    @Column({ type: "int", default: () => 1, nullable: true })
    isActive: number

}
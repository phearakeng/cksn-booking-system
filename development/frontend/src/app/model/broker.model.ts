
export class BrokerModel {
    ID: number;
    firstName: string;
    lastName: string;
    gender: string = "2"; // male else female
    dob: Date;
    telephone1: string;
    telephone2: string;
    city: string;
    province: string;
    district: string;
    commune: string;
    village: string;
    homeNo: string;
    streetNo: string;
    created: Date;
    isActive: number;
}
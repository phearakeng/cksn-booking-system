import { CustomerType } from './customer.type';
export class CustomerModel {
    ID: number
    name: String
    nameKH: String = ''
    contactName: String = ''
    contactPhone: String = ''
    isCustomer: boolean = true
    VATNo: String = ''
    telephone1: string = ''
    telephone2: string = ''
    email1: string = ''
    email2: string = ''
    city: String = ''
    countryCode: String = ''
    country: String = ''
    address1: String = ''
    address2: String = ''
    province: string = ''
    district: string = ''
    commune: string = ''
    village: string = ''
    streetNo: string = ''
    homeNo: string = ''
    createDate: string
    isActive: number
    customerType: CustomerType[] = []
}

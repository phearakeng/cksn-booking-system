import { PreData } from './pre.data';
import { CustomerModel } from './customer.model';

export class CustomerType {

   ID: number;
   predataID: number;
   predata: PreData
   customer: CustomerModel
   createDate: String;
   isActive: number

}
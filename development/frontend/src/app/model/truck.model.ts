import { UserModel } from './user.model';
import { BusinessPartnerModel } from './businesspartner.model';
export class TruckModel {
     ID: number
     plateNo: String
     model: String
     assetOf: any
     created: Date
     status: number
     bizID: number
     bizPartner: BusinessPartnerModel

}
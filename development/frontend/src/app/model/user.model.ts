import { CryptoHelper } from '../utilities/crypto.helper';
import { GroupModel } from './group.model';
import { PreData } from './pre.data';
export class UserModel {
    ID: number;
    userName: string;
    password: string;
    userImage: null;
    firstName: string;
    lastName: string = "";
    gender: string = ""; // male else female
    dob: Date;
    nationalIDCard: string = "";
    email: string = ""
    telephone1: string = "";
    telephone2: string = "";
    city: string = "";
    province: string = "";
    district: string = "";
    commune: string = "";
    village: string = "";
    homeNo: string = "";
    streetNo: string = "";
    lengthOfService: string;
    positionID: string;
    dateJoined: Date
    groupID: number;
    created: Date;
    isActive: number;
    group: GroupModel;
    position: PreData



}
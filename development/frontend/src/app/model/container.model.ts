import { PreData } from "./pre.data";
import { TruckModel } from './truck.model';
import { BookingModel } from './booking.model';
import { UserModel } from './user.model';
import { MultipleDelivery } from "./multipleDelivery.model";

export class ContainerModel {
    ID: number
    containerNo: String
    containerSize: String
    containerStatusID: number
    gw: number
    gwUnitTypeID: number
    cbm: number
    cbmUnitTypeID: number
    quantity: number
    quantityUnitTypeID: number
    quantityUnitTypeDescription: String
    bookingID: number
    customerToReceive: String
    customerReceiveContact: String
    destination: String
    deliveryDate: Date
    truckID: number

    driverID: number
    containerStatus: PreData
    extraDeliveryFee: number
    dlv: String
    pickUpDate: any
    pickUpFrom: String
    emptyReturn: Date
    emptyDepo: String
    emptyNotifyAgent: Date
    agentPickUpEmpty: Date
    isActive: number = 1
    // det:number
    demDue: Date
    detDue: Date
    detFreeLeft: number
    driver: UserModel
    truck: TruckModel
    // driver:UserModel
    active: number
    created: Date
    booking: BookingModel
    cbmUnitType: PreData
    gwUnitType: PreData
    quantityUnitType: PreData
    multiDelivery: MultipleDelivery[]
    key: string
    modify_by: any
    modify_date: any
    // filter purpose only
    bookingFile: any

    editing: boolean = false

}
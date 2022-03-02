import { ContainerModel } from '../container.model';

/**
 * use for upload record
 */

export class BookingModelRequest{
    ID:number
    operationID:number
    CKSNFile:String
    fileTypeID:Number
    customerID:number // customer
    shipperExporterSellerID:number
    consigneeID:number
    notifyPartyID:number
    // containerNo:String
    // containerSize:String // predata use value only
    statusCargo:number
    BLNo:String
    //lclID:number
    lcl:boolean
    mbl:String
    hbl:String
    quantity:number
    gw:String
    cbm:String
    dimension
    commodity:String
    incotermID:number
    selling:number
    agentID:number // businessPartner
    borderID:number // predata
    portID:number //port
    brokerID:number // broker
    modeID:number  // predata
  //  docVN:String
    carrierID:number // carrier
    polID:number   // predata
    podID:number  // predata

  /// distinationID:number
    etaDestination:Date
    
    etdPOL:Date
    etaPOD:Date
    ETABorder:Date
    ETAPNH:Date
    ETAPort:Date
    clearance:Date
    bookingTruck:Date
    dateIssue:Date
    dem:number
    demDue:Date
    demFreeLeft:number
    combileDetWithDem:boolean = false
    finalDestination:String
    
    //CNEE:String
    deliveryContactName:String
    deliveryAddress:String
    deliveryContactPhone1:String
    deliveryContactPhone2:String
    deliveryTimeArrival:Date

    billingInfo:String
    billTypeID:number
    contractNo:String
    remarks:String

    docSubmitDate:Date
    docRLSDate:Date
    docBrokerDate:Date

    truckID:number
    extraDeliveryFee:number
    dlv:String
    MTBorder:Date
    MTNotifyAgent:Date
    agentPickUp:Date
   
    det:number
    detDue:Date
    detFreeLeft:number
    
    createDate:String;
    bookingStatusID:number
    isActive:number
    modify_by:any
    modify_date:any
    container:ContainerModel[]
}
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { CustomerModel } from "./customer.model";
import { BusinessPartnerModel } from "./businesspartner.model";
import { TruckModel } from "./truck.model";
import { PreData } from './pre.data';
import { CarrierModel } from "./carrier.model";
import { UserModel } from './user.model';
import { PortModel } from "./port.model";
import { BrokerModel } from './broker.model';
import { ContainerModel } from './container.model';


export class BookingModel {
  ID: number
  operationID: number                 // =====|> OPERATION ID 
  CKSNFile: String                    // =====|> CKSN FILE
  clientName: String                  // =====|> CLIENT NAME
  fileTypeID: Number                  // =====|> FILE TYPE ID
  customerID: number                  // =====|> CUSTOMER ID
  shipperExporterSellerID: number     // =====|> SHIPPER / EXPORTER / SELLER | ID
  consigneeID: number                 // =====|> CONSIGNEE ID
  notifyPartyID: number               // =====|> NOTIFY PERTY ID
  containerNo: String                 // =====|> CONTAINER NO
  containerSize: String               // =====|> CONTAINER SIZE
  statusCargo: number                 // =====|> STATUS CARGO
  BLNo: String                        // =====|> BL NO
  lcl: boolean = false                // =====|> LCL
  mbl: String                         // =====|> MBL
  hbl: String                         // =====|> HBL
  quantity: number                    // =====|> QUANTITY
  gw: String                          // =====|> GW
  cbm: String                         // =====|> CBM
  dimension: String                   // =====|> DIMENSION
  commodity: String                   // =====|> COMMODITY
  selling: number                     // =====|> SELLING
  agentID: number                     // =====|> BUSINESS PSRTNER ID
  borderID: number                    // =====|> PREDATA ID
  portID: number                      // =====|> PORT MODEL ID
  brokerID: number                    // =====|> BROKER ID
  modeID: number                      // =====|> PREDATA
  incotermID: number                  // =====|> PREDATA
  carrierID: number                   // =====|> CARRIER ID
  polID: number                       // =====|> PREDATA
  etdPOL: Date                        // =====|> PREDATA
  podID: number                       // =====|> PREDATA
  etaPOD: Date                        // =====|> ETA POD
  vassel: String                      // =====|> VASSEL 
  etaDestination: Date                // =====|> ETA DESTINATION
  ETABorder: Date                     // =====|> ETA BORDER 
  ETAPNH: Date                        // =====|> ETA PNH
  ETAPort: Date                       // =====|> ETA PORT
  docRLS: Date                        // =====|> DOC RLS
  docBroker: Date                     // =====|> DOC BROKER
  clearance: Date                     // =====|> CLEARANCE
  bookingTruck: Date                  // =====|> BOOKING TRUCK
  dateIssue: Date                     // =====|> DATE ISSUE 
  dem: number                         // =====|> DEM
  demDue: Date                        // =====|> DEM DUE
  demFreeLeft: number                 // =====|> DEM FREE LEFT
  combileDetWithDem: boolean = false  // =====|> COMBILE DET WITH DEM
  finalDestination: String
  deliveryContactName: String
  deliveryAddress: String
  deliveryContactPhone1: String
  deliveryContactPhone2: String
  deliveryTimeArrival: Date
  billingInfo: String
  billTypeID: number
  contractNo: String
  remarks: String
  docSubmitDate: Date
  docRLSDate: Date
  docBrokerDate: Date
  truckID: number
  extraDeliveryFee: number
  dlv: String
  MTBorder: Date
  MTNotifyAgent: Date
  agentPickUp: Date
  det: number
  detDue: Date = null
  detFreeLeft: number
  createDate: String;
  bookingStatusID: number
  isActive: number
  shipperExporterSeller?: CustomerModel
  customer?: CustomerModel
  consignee?: CustomerModel
  notifyParty?: CustomerModel
  truck?: TruckModel
  businessPartner?: BusinessPartnerModel
  carrier?: CarrierModel
  port?: PortModel
  border?: PreData
  broker?: BusinessPartnerModel
  mode?: PreData
  pol?: PortModel
  pod?: PortModel
  incoterm?: PreData
  billType?: PreData
  operation?: UserModel
  container?: ContainerModel[] = []
  modify_by: any
  modify_date: any
}
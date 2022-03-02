import { Component, OnInit, ViewChild, NgZone, Optional, ElementRef, Input } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, startWith, map, filter } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingModel } from '../../../model/booking.model';
import { CustomerModel } from '../../../model/customer.model';
import { PreData } from '../../../model/pre.data';
import { BusinessPartnerModel } from '../../../model/businesspartner.model';
import { CarrierModel } from '../../../model/carrier.model';
import { UserModel } from '../../../model/user.model';
import { PortModel } from '../../../model/port.model';
import { CustomerService } from '../../../services/customer/customer.service';
import { BusinessPartnerService } from '../../../services/business/business-partner.service';
import { CarrierService } from '../../../services/carrier/carrier.service';
import { PredataService } from '../../../services/predata/predata.service';
import { TruckService } from '../../../services/truck/truck.service';
import { PortService } from '../../../services/port/port.service';
import { BookingService } from '../../../services/booking/booking.service';
import { DateFormatPipe } from '../../../utilities/DateFormatPipe';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusCode } from '../../../utilities/StatusCode';
import { BookingModelRequest } from '../../../model/request/booking.request';
import { Criterial } from '../../../services/predata/criterial';
import { ContainerModel } from '../../../model/container.model';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxPicaService, NgxPicaErrorInterface } from 'ngx-pica';
import { DocumentModel } from '../../../model/document.model';
import { DocumentService } from '../../../services/document/documen.service';
import { BaseComponent } from '../../baseComponent';
import { Api } from '../../../utilities/api';
import { TruckModel } from '../../../model/truck.model';
import { MultipleDelivery } from '../../../model/multipleDelivery.model';
import { ContainerService } from '../../../services/container/container.service';
import { NgEventBus } from 'ng-event-bus';
import { CustomerComponent } from '../../customer/customer-component/customer.tag';

declare const $: any;

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent extends BaseComponent implements OnInit {


  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  @ViewChild('viewCust', { static: false }) viewCust: CustomerComponent
  @ViewChild('viewExpShSel', { static: false }) viewExpShSel: CustomerComponent
  @ViewChild('viewNotifyParty', { static: false }) viewNotifyParty: CustomerComponent
  @ViewChild('viewConsignee', { static: false }) viewConsignee: CustomerComponent

  booking: BookingModel
  cksnFileFormat: any
  bookingDetailForm: FormGroup
  businessPartnerList: BusinessPartnerModel[]
  filteredbusinessPartner: Observable<BusinessPartnerModel[]>
  carrierList: CarrierModel[]
  filteredCarrier: Observable<CarrierModel[]>
  brokerList: BusinessPartnerModel[]
  filteredBroker: Observable<BusinessPartnerModel[]>
  operationList: UserModel[]
  truckList: TruckModel[]
  filteredTruck: Observable<TruckModel[]>
  filteredPOL: Observable<PortModel[]>
  POLList: PortModel[]
  filteredPOD: Observable<PortModel[]>
  PODList: PortModel[]
  distinationList: PreData[]
  borderList: PreData[]
  modeList: PreData[]
  incotermList: PreData[]
  bookingStatusList: PreData[]
  cksnFileExtFormatList: PreData[]
  billTypeList: PreData[]
  truck: TruckModel
  businessPartner: BusinessPartnerModel
  quantityUnitTypeID: any
  quantityUnitTypeList: PreData[]
  containerSizeList: PreData[]
  gwUnitTypeList: PreData[]
  gwUnitTypeID: number
  gw: number
  cbmUnitTypeList: PreData[]
  cbmUnitTypeID: number
  cbm: any
  pickupDate: any
  conDeliveryDate: any
  containerNo: String
  containerSize: String
  quantity: number
  dem_due_warning_day: number
  det_due_warning_day: number
  limit_file_upload: Number = 0

  CKSNFile: any
  isEdit = "0";
  invisbleLoading = true;
  isSaving = false;

  @ViewChild('fileUpload', { static: false })
  fileUpload: ElementRef

  documents: DocumentModel[] = []
  invisbleImageLoading = true;

  @Input()
  multiple

  editCache = {};
  editCacheMultiDelivery: any = {};
  isEditingStatus = false;

  /**
   * @block
   * Multi Drop
   */
  contactName: any = 'N/A'
  phoneContact: any = '0'
  deliveryAddress: any = 'Add'
  multipleDeliverDate: any
  emptyDepo: any
  groupContainerControl: FormGroup;

  constructor(private _ngZone: NgZone,
    private customerService: CustomerService,
    private buesinessPartnerService: BusinessPartnerService,
    private carrierService: CarrierService,
    private predataService: PredataService,
    private bookingService: BookingService,
    private portService: PortService,
    private _dateFormatPipe: DateFormatPipe,
    private activateRoute: ActivatedRoute,
    public router: Router,
    private matSnackbar: MatSnackBar,
    private _ngxPicaService: NgxPicaService,
    private documentService: DocumentService,
    private containerService: ContainerService
  ) {
    super(router)
  }
  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.bookingFormPageID)[0]
    this.checkModifyPermission();
    this.initModel();
    this.initForm();
    if (this.permission && this.permission.isView == true) {
      let userID = this.session.getUID()
      this.loadBusinessPartners();
      this.loadCarrier();
      this.loadPort()
      this.onLoadData();
      this.booking.operationID = parseInt(userID)
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }
  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  initModel() {
    this.booking = new BookingModel()
    let port = new PortModel()
    this.booking.port = port
    this.businessPartner = new BusinessPartnerModel()

  }
  onLoadData() {
    this.invisbleLoading = false;
    this.activateRoute.queryParams.subscribe(param => {
      if (param["element"]) {
        let element = JSON.parse(param["element"])
        if (element && element.isEdit == "1") {
          this.isEdit = "1"
          if (this.permission.isUpdate == false) this.isModify = false;

          this.bookingService.getBookingByID(element.ID)
            .subscribe(res => {
              if (res.status == StatusCode.success && res.body.length > 0) {
                this.booking = res.body[0] as BookingModel
                this.CKSNFile = this.booking.CKSNFile
                this.cksnFileFormat = this.booking.fileTypeID
                this.bookingDetailForm.get("cksnFileType").setValue(this.cksnFileExtFormatList.filter(f => f.ID == this.cksnFileFormat)[0].ID)
                this.setCustomerView()
                this.bookingDetailForm.get("customer").setValue(this.booking.customer)
                this.bookingDetailForm.get("shipperExporterSeller").setValue(this.booking.shipperExporterSeller)
                this.bookingDetailForm.get("pod").setValue(this.booking.pod)
                this.bookingDetailForm.get("carrier").setValue(this.booking.carrier)
                this.bookingDetailForm.get("broker").setValue(this.booking.broker)
                this.bookingDetailForm.get("consignee").setValue(this.booking.businessPartner)
                this.bookingDetailForm.get("agent").setValue(this.booking.operation)
                this.bookingDetailForm.get("pol").setValue(this.booking.pol)
                this.booking.container = this.booking.container.filter(res => res.isActive == 1)
                this.booking.container.forEach(ele => {
                  ele.key = ComponentUtilities.UUID()
                })
                this.invisbleLoading = true;
                this.setLCLChange();
                this.setDemurrageInfo();
                this.onEditableDetention(this.booking.combileDetWithDem)
                this.onLoadDocument(this.booking.ID)

              }
              this.invisbleLoading = true
            })
          this.bookingDetailForm.get("cksnFileType").disable()
        }
        else {
          this.bookingDetailForm.get("cksnFileType").enable()
          this.getGenerateCKSNCode(this.cksnFileFormat);
          this.invisbleLoading = true;
        }
      }
      else {
        this.getGenerateCKSNCode(this.cksnFileFormat);
        this.invisbleLoading = true;
      }

    })
  }
  setCustomerView() {
    setTimeout(() => {
      try {
        this.viewCust.custCtrl.setValue(this.booking.customer)
        this.viewCust.customer = this.booking.customer
      }
      catch (e) { }

      try {
        this.viewExpShSel.custCtrl.setValue(this.booking.shipperExporterSeller)
        this.viewExpShSel.customer = this.booking.shipperExporterSeller
      }
      catch (e) { }

      try {
        this.viewNotifyParty.custCtrl.setValue(this.booking.notifyParty)
        this.viewNotifyParty.customer = this.booking.notifyParty
      }
      catch (e) { }

      try {
        this.viewConsignee.custCtrl.setValue(this.booking.consignee)
        this.viewConsignee.customer = this.booking.consignee
      }
      catch (e) { }

    }, 1000);
  }

  // *******************|~ON CLICK SEAVE~|******************* //
  onClick_save() {
    this.isSaving = true;
    this.booking.border = this.borderList.filter(filter => filter.ID == this.booking.borderID)[0]
    let postBooking = new BookingModelRequest()
    postBooking.ID = this.booking.ID
    postBooking.fileTypeID = this.booking.fileTypeID
    postBooking.customerID = this.booking.customerID
    postBooking.CKSNFile = this.booking.CKSNFile
    postBooking.shipperExporterSellerID = this.booking.shipperExporterSellerID
    postBooking.notifyPartyID = this.booking.notifyPartyID
    postBooking.consigneeID = this.booking.consigneeID
    postBooking.mbl = this.booking.mbl
    postBooking.hbl = this.booking.hbl
    postBooking.carrierID = this.booking.carrierID
    postBooking.agentID = this.booking.agentID
    postBooking.container = this.booking.container
    postBooking.gw = this.booking.gw
    postBooking.dimension = this.booking.dimension
    postBooking.cbm = this.booking.cbm
    postBooking.modeID = this.booking.modeID
    postBooking.incotermID = this.booking.incotermID
    postBooking.commodity = this.booking.commodity
    postBooking.brokerID = this.booking.brokerID
    postBooking.selling = this.booking.selling
    postBooking.polID = this.booking.polID
    postBooking.podID = this.booking.podID
    postBooking.borderID = this.booking.borderID
    postBooking.combileDetWithDem = this.booking.combileDetWithDem
    postBooking.etdPOL = this._dateFormatPipe.transform(this.booking.etdPOL)
    postBooking.etaPOD = this._dateFormatPipe.transform(this.booking.etaPOD)
    postBooking.ETABorder = this._dateFormatPipe.transform(this.booking.ETABorder)
    postBooking.clearance = this._dateFormatPipe.transform(this.booking.clearance)
    postBooking.deliveryTimeArrival = this._dateFormatPipe.transform(this.booking.deliveryTimeArrival)
    postBooking.dateIssue = this._dateFormatPipe.transform(this.booking.dateIssue)
    postBooking.dem = this.booking.dem
    postBooking.det = this.booking.det
    postBooking.demDue = this._dateFormatPipe.transform(this.booking.demDue)
    postBooking.detDue = this._dateFormatPipe.transform(this.booking.detDue)
    postBooking.docSubmitDate = this._dateFormatPipe.transform(this.booking.docSubmitDate)
    postBooking.docRLSDate = this._dateFormatPipe.transform(this.booking.docRLSDate)
    postBooking.docBrokerDate = this._dateFormatPipe.transform(this.booking.docBrokerDate)
    postBooking.etaDestination = this._dateFormatPipe.transform(this.booking.etaDestination)
    postBooking.deliveryContactName = this.booking.deliveryContactName
    postBooking.deliveryAddress = this.booking.deliveryAddress
    postBooking.deliveryTimeArrival = this._dateFormatPipe.transform(this.booking.deliveryTimeArrival)
    postBooking.deliveryContactPhone1 = this.booking.deliveryContactPhone1
    postBooking.billTypeID = this.booking.billTypeID
    postBooking.remarks = this.booking.remarks
    postBooking.contractNo = this.booking.contractNo
    postBooking.operationID = this.booking.operationID
    postBooking.bookingStatusID = this.booking.bookingStatusID
    postBooking.finalDestination = this.booking.finalDestination
    postBooking.modify_by = this.session.getUID();
    postBooking.modify_date = this._dateFormatPipe.formatdate(new Date(), "dd/MM/yyyy hh:mm");
    let status = this.validateBookingData(postBooking);
    if (status == true) {

      this.bookingService.saveBooking(postBooking).subscribe(res => {
        this.isSaving = false;

        if (res.status == StatusCode.success) {
          this.matSnackbar.open(res.status, res.status, {
            duration: 5000,
          });

          try {
            if (Number(res.body[0]) != NaN) {
              this.documents = this.documents.filter(res => res.ID == null || res.ID == undefined)
              this.documents.forEach(doc => {
                doc.bookingID = res.body[0]
                let listDocs = []
                listDocs.push(doc)
                this.documentService.addDocuments(listDocs).subscribe(res => {
                  if (res.status == StatusCode.success) {
                    ComponentUtilities.showNotification("File : " + doc.fileName + " uploaded", Criterial.warningNotify)
                    this.onLoadData()
                  }
                  else {
                    ComponentUtilities.showNotification("File : " + doc.fileName + " uploade failed", Criterial.warningNotify)
                  }
                })
              })
            }
          } catch (error) {
            this.matSnackbar.open("Invalid doucment to upload", res.status, {
              duration: 2000,
            });
          }

          this.router.navigate(["/bookings"])
        }
        else {
          this.matSnackbar.open(res.body[0].toString(), res.status, {
            duration: 2000,
          });
        }

      })
    }
  }

  validateBookingData(b: BookingModelRequest) {
    var status = true;
    console.log("object")
    if (b.etaPOD != null && b.etdPOL != null) {
      if (b.etaPOD < b.etdPOL) {
        status = false;
        ComponentUtilities.showNotification("ETA POD date must greater than or equal ETD POL", Criterial.warningNotify);
      }
    }

    if (b.ETABorder != null && b.etaPOD != null) {
      if (b.ETABorder < b.etaPOD) {
        status = false;
        ComponentUtilities.showNotification("ETA Border date must greater than or equal ETA POD", Criterial.warningNotify)
      }
    }

    if (b.etaDestination != null && b.ETABorder != null) {
      if (b.etaDestination < b.ETABorder) {
        status = false;
        ComponentUtilities.showNotification("ETA Destination date must greater than or equal ETA Border", Criterial.warningNotify)
      }
    }

    if (b.clearance != null && b.ETABorder != null) {
      if (b.clearance < b.ETABorder) {
        status = false;
        ComponentUtilities.showNotification("Clearance date must greater than or equal ETA Border", Criterial.warningNotify)
      }
    }

    if (b.demDue != null && b.etaPOD != null) {
      if (b.demDue < b.etaPOD) {
        status = false;
        ComponentUtilities.showNotification("Demurage Due date must greater than or equal ETA POD", Criterial.warningNotify)
      }
    }

    if (b.detDue != null && b.etaPOD != null) {
      if (b.detDue < b.etaPOD) {
        status = false;
        ComponentUtilities.showNotification("Detention Due date  must  greater than or equal ETA POD", Criterial.warningNotify)
      }
    }
    if (b.docSubmitDate != null && b.etdPOL != null) {
      if (b.docSubmitDate < b.etdPOL) {
        status = false;
        ComponentUtilities.showNotification("Document Submit date  must  greater than or equal ETD POL", Criterial.warningNotify)
      }
    }

    if (b.docSubmitDate != null && b.docRLSDate != null) {
      if (b.docRLSDate < b.docSubmitDate) {
        status = false;
        ComponentUtilities.showNotification("Document Release date  must  greater than or equal Document Submit date", Criterial.warningNotify)
      }
    }

    if (b.docBrokerDate != null && b.docRLSDate != null) {
      if (b.docBrokerDate < b.docRLSDate) {
        status = false;
        ComponentUtilities.showNotification("Document To Broker date must greater than or equal Document Release date", Criterial.warningNotify)
      }
    }

    return status;
  }

  onCKSNFileType_Change(ext: any) {

    this.getGenerateCKSNCode(ext)
  }

  getGenerateCKSNCode(ID) {
    try {
      let ext = this.cksnFileExtFormatList.filter(res => res.ID == ID)[0]
      this.booking.fileTypeID = ext.ID
      this.CKSNFile = ext.value.substring(ext.value.indexOf("(") + 1, ext.value.indexOf("#"));
      this.booking.CKSNFile = this.CKSNFile
    }
    catch (err) {
      console.log("cksn file code")
    }
  }

  onCustValueChange(cust, customerType) {
    if (customerType == Criterial.type_of_customer) {
      this.booking.customerID = cust.ID
    }
    else if (customerType == Criterial.type_of_shipper_exporter_seller) {
      this.booking.shipperExporterSellerID = cust.ID
    }
    else if (customerType == Criterial.type_of_consignee) {
      this.booking.consigneeID = cust.ID
    }
    else if (customerType == Criterial.type_of_notify_party) {
      this.booking.notifyPartyID = cust.ID
    }
  }

  loadBusinessPartners() {
    this.buesinessPartnerService.getAllBusinessPartners().subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.businessPartnerList = res.body
        this.filteredbusinessPartner = this.bookingDetailForm.get("agent").valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ''),
          map(name => name ? this.onfilteredBusinessPartner(name) : this.businessPartnerList.slice())
        )

        // broker
        this.brokerList = res.body
        this.filteredBroker = this.bookingDetailForm.get("broker").valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ""),
          map(name => name ? this.onfilteredBroker(name) : this.brokerList.slice())
        )


      }
    })
  }

  onfilteredBusinessPartner(val: string): BusinessPartnerModel[] {
    return this.businessPartnerList.filter(biz => biz.name.toLowerCase().includes(val.toLowerCase()))
  }

  displayFnAgent(business: BusinessPartnerModel) { return business ? business.name + ' - Company ' + business.company : undefined; }
  onSelectionAgentChanged(event) {
    if (event.option.value) {
      this.booking.businessPartner = event.option.value
      this.booking.agentID = this.booking.businessPartner.ID
    }
  }

  /**
   * @Load Carrier
   */
  loadCarrier() {
    this.carrierService.getAllCarriers().subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.carrierList = res.body
        this.filteredCarrier = this.bookingDetailForm.get("carrier").valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ''),
          map(name => name ? this.onfilteredCarrier(name) : this.carrierList.slice())
        )
      }
    })
  }

  onfilteredCarrier(val: string): CarrierModel[] { return this.carrierList.filter(car => car.name.toLowerCase().includes(val.toLowerCase())) }

  displayFnCarrier(carrier: CarrierModel) { return carrier ? carrier.name + ' - Company ' + carrier.company : undefined; }

  onSelectionCarrierChanged(event) {
    if (event.option.value) {
      this.booking.carrier = event.option.value
      this.booking.carrierID = this.booking.carrier.ID
    }
  }

  loadPort() {
    this.portService.getPortList(Criterial.seaPortType).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.POLList = res.body
        this.PODList = res.body
        this.filteredPOL = this.bookingDetailForm.get("pol").valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ""),
          map(name => name != undefined ? this.onfilteredPOL(name) : this.POLList.slice())
        )
        this.filteredPOD = this.bookingDetailForm.get("pod").valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ""),
          map(name => name != undefined ? this.onfilteredPOD(name) : this.PODList.slice())
        )
      }
    })
  }

  onfilteredPOL(val: string): PortModel[] {

    return this.POLList.filter(p => (p.country + "" + p.port + "" + p.code).toLowerCase().includes(val.toLowerCase()))

  }

  displayFnPOL(port: PortModel) { return port ? port.port + '(' + port.code + ')' : undefined; }

  onSelectionPOLChanged(event) {
    if (event.option.value) {
      this.booking.pol = event.option.value
      this.booking.polID = this.booking.pol.ID
    }
  }

  onfilteredPOD(val: string): PortModel[] { return this.PODList.filter(port => (port.country + "" + port.port + "" + port.code).toLowerCase().includes(val.toLowerCase())) }

  displayFnPOD(port: PortModel) { return port ? port.port + '(' + port.code + ')' : undefined; }

  onSelectionPODChanged(event) {
    if (event.option.value) {
      this.booking.pod = event.option.value
      this.booking.podID = this.booking.pod.ID
    }
  }

  onfilteredBroker(val: string): BusinessPartnerModel[] { return this.brokerList.filter(us => (us.name).toLowerCase().includes(val.toLowerCase())) }

  displayFnBroker(broker: BusinessPartnerModel) { return broker ? broker.name : undefined; }

  onSelectionBrokerChanged(event) {
    if (event.option.value) {
      this.booking.broker = event.option.value
      this.booking.brokerID = this.booking.broker.ID
    }
  }

  onClick_AddContainer() {
    let con = new ContainerModel();
    if (this.quantity == undefined || this.quantity <= 0) {
      this.matSnackbar.open("Quantity can't be zero", "Invalid", {
        duration: 4000,
      });
      return;
    }

    if (this.gw == undefined || this.gw <= 0) {
      this.matSnackbar.open("GW weight can't be zero", "Invalid", {
        duration: 4000,
      });
      return;
    }

    if (this.cbm == undefined || this.cbm <= 0) {
      this.matSnackbar.open("CBM can't be zero", "Invalid", {
        duration: 4000,
      });
      return;
    }

    if (this.containerNo &&
      this.containerSize &&
      this.quantityUnitTypeID &&
      this.gwUnitTypeID &&
      this.cbmUnitTypeID

    ) {
      con.containerNo = this.containerNo
      con.containerSize = this.containerSize
      con.quantity = this.quantity != undefined ? this.quantity : 0
      con.key = ComponentUtilities.UUID()
      con.containerStatusID = 80
      con.quantityUnitTypeID = this.quantityUnitTypeID
      con.pickUpDate = this.pickupDate //!=undefined?this.pickupDate:new Date()
      con.emptyDepo = this.emptyDepo
      con.quantityUnitType = this.quantityUnitTypeList.filter(rs => rs.ID == this.quantityUnitTypeID)[0]

      con.gwUnitTypeID = this.gwUnitTypeID
      con.gwUnitType = this.gwUnitTypeList.filter(rs => rs.ID == this.gwUnitTypeID)[0]
      con.gw = this.gw != undefined ? this.gw : 0;

      con.cbmUnitTypeID = this.cbmUnitTypeID
      con.cbmUnitType = this.cbmUnitTypeList.filter(res => res.ID == this.cbmUnitTypeID)[0]
      con.cbm = this.cbm != undefined ? this.cbm : 0
      con.deliveryDate = this.conDeliveryDate //!=null?this.conDeliveryDate:new Date()

      let isExistingData = this.booking.container.filter(fd => fd.containerNo == this.containerNo)
      if (isExistingData.length == 0) {
        this.booking.container.unshift(con)
        try {
          this.booking.container.forEach(ele => {
            if (this.booking.ID != null) {
              ele.bookingID = this.booking.ID
            }
          })
        }
        catch (ex) {
          console.log(ex)
          this.matSnackbar.open("Something wrong when add container", "Invalid", {
            duration: 2000,
          });
        }
      }
      this.containerNo = ''
      this.quantity = 0
    }
    else {
      this.matSnackbar.open("Something wrong when add container", "Invalid", {
        duration: 4000,
      });
    }
  }

  onClick_deleteContainer(element: ContainerModel) {
    let indexArray = this.booking.container.indexOf(element)

    if (this.booking.container[indexArray].ID == undefined) {
      this.booking.container.splice(indexArray, 1)
    }
    else {
      this.booking.container[indexArray].isActive = 0
      this.booking.container = this.booking.container.filter(res => res.isActive == 1)
    }

  }


  loadPredata() {
    this.predataService.getPreDefinedsByCriterial(Criterial.CKSNFILE).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.cksnFileExtFormatList = res.body
        this.cksnFileFormat = this.cksnFileExtFormatList[0].ID
        this.getGenerateCKSNCode(this.cksnFileFormat)
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.pod).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.distinationList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.container_size).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.containerSizeList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.quantity_unit_type).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.quantityUnitTypeList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.gw_unit_type).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.gwUnitTypeList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.cbm_unit_type).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.cbmUnitTypeList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.border).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.borderList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.booking_mode).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.modeList = res.body
      }
    })


    this.predataService.getPreDefinedsByCriterial(Criterial.booking_status).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.bookingStatusList = res.body
        if (!this.booking.bookingStatusID) {
          this.booking.bookingStatusID = Criterial.booking_status_new
        }
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.dem_due_warning).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.dem_due_warning_day = parseInt(res.body[0].value)
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.det_due_warning).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.det_due_warning_day = parseInt(res.body[0].value)
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.incoterm).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.incotermList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.billType).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.billTypeList = res.body
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.limit_file_upload).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.limit_file_upload = Number(res.body[0].value)
      }
    })


  }


  //#region  initFormControl and load Existing data 
  initForm() {
    this.groupContainerControl = new FormGroup({})

    this.bookingDetailForm = new FormGroup(
      {
        cksnFileType: new FormControl(),
        customer: new FormControl(),
        custTelephone1: new FormControl(),
        custTelephone2: new FormControl(),
        custEmail1: new FormControl(),
        custEmail2: new FormControl(),
        custVAT: new FormControl(),
        custAddress: new FormControl(),
        consignee: new FormControl(),
        consigneeVATNo: new FormControl(),
        consigneeTelephone1: new FormControl(),
        consigneeEmail1: new FormControl(),
        consigneeAddress: new FormControl(),
        notifyParty: new FormControl(),
        notifyPartyVATNo: new FormControl(),
        notifyPartyTelephone1: new FormControl(),
        notifyPartyEmail1: new FormControl(),
        notifyPartyAddress: new FormControl(),
        shipperExporterSeller: new FormControl(),
        shExpSelVatNo: new FormControl(),
        shExpSelTelephone1: new FormControl(),
        shExpSelEmail: new FormControl(),
        shExpSelAddress: new FormControl(),
        CKSNFile: new FormControl(),
        operation: new FormControl(),
        BLNo: new FormControl(),
        HBLNo: new FormControl(),
        groupContainer: this.groupContainerControl,
        lcl: new FormControl(),
        // quantity :   this. quantityFrmControl,
        gwTotal: new FormControl(),
        cbmTotal: new FormControl(),
        dimension: new FormControl(),
        commodity: new FormControl(),
        selling: new FormControl(),
        agent: new FormControl(),
        border: new FormControl(),
        port: new FormControl(),
        broker: new FormControl(),
        mode: new FormControl(),
        incoterm: new FormControl(),
        carrier: new FormControl(),
        pol: new FormControl(),
        pod: new FormControl(),
        distination: new FormControl(),
        etaPOD: new FormControl(),
        etdPOL: new FormControl(),
        etaPNH: new FormControl(),
        etd: new FormControl(),
        etaPort: new FormControl(),
        etaBorder: new FormControl(),
        clearance: new FormControl(),
        // bookingTruckDate : this.bookingTruckDateFrmControl,
        cnee: new FormControl(),
        deliveryContactName: new FormControl(),
        deliveryAddress: new FormControl(),
        deliveryContactPhone1: new FormControl(),
        deliveryTimeArrival: new FormControl(),
        etaDestination: new FormControl(),

        dem: new FormControl(),
        demDue: new FormControl(),
        demFreeLeft: new FormControl(),
        combileDetWithDem: new FormControl(),
        dateIssue: new FormControl(),
        remark: new FormControl(),
        bookingStatus: new FormControl(),

        docSubmitDate: new FormControl(),
        docRLSDate: new FormControl(),
        docBrokerDate: new FormControl(),
        billType: new FormControl(),
        contractNo: new FormControl(),

        driverName: new FormControl(),
        driverPhone1: new FormControl(),
        truckPlateNo: new FormControl(),
        extraFeeCharge: new FormControl(),
        dlv: new FormControl(),
        mtBorder: new FormControl(),
        mtNotifyAgent: new FormControl(),
        agentPickedContainer: new FormControl(),
        det: new FormControl(),
        dateDetDue: new FormControl(),
        detFreeLeft: new FormControl(),
        totalQuantity: new FormControl(),

        containerNo: new FormControl(),
        containerSize: new FormControl(),
        btnAddContainer: new FormControl(),
        quantity: new FormControl(),
        gw: new FormControl(),
        gwUnitType: new FormControl(),
        cbm: new FormControl(),
        cbmUnitType: new FormControl(),
        quantityUnitType: new FormControl(),
        conDeliveryDate: new FormControl(new Date()),
        pickupDateFrmControl: new FormControl(),
        emptyDepoFrmCtrl: new FormControl()
      }
    )
    this.loadPredata()
    // this.booking.eta = new Date();
    // this.booking.dem = 1;
  }
  //#endregion initFormControl

  //#region demurrage

  onDateEtaPODChange() {
    this.setDemurrageInfo()
  }

  onDateDemDueChange() {
    if (this.booking.combileDetWithDem == true) {
      this.booking.det = this.booking.dem
      this.booking.detDue = this.booking.demDue
      console.log("onDateDemDueChange " + this.booking.detDue)
    }
  }

  onDemurrageChange(val) {
    this.setDemurrageInfo();
    if (this.booking.combileDetWithDem == true) {
      this.booking.det = this.booking.dem
      this.booking.detDue = this.booking.demDue
      console.log("onDemurrageChange " + this.booking.detDue)
    }
  }
  setDemurrageInfo() {
    this.booking.demDue = this.booking.etaPOD
    // input dem must greater day warning day
    if (this.booking.dem > 0 && this.booking.etaPOD != null) {
      this.booking.demDue = this._dateFormatPipe.addDays(new Date(this.booking.etaPOD), this.booking.dem - 1)
    }
  }


  onCheckCombileChange(event) {
    this.onEditableDetention(event.checked)
  }

  onEditableDetention(checked: boolean) {
    if (checked == true) {
      this.bookingDetailForm.get("det").disable()
      this.bookingDetailForm.get("dateDetDue").disable()
      this.booking.det = this.booking.dem
      this.booking.detDue = this.booking.demDue
    }
    else {
      // this.booking.detDue = this.booking.ETABorder
      //  if (this.booking.det > 0) {
      if (this.booking.ETABorder != undefined) {
        console.log(this.booking.ETABorder)
        this.booking.detDue = this._dateFormatPipe.addDays(new Date(this.booking.ETABorder), this.booking.det - 1)
      }

      //}
      this.bookingDetailForm.get("det").enable()
      this.bookingDetailForm.get("dateDetDue").enable()
    }
  }

  onDetentionChange(val) {
    if (this.booking.ETABorder != null) {
      this.booking.detDue = this._dateFormatPipe.addDays(new Date(this.booking.ETABorder), this.booking.det - 1)
    }

    //  console.log("onDetentionChange "+this.booking.detDue)
  }

  // event
  onLCLChanged(event) {
    this.setLCLChange()
  }

  //method
  setLCLChange() {
    if (this.booking.lcl == true) {
      this.bookingDetailForm.get("quantity").setValidators([Validators.required])
      this.bookingDetailForm.get("groupContainer").disable()
    }
    else {
      this.bookingDetailForm.get("quantity").setValidators([])
      this.bookingDetailForm.get("groupContainer").enable()
    }
  }
  //#endregion 

  //#region File Upload
  onClick_browseFile(event) {
    if (this.limit_file_upload > this.documents.length) {
      if (this.fileUpload)
        this.fileUpload.nativeElement.click()
    }
    else {
      this.matSnackbar.open("File upload is limited", "warning", { duration: 4000, });
    }
  }

  onInput(event) {
    this.invisbleImageLoading = false
  }

  // file browse
  onFileSelected(event) {
    if (event.target.files[0]) {
      this.invisbleImageLoading = false
      let files: FileList = event.dataTransfer ? event.dataTransfer.files : event.target.files;

      for (let i = 0; i < files.length; i++) {
        //  let fileName:String = files[0].name.toString();
        // let  fileType = fniles[0].type
        let element: File = files[i]
        let fileName = element.name.toString();
        let fileType = element.type
        if (this.isImage(fileType) == true) {
          this._ngxPicaService.resizeImage(element, 1000, 800)
            .subscribe((imageResized: File) => {
              let reader: FileReader = new FileReader();
              reader.addEventListener('load', (res: any) => {
                let document = new DocumentModel()
                // const uuid = Guid.create(); 
                //     document.IDGenerate = uuid.toString();
                document.bookingID = this.booking.ID
                document.file = res.target.result

                document.ext = document.file.substring(11, document.file.indexOf(";"));
                document.file = document.file.substring(document.file.indexOf("base64,") + 7, document.file.length);
                document.fileName = fileName
                let existFile = this.documents.filter(file => "" + file.fileName + file.ext == "" + fileName + document.ext)
                existFile.length == 0 ? this.documents.push(document) : this.matSnackbar.open("File is existed", "warning", { duration: 2000, });

                this.invisbleImageLoading = true
              }, false);
              reader.readAsDataURL(imageResized);
            }, (err: NgxPicaErrorInterface) => {
              throw err.err;
            });
        }
        else {
          let reader: FileReader = new FileReader();
          reader.addEventListener('load', (res: any) => {
            let document = new DocumentModel()
            document.bookingID = this.booking.ID
            document.file = res.target.result
            //  console.log(fileType.toLowerCase().includes(".document"))

            if (fileType.toLowerCase().includes(".document")) {
              document.ext = "docx";
            }
            else {
              document.ext = fileType.substring(fileType.indexOf("/") + 1, fileType.length);
            }
            document.file = document.file.substring(document.file.indexOf("base64,") + 7, document.file.length);

            document.fileName = fileName
            let existFile = this.documents.filter(file => "" + file.fileName + file.ext == "" + fileName + document.ext)
            existFile.length == 0 ? this.documents.push(document) : this.matSnackbar.open("File is existed", "warning", { duration: 2000, });

            this.invisbleImageLoading = true
          }, false);
          reader.readAsDataURL(element);
        }

      }

    }
    else {
      this.invisbleImageLoading = true
    }

  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }


  isMultiple(): boolean {
    return this.multiple
  }

  isImage(fileType) {
    return fileType.split('/')[0] == 'image'//returns true or false
  }


  onClick_deleteDocument(doc: DocumentModel) {
    this.documentService.deleteDocument(doc.IDGenerate).subscribe(res => {
      if (StatusCode.success == res.status) {
        let indexArray = this.documents.indexOf(doc)
        this.documents.splice(indexArray, 1)
        this.matSnackbar.open("Doucment Remove", res.status, {
          duration: 2000,
        });
      }
    })
  }

  // service
  onLoadDocument(bookingID) {
    this.documentService.getListDocuments(bookingID).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.documents = res.body
      }
    })
  }

  fileSource: any
  fileSourceExt: any
  fileSourceName: any
  viewType: any

  onClick_ViewFile(doc: DocumentModel) {
    //   var image = new Image();
    //   let ext = '';
    this.viewType = doc.ext
    window.open(Api.url + "/" + doc.folder + "/" + doc.IDGenerate + "." + doc.ext, '_blank');
  }

  //#endregion 





}

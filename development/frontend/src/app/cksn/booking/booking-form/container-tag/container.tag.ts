import { OnInit, Component, Input, ViewChild, DoCheck, ElementRef, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContainerModel } from 'src/app/model/container.model';
import { PreData } from 'src/app/model/pre.data';
import { ComponentUtilities } from 'src/app/utilities/componentUtilities';
import { PredataService } from '../../../../services/predata/predata.service';
import { StatusCode } from '../../../../utilities/StatusCode';
import { Criterial } from '../../../../services/predata/criterial';
import { data } from 'jquery';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Range, CellCursorDirective, DataPosition } from './cellCursor';
import { Observable } from 'rxjs';
import { startWith, map, timeout } from 'rxjs/operators';
import { DateFormatPipe, yyyy_mm_dd_hh_mm } from '../../../../utilities/DateFormatPipe';
import { ChildrenItems } from '../../../../sidebar/sidebar.component';
import { MultipleDelivery } from '../../../../model/multipleDelivery.model';
import { ContainerService } from '../../../../services/container/container.service';
import { NumberFormat } from '../../../../utilities/number.format';
import { NgEventBus } from 'ng-event-bus';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare const $: any;

@Component({
    selector: 'container-tag',
    templateUrl: './container.tag.html',
    styleUrls: ['./container.tag.scss']
})
export class ContainerTag implements OnInit, AfterViewInit {
    @Input() dataSource: ContainerModel[]
    @ViewChild(CellCursorDirective) cellCursor: CellCursorDirective;
    @ViewChild('table') table: ElementRef;
    conLostFocus: boolean = false
    editCache = {};
    editCacheMultiDelivery: any = {};
    isEditingStatus = false;

    quantityUnitTypeID: any
    quantityUnitTypeList: PreData[]
    containerSizeList: PreData[]
    gwUnitTypeList: PreData[]


    gwUnitTypeID: number
    gw: number

    cbmUnitTypeList: PreData[]
    cbmUnitTypeID: number
    cbm: any

    // =====[ CHANGE ]===== //
    pickupDate: any
    conDeliveryDate: any

    containerNo: String
    containerNoCP: String

    containerSize: String // predata use value only
    quantity: number
    totalQuantity: number = 0
    totalGW: number = 0
    totalCBM: number = 0
    emptyDepo: any;

    qty: string = ''

    // =====|MULTIPLE DATA|===== //
    contactName: any = ''
    phoneContact: any = ''
    deliveryAddress: any = ''
    multipleDeliverDate: any

    // =====[ CHANGE ]===== //
    ifClick: false

    // =====[ END CHANGE ]===== //

    currentFocus: DataPosition

    constructor(private matSnackbar: MatSnackBar,
        private predataService: PredataService,
        private _dateFormatPipe: DateFormatPipe,
        private eventBus: NgEventBus,
        private containerService: ContainerService) {
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getTotalQYGWCBM();
        }, 2000)
    }
    ngOnInit(): void {
        this.loadPredata();
        document.addEventListener('keydown', e => {
            switch (e.code) {
                case 'ArrowUp':
                case 'ArrowDown':
                case 'Tab':
                case "Enter":
                case 'ShiftRight':
                case 'ShiftLeft':
                    e.preventDefault();
                    break;
            }
        })
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

            let isExistingData = this.dataSource.filter(fd => fd.containerNo == this.containerNo)
            if (isExistingData.length == 0) {
                this.dataSource.unshift(con)
                this.getTotalQYGWCBM();
            }
            this.containerNo = ''
            this.quantity = 0
            // this.updateEditCache()
        }
        else {
            this.matSnackbar.open("Something wrong when add container", "Invalid", {
                duration: 4000,
            });
        }
    }
    onClick_deleteContainer(element: ContainerModel) {
        let indexArray = this.dataSource.indexOf(element)

        if (this.dataSource[indexArray].ID == undefined) {
            this.dataSource.splice(indexArray, 1)
            this.matSnackbar.open("Removed!", "Success", { duration: 4000 });
        }
        else {
            this.dataSource[indexArray].isActive = 0
            this.dataSource = this.dataSource.filter(res => res.isActive == 1)
        }
        this.getTotalQYGWCBM();
    }

    // ==========|CALCULATE TOTAL QTY / CBM / GW|========== //
    getTotalQYGWCBM() {
        this.totalCBM = 0
        this.totalQuantity = 0
        this.totalGW = 0
        this.dataSource.forEach(ele => {
            this.totalQuantity = this.totalQuantity + Number(ele.quantity)
            this.totalCBM = this.totalCBM + Number(ele.cbm)
            this.totalGW = this.totalGW + Number(ele.gw)
            this.totalQuantity = Number(this.totalQuantity.toFixed(6))
            this.totalCBM = Number(this.totalCBM.toFixed(6))
            this.totalGW = Number(this.totalGW.toFixed(6))
        })
    }
    rowSelectect: ContainerModel

    // new function save container
    onEditEven(row: ContainerModel, index) {
        row.pickUpDate = this._dateFormatPipe.formatdate(row.pickUpDate, 'yyyy-MM-ddThh:mm');
        row.deliveryDate = this._dateFormatPipe.formatdate(row.deliveryDate, 'yyyy-MM-ddThh:mm');
        if (this.rowSelectect == undefined) {
            this.rowSelectect = row
        }
        if (this.rowSelectect != row) {
            this.rowSelectect.editing = false
            row.editing = true
            this.rowSelectect = row
        }
        else {
            this.rowSelectect.editing = true
        }
        this.setViewFocus();
    }


    onCellClick(row: ContainerModel, index) {
        if (this.rowSelectect != undefined) {
            this.dataSource.filter(el => el == this.rowSelectect)[0].quantityUnitType = this.quantityUnitTypeList.filter(el => el.ID == this.rowSelectect.quantityUnitTypeID)[0]
            this.dataSource.filter(el => el == this.rowSelectect)[0].gwUnitType = this.gwUnitTypeList.filter(el => el.ID == this.rowSelectect.gwUnitTypeID)[0]
            this.dataSource.filter(el => el == this.rowSelectect)[0].cbmUnitType = this.cbmUnitTypeList.filter(el => el.ID == this.rowSelectect.cbmUnitTypeID)[0]
        }
        this.dataSource.filter(el => {
            if (el.containerNo != row.containerNo) {
                el.editing = false
                this.getTotalQYGWCBM();
            }
        })
    }

    focusout(row) {
        row.editing = false
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 46 || charCode > 57)) {
            return false;
        }
        return true;

    }
    /* 
    |---------------------------------------------------------------------------|
    |                           PARSE DATA EXCELL DATA                          |
    |---------------------------------------------------------------------------|
    */
    parseExcelData(rawText) { }

    ifOnClick() {
        this.ifClick = false;
    }
    /* 
    |---------------------------------------------------------------------------|
    |                            ON DATA PAST EVENT                             |
    |---------------------------------------------------------------------------|
    */
    onDataPaste($event) {
        this.containerNo = this.containerNoCP;
        let pos = this.cellCursor.selected as Range
        let dataPaste = $event.dataPaste
        console.log(dataPaste);

        if (pos == undefined || dataPaste == undefined) return
        if (pos.start.col == undefined) return;

        for (let rowIndex = 0; rowIndex < dataPaste.length; rowIndex++) {
            let m: ContainerModel
            m = this.dataSource.filter(el => el.containerNo == dataPaste[rowIndex][0])[0]
            if (m == undefined) {
                m = new ContainerModel()
                m.key = ComponentUtilities.UUID()
            }
            for (let colIndex = 0; colIndex < dataPaste[rowIndex].length; colIndex++) {
                let valCol = ('' + dataPaste[rowIndex][colIndex]).replace(",", "");

                switch (colIndex) {
                    /* 
                    |---------------------------------------------------------------------------|
                    |    IN CASE WHEN USER SELECT ON PREVIOUS COLUMN TO AVOID WRONG DATA INDEX  |
                    |---------------------------------------------------------------------------|
                    */

                    // =====[ CONTAINER NO ]===== //
                    case 0:
                        m.containerNo = valCol
                        break;

                    // =====[ QUANTITY ]===== //
                    case 1:
                        m.quantity = '' + valCol == '' ? 1 : NumberFormat.isNumber(valCol) == true ? Number(valCol) : 0;
                        break;

                    // =====[ QW FORMART ]===== //
                    case 2:
                        m.gw = '' + valCol == '' ? 1 : NumberFormat.isNumber(valCol) == true ? Number(valCol) : 0;
                        break;

                    // =====[ QW TYPE ]===== //                   
                    case 3:
                        m.gwUnitType = dataPaste[rowIndex][0];
                        break;

                    // =====[ QW ]===== //                    
                    case 4:
                        m.gw = Number(valCol);
                        break;

                    // =====[ CONTAINER SIZE ]===== //                
                    case 5:
                        m.containerSize = dataPaste[rowIndex][3];
                        break;

                    // =====[ CBM ]===== //               
                    case 6:
                        m.cbm = NumberFormat.isNumber(valCol) == true ? Number(valCol) : 0;
                        break

                    // =====[ DROP OF DEPO ]===== //
                    case 7:
                        m.emptyDepo = dataPaste[rowIndex][10];
                        break

                    // =====[ PICK UP DATE TIME ]===== //
                    case 8:
                        m.pickUpDate = dataPaste[rowIndex][8];
                        break

                    // =====[ DELIVERY DATE TIME ]===== //
                    case 9:
                        m.deliveryDate = dataPaste[rowIndex][9];
                        break
                }
            }

            if (m.containerNo == '') {
                // this.resetContainerPassValue()
                // this.matSnackbar.open("Invalid", "Container Can't Be Null!", {
                //     duration: 4000,
                // });
                return;
            }
            // else {
            //     this.resetContainerPassValue()
            // }

            // =====[ CHANGE ]===== //
            if (m.containerSize == undefined) {
                m.containerSize = this.containerSizeList[0].value
                this.containerSize = this.containerSizeList[0].value
            }

            // =====[ QUANTITY TYPE ]===== //
            if (m.quantityUnitType == undefined) {
                for (let i in this.quantityUnitTypeList) {
                    if (dataPaste[rowIndex][2] == this.quantityUnitTypeList[i].value) {
                        m.quantityUnitType = this.quantityUnitTypeList[i]

                    }
                }
                m.quantityUnitTypeID = this.quantityUnitTypeList[0].ID
            }

            // =====[ GW TYPE ]===== //
            if (m.gwUnitType == undefined) {
                for (let index in this.gwUnitTypeList) {
                    if (dataPaste[rowIndex][5] == this.gwUnitTypeList[index].value) {
                        m.gwUnitType = this.gwUnitTypeList[index]
                    }
                }
                m.gwUnitTypeID = this.gwUnitTypeList[0].ID
            }

            if (m.cbmUnitType == undefined) {
                m.cbmUnitType = this.cbmUnitTypeList[0]
                // m.cbmUnitTypeID = this.cbmUnitTypeList[1]
            }

            if (m.quantity == undefined || m.quantity <= 0) {
                m.quantity = 1;
            }

            if (m.gw == undefined || m.gw <= 0) {
                m.gw = 1;
            }

            if (m.cbm == undefined || m.cbm <= 0) {
                m.cbm = 1;
            }

            let index = this.dataSource.findIndex(el => el.containerNo == m.containerNo)

            // =====[ CHANGE ] ===== //
            if ((index == -1 && dataPaste[0].length != 1) || (index == -1 && this.ifClick == false)) {
                this.dataSource.push(m)
                this.matSnackbar.open("Pasted", "Suucess", {
                    duration: 4000,
                });
                // ComponentUtilities.showNotification("Data past success", Criterial.successNotify)
            }
            else {
                this.dataSource[index] = m
                this.matSnackbar.open("Invalid", "Data already exited!", {
                    duration: 4000,
                });
                // ComponentUtilities.showNotification("Data already exited", Criterial.dangerNotify)
            }
            this.resetContainerPassValue()
            this.getTotalQYGWCBM();
        }
    }
    /* 
    |---------------------------------------------------------------------------|
    |              THIS USE FOR RESET COLUMN CONTAINER AT 0 INDEX               |
    |---------------------------------------------------------------------------|
    */
    resetContainerPassValue() {
        setTimeout(() => {
            this.containerNo = ""
            this.containerSize = ""
        }, 100)
    }
    /* 
   |---------------------------------------------------------------------------|
   |                               -|SWICH BOX|-                               |
   |---------------------------------------------------------------------------|
   */
    onKeyPressEvent($event) {
        switch ($event.key) {
            case 'Enter':
                let con = this.dataSource.filter(e => e.containerNo.trim().toLowerCase() == $event.cellVal.trim().toLowerCase());
                if (con.length > 0) {
                    con[0].editing = true;
                    this.setViewFocus();
                }
                else {
                    con = this.dataSource.filter(e => e.editing == true);
                    if (con.length > 0) {
                        con[0].editing = false;
                    }
                }
                this.getTotalQYGWCBM();
                break;
            case 'Tab':
                let conTab = this.dataSource.filter(e => e.editing == true);
                if (conTab.length > 0) {
                    this.setViewFocus();
                }
                break;

            case 'ArrowUp':
                console.log(this.currentFocus)
                break;

            case 'ArrowDown':
                console.log(this.currentFocus)
                break;

            //=====|CHANGE|===== //
            case 'ShiftRight':
                console.log(this.currentFocus)
                break;
            //=====|CHANGE|===== //
            case 'ShiftLeft':
                console.log(this.currentFocus)
                break;
        }
    }
    setViewFocus() {
        setTimeout(() => {
            try {
                this.table.nativeElement.tBodies[0].rows[this.cellCursor.selected.cursor.row]
                    .cells[this.cellCursor.selected.cursor.col]
                    .children[0].focus()
                // holde current focus
                this.currentFocus = this.cellCursor.selected.cursor
            } catch (error) {
            }
        }, 250)
    }
    loadPredata() {
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
    }
    // ==========|MULTIPLE DELIVERY|========== //
    multiDeliverys: MultipleDelivery[] = []
    refCon: any
    public minMultiDropDate = new Date()
    onClick_opernMultiDelivery(container: ContainerModel) {

        this.containerNoCP = container.containerNo;

        setTimeout(() => {
            // =====[ CHANGE ]===== //
            this.eventBus.cast('cellCursor', { hasFocus: false, mdclick: true });
        }, 100)

        this.refCon = { ID: container.ID, key: container.key }
        const index = this.dataSource.findIndex(item => item.key == this.refCon.key);
        $("#multiDropDialog").modal('toggle');
        $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
        if (container.ID != undefined) {
            if (container.multiDelivery != undefined && container.multiDelivery.length >= 0) {
                this.multiDeliverys = container.multiDelivery
                return;
            };
            this.minMultiDropDate = this.dataSource[index].deliveryDate
            this.containerService.getMultiDropByContainers(container.ID, '1').subscribe(res => {
                if (res.status == StatusCode.success) {
                    if (res.body.length > 0) {

                        this.multiDeliverys = []
                        if (this.dataSource[index].multiDelivery != undefined) {
                            let newData = this.dataSource[index].multiDelivery.filter(f => f.ID == undefined)
                            this.dataSource[index].multiDelivery = newData
                        }
                        else {
                            this.dataSource[index].multiDelivery = []
                        }

                        res.body.forEach(ele => {
                            ele.key = ComponentUtilities.UUID()
                            this.dataSource[index].multiDelivery.push(ele)
                        })
                        this.multiDeliverys = this.dataSource[index].multiDelivery
                        this.updateEditCacheMultiDelivery('')
                    }
                    else {
                        if (container.multiDelivery == undefined || container.multiDelivery.length == 0) {
                            this.dataSource[index].multiDelivery = []
                            this.multiDeliverys = []
                        }
                        else {
                            this.multiDeliverys = container.multiDelivery
                            this.dataSource[index].multiDelivery = JSON.parse(JSON.stringify(container.multiDelivery)) as MultipleDelivery[]
                        }
                    }
                }
                else {

                    let mulTil = this.dataSource[index].deliveryDate;

                    if (mulTil != undefined) {
                        Object.assign(this.multiDeliverys, this.dataSource[index].multiDelivery)
                        this.minMultiDropDate = this.dataSource[index].deliveryDate
                    }
                    else {
                        this.dataSource[index].multiDelivery = []
                        this.minMultiDropDate = new Date()
                    }
                }
            });
        }
        else {
            if (container.multiDelivery == undefined || container.multiDelivery.length == 0) {
                this.dataSource[index].multiDelivery = []
                this.multiDeliverys = []
            }
            else {
                this.multiDeliverys = container.multiDelivery
                this.dataSource[index].multiDelivery = JSON.parse(JSON.stringify(container.multiDelivery)) as MultipleDelivery[]
            }
        }
    }
    onClick_AddMultiDelivery() {
        let multi = new MultipleDelivery();
        if (this.contactName &&
            this.phoneContact &&
            this.deliveryAddress &&
            this.multipleDeliverDate
        ) {
            multi.contactName = this.contactName
            multi.phoneContact = this.phoneContact
            multi.address = this.deliveryAddress
            multi.deliveryDate = this.multipleDeliverDate // this._dateFormatPipe.formatdate(this.deliverDate,"dd-MM-yyyy")
            multi.key = ComponentUtilities.UUID()
            multi.isActive = 1
            const index = this.dataSource.findIndex(item => item.key == this.refCon.key);
            this.dataSource[index].multiDelivery.push(multi)
            this.multiDeliverys = this.dataSource[index].multiDelivery
            this.updateEditCacheMultiDelivery(multi.key)
            this.contactName = ''
        }
        else {
            this.matSnackbar.open("Something wrong when add multi droup", "Invalid", {
                duration: 4000,
            });
        }

        // =====|ATER SAVE SET THOSE VALUE NULL|===== //
        this.contactName = "",
            this.phoneContact = "",
            this.deliveryAddress = "",
            this.multipleDeliverDate = ""
    }

    editDeliveryDate: any
    startEditMultiDelivery(key) {
        this.editCacheMultiDelivery[key].edit = true;
        this.editCacheMultiDelivery[key].data.deliveryDate = this._dateFormatPipe.formatdate(this.editCacheMultiDelivery[key].data.deliveryDate, 'yyyy-MM-ddThh:mm');  // new Date(this.editCacheMultiDelivery[key].data.deliveryDate)
        this.editDeliveryDate = this.editCacheMultiDelivery[key].data.deliveryDate;
    }

    onClick_saveEditMultiDelivery(key) {
        const index = this.multiDeliverys.findIndex(item => item.key == key);
        const indexCon = this.dataSource.findIndex(item => item.key == this.refCon.key);
        this.dataSource[indexCon].multiDelivery[index] = this.editCacheMultiDelivery[key].data;
        this.editCacheMultiDelivery[key].edit = false;
        //this.editCacheMultiDelivery[key].data.deliveryDate = this._dateFormatPipe.formatdate(this.editCacheMultiDelivery[key].data.deliveryDate,"dd-MM-yyyy") 
    }

    onClick_cancelEditMultiDelivery(key) {
        const index = this.multiDeliverys.findIndex(item => item.key == key);
        const indexCon = this.dataSource.findIndex(item => item.key == this.refCon.key);
        this.dataSource[indexCon].multiDelivery[index] = this.editCacheMultiDelivery[key].data;
        this.editCacheMultiDelivery[key].edit = false;
    }

    updateEditCacheMultiDelivery(mKey): void {
        const index = this.dataSource.findIndex(item => item.key == this.refCon.key);
        this.dataSource[index].multiDelivery.forEach(item => {

            if (!this.editCacheMultiDelivery[item.key]) {
                this.editCacheMultiDelivery[item.key] = {
                    edit: false,
                    data: item
                };
            }
        });
    }

    onClick_deleteMultiDelivery(row: MultipleDelivery) {
        const indexCon = this.dataSource.findIndex(item => item.key == this.refCon.key);
        this.multiDeliverys.splice(this.multiDeliverys.indexOf(row), 1)
        this.matSnackbar.open("Removed!", "Successfully", { duration: 4000 });

        this.dataSource[indexCon].multiDelivery.forEach(res => {
            if (res.ID == undefined && res.key == row.key) {
                this.dataSource[indexCon].multiDelivery.splice(this.dataSource[indexCon].multiDelivery.indexOf(row), 1)
            }
            else {
                if (res.key == row.key) {
                    row.isActive = 0
                    res.isActive = 0
                }
            }
        })
    }
}
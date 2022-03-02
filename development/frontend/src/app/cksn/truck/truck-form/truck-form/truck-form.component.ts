import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../baseComponent';
import { FormControl, FormGroup } from '@angular/forms';
import { TruckModel } from '../../../../model/truck.model';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TruckService } from '../../../../services/truck/truck.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserModel } from '../../../../model/user.model';
import { Criterial } from '../../../../services/predata/criterial';
import { ComponentUtilities } from '../../../../utilities/componentUtilities';
import { AskForConfirmationDialogComponent } from '../../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { StatusCode } from '../../../../utilities/StatusCode';
import { BusinessPartnerModel } from '../../../../model/businesspartner.model';
import { BusinessPartnerService } from '../../../../services/business/business-partner.service';
import { take, startWith, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-truck-form',
  templateUrl: './truck-form.component.html',
  styleUrls: ['./truck-form.component.css']
})
export class TruckFormComponent extends BaseComponent implements OnInit {


  truckForm = new FormGroup(
    {
      ID: new FormControl(),
      model: new FormControl(),
      weight: new FormControl(),
      plateNo: new FormControl(),
      created: new FormControl(),
      assetOf: new FormControl(),
      status: new FormControl("1"),
      bizID: new FormControl(),
      bizPartner: new FormControl()
    }
  )

  assetOf: any = 'CKSN'
  businessPartnerList: BusinessPartnerModel[]
  filteredbusinessPartner: Observable<BusinessPartnerModel[]>


  constructor(public router: Router,
    private truckService: TruckService,
    private dialog: MatDialog,
    private matSnackbar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    private buesinessPartnerService: BusinessPartnerService
  ) {
    super(router)
    // console.log("port form")
  }

  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.truckForm)[0]
    if (this.permission && this.permission.isView == true) {
      setTimeout(() => {
        this.onLoadData()
      }, 1000);
      this.loadBusinessPartners();
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  // =====|ON SAVE|===== //
  onSave() {
    let truck: any;
    if (this.isEdit == "0") {
      truck = this.truckForm.getRawValue() as TruckModel
    }
    else {
      truck = this.truckForm.getRawValue() as TruckModel
    }

    truck.bizID = this.assetOf != 'BIZ' ? null : truck.bizPartner.ID

    console.log(truck)

    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure to CREATE ?", title: "An CREATE" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.truckService.saveTruck(truck).subscribe(res => {

          if (res.status == StatusCode.success) {

            ComponentUtilities.showNotification("YOU are CREATED, Successfully", Criterial.successNotify)

            this.router.navigate(["/truck"])
          }
          else {
            console.log(res.body)
            ComponentUtilities.showNotification("Something Wrong!!", Criterial.successNotify)
          }

        })
      }
    });
  }

  // =====|ON CANCLE|===== //
  onCancle() {
    this.router.navigate(["/truck"])
    ComponentUtilities.showNotification("TRUCK FORM, Cancled,", Criterial.primaryNotify)
  }

  isEdit = "0"
  onLoadData() {
    this.activateRoute.queryParams.subscribe(param => {
      if (param["element"]) {
        let element = JSON.parse(param["element"])
        if (element && element.isEdit == "1") {
          this.isEdit = "1"
          let truck = element.data as TruckModel
          this.truckForm.setValue(truck)
        }
      }
    })
  }


  selectionChangeAsset($event) {
    this.assetOf = $event.target.value
  }


  loadBusinessPartners() {
    this.buesinessPartnerService.getAllBusinessPartners().subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.businessPartnerList = res.body

        this.filteredbusinessPartner = this.truckForm.get('bizPartner').valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ''),
          map(name => name ? this.onfilteredBusinessPartner(name) : this.businessPartnerList.slice())
        )
      }
    })
  }

  onfilteredBusinessPartner(val: string): BusinessPartnerModel[] {
    return this.businessPartnerList.filter(biz => biz.name.toLowerCase().includes(val.toLowerCase()))
  }

  displayFnBusinessPartner(biz: BusinessPartnerModel) { return biz ? biz.name + ' - Company ' + biz.company : undefined; }
  onSelectionBusinessPartnerChanged(event) {
    if (event.option.value) {

    }
  }

}

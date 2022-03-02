import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from '../../baseComponent';
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel } from '../../../model/user.model';
import { Criterial } from '../../../services/predata/criterial';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { CountryService } from '../../../services/countrys/country.service';
import { StatusCode } from '../../../utilities/StatusCode';
import { CountryResponse } from '../../../model/country.response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { PortModel, PostingPort } from '../../../model/port.model';
import { PortService } from '../../../services/port/port.service';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';

@Component({
  selector: 'app-port-form',
  templateUrl: './port-form.component.html',
  styleUrls: ['./port-form.component.css']
})
export class PortFormComponent extends BaseComponent implements OnInit {

  countryList: CountryResponse[]
  countryResponse: CountryResponse
  filteredCountry: Observable<CountryResponse[]>

  portForm = new FormGroup(
    {
      ID: new FormControl(),
      country: new FormControl(),
      port: new FormControl(),
      code: new FormControl(),
      latlong: new FormControl(),
      telephone: new FormControl(),
      web: new FormControl(),
      portType: new FormControl("1"),
      createDate: new FormControl(),
      isActive: new FormControl("1")
    }
  )


  constructor(public router: Router,
    private portService: PortService,
    private dialog: MatDialog,
    private countryService: CountryService,
    private matSnackbar: MatSnackBar,
    private activateRoute: ActivatedRoute) {
    super(router)
    // console.log("port form")
  }

  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.portForm)[0]
    if (this.permission && this.permission.isView == true) {

      this.loadPredata()
      setTimeout(() => {
        this.onLoadData()
      }, 1000);
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }


  // =====|ON CREATE|===== //
  onSave() {
    let port: any;
    if (this.isEdit == "0") {
      port = this.portForm.getRawValue() as PostingPort
    }
    else {
      port = this.portForm.getRawValue() as PortModel
    }
    let country = JSON.parse(JSON.stringify(port.country)) as CountryResponse
    port.country = country.description.toString()
    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '500px',
      data: { message: "Are you sure to CREATE ?", title: "An CREATE" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.portService.addPort(port).subscribe(res => {

          if (res.status == StatusCode.success) {

            ComponentUtilities.showNotification("YOU are CREATED, Successfully", Criterial.successNotify)

            this.router.navigate(["/port"])
          }
          else {
            ComponentUtilities.showNotification("Something wrong!!", Criterial.successNotify)
          }
        })
      }
    });
  }

  // =====|ON CANCLE|===== //
  onCancle() {
    this.router.navigate(["/port"])

    ComponentUtilities.showNotification("PORT FORM, Cancled,", Criterial.warningNotify)
  }

  isEdit = "0"
  onLoadData() {
    this.activateRoute.queryParams.subscribe(param => {
      if (param["element"]) {
        let element = JSON.parse(param["element"])
        if (element && element.isEdit == "1") {
          this.isEdit = "1"
          let port = element.data as PortModel
          this.portForm.setValue(port)
          var country = this.countryList.filter(res => res.description.toLowerCase() == port.country.toLowerCase())[0]
          console.log(country)
          this.portForm.get("country").setValue(country)
        }
      }
    })
  }
  loadPredata() {
    this.countryService.getListCountrys().subscribe(res => {
      if (res.status == StatusCode.success) {
        this.countryList = res.body
        this.filteredCountry = this.portForm.get("country").valueChanges.pipe(
          startWith(''),
          map(value => typeof value == 'string' ? value : value ? value.name : ''),
          map(name => name ? this.onfilteredCountry(name) : this.countryList.slice())
        )
      }
    })
  }

  onfilteredCountry(name: String): CountryResponse[] { return this.countryList.filter(con => (con.description).toLowerCase().includes(name.toLowerCase()) == true) }
  displayCountry(country: CountryResponse) { return country ? (country.description) : undefined }

  onSelectionCountryChanged(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.countryResponse = event.option.value as CountryResponse
    }
  }


}

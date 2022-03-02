import { Component, OnInit } from '@angular/core';
import { CustomerModel } from '../../../model/customer.model';
import { FormControl, Validators, FormGroupDirective, NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { countrieList } from '../../../model/country.model';
import { CustomerService } from '../../../services/customer/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router, ActivatedRoute } from '@angular/router';
import { DateFormatPipe } from '../../../utilities/DateFormatPipe';
import { StatusCode } from '../../../utilities/StatusCode';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { UserModel } from '../../../model/user.model';
import { Criterial } from '../../../services/predata/criterial';
import { BaseComponent } from '../../baseComponent';
import { PredataService } from '../../../services/predata/predata.service';
import { PreData } from '../../../model/pre.data';
import { CustomerType } from '../../../model/customer.type';
import { filter, startWith, map } from 'rxjs/operators';
import { CountryService } from '../../../services/countrys/country.service';
import { Observable } from 'rxjs';
import { CountryResponse } from '../../../model/country.response';

export class ErrorStateMatcher extends BaseComponent implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted))
  }
}

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent extends BaseComponent implements OnInit {
  customerDetailForm: FormGroup;
  clientType: FormControl
  // emailFormControl1 = new FormControl('', [ Validators.required,Validators.email,]);
  // emailFormControl2 = new FormControl('', [Validators.email]);
  // phoneFormControl1 = new FormControl('', [Validators.required,Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$")]);
  // matcher = new ErrorStateMatcher();
  validation_messages = {
    name: [{ type: 'required', message: "Name is required" }],
    phone: [
      { type: 'pattern', message: 'Enter a valid phonenumber' }
    ],
    email: [
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    clientType: [
      { type: 'required', message: 'Type is required' }
    ],
    VATNo: [
      { type: 'required', message: 'VAT No is required' }
    ]
  }
  customer = new CustomerModel()
  clientTypeList: PreData[]

  countryList: CountryResponse[]
  countryResponse: CountryResponse
  filteredCountry: Observable<CountryResponse[]>
  constructor(private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private predataService: PredataService,
    private countryService: CountryService,
    private dialog: MatDialog,
    public router: Router,
    private activateRoute: ActivatedRoute,
    private matSnackbar: MatSnackBar,
    private _dateFormatPipe: DateFormatPipe) {
    super(router)
  }

  ngOnInit() {
    this.initForm()

    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.customerFormPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.checkModifyPermission();
      this.loadPredata();
      setTimeout(() => {
        this.onLoadData();
      }, 2000);
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }
  countryFrmController: FormControl

  initForm() {
    let NameControl = new FormControl('', { validators: Validators.compose([Validators.required]) })

    let VATNoFrmControl = new FormControl('', { validators: Validators.compose([Validators.required]) })
    this.countryFrmController = new FormControl()
    this.clientType = new FormControl()
    this.customerDetailForm = this.formBuilder.group(
      {
        name: NameControl,
        nameKH: new FormControl(),
        telephone1: new FormControl(),
        telephone2: new FormControl(),
        email1: new FormControl(),
        email2: new FormControl(),
        contactName: new FormControl(),
        contactPhone: new FormControl(),
        city: new FormControl(),
        countryCode: new FormControl(),
        country: this.countryFrmController,
        isCustomer: new FormControl(),
        VATNo: VATNoFrmControl,
        clientType: this.clientType,
        streetNo: new FormControl(),
        homeNo: new FormControl(),
        address1: new FormControl(),
        address2: new FormControl()
      }
    )
  }


  onClick_new() {
    this.customer = new CustomerModel()

  }

  isEdit = "0"
  onLoadData() {
    this.activateRoute.queryParams.subscribe(param => {
      if (param["element"]) {
        let element = JSON.parse(param["element"])
        if (element && element.isEdit == "1") {
          this.isEdit = "1"
          if (this.permission.isUpdate == false) this.isModify = false;
          this.customerService.findCustomerByID(element.ID)
            .subscribe(res => {
              // console.log(res)
              if (res.status == StatusCode.success && res.body.length > 0) {
                this.customer = res.body[0] as CustomerModel
                let customerType = []

                try {
                  this.countryFrmController.setValue(this.countryList.filter(res => res.description.toLowerCase() == this.customer.country.toLowerCase())[0])
                }
                catch (err) {
                  // console.log(err)
                }

                this.customer.customerType.forEach(res => {
                  // console.log(res)
                  if (res.isActive == 1) {
                    customerType.push(res.predataID)
                  }
                })
                this.clientType.setValue(customerType)
              }
            })
        }
      }
    })
  }
  onSubmitCustomerDefail(value) {
    this.getCustomerTypeSelected()
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(this.customer.email1) == false) {
      // this.matSnackbar.open("Validation", "Invalid email", {
      //   duration: 2000,
      // });
      ComponentUtilities.showNotification("Validation, Invalid email", Criterial.primaryNotify)
      return
    }

    console.log('this.customer', this.customer)

    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are You Sure To Create This?", title: "Create" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {

        this.customerService.addCustomers(this.customer).subscribe(res => {
          if (res.status == StatusCode.success) {
            ComponentUtilities.showNotification("Customer created!", Criterial.successNotify)
            this.router.navigate(["/customers"])
          }
          else {
            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
          }
        })
      }
    });

  }

  onClickCancel() {
    this.router.navigate(["/customers"])
    ComponentUtilities.showNotification("Customer form! YOU are cancled!", Criterial.warningNotify)
  }


  getCustomerTypeSelected() {
    let listClientTypeSelected: any[] = this.clientType.value
    if (this.customer.customerType.length > 0) {
      listClientTypeSelected.forEach(typeSelected => {
        let filterData = this.customer.customerType.filter(res => res.predataID == typeSelected)
        if (filterData.length > 0) {
          let filterData2 = listClientTypeSelected.filter(res => res = !filterData[0].predataID)
          if (filterData2.length > 0) {
            let customerType = new CustomerType()
            customerType.predataID = typeSelected
            this.customer.customerType.push(customerType)
          }
        }
        else {
          let isExistingData = this.customer.customerType.filter(res => res.predataID == typeSelected)
          if (isExistingData.length == 0) {
            let customerType = new CustomerType()
            customerType.predataID = typeSelected
            this.customer.customerType.push(customerType)
          }
        }
      })
      this.customer.customerType.forEach(rs => { rs.isActive = 0 })
      listClientTypeSelected.forEach(typeSelected => {
        this.customer.customerType.filter(f => f.predataID == typeSelected)[0].isActive = 1
      })
    }
    else {
      listClientTypeSelected.forEach(res => {
        let customerType = new CustomerType()
        customerType.isActive = 1
        customerType.predataID = res
        this.customer.customerType.push(customerType)
      })
    }
  }
  onCheckboxCustomerChanged(event) {
    this.customer.isCustomer = event.checked
    if (event.checked) {
      this.customerDetailForm.get("VATNo").setValidators(Validators.required)
    }
    else {
      this.customerDetailForm.get("VATNo").setValidators([])
    }
  }
  loadPredata() {
    this.predataService.getPreDefinedsByCriterial(Criterial.clientType).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.clientTypeList = res.body

        this.clientType.setValue([87]);
        this.clientType.setValidators(Validators.required)
      }
    })

    this.countryService.getListCountrys().subscribe(res => {
      console.log(res)
      if (res.status == StatusCode.success) {
        this.countryList = res.body
        this.filteredCountry = this.countryFrmController.valueChanges.pipe(
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
      this.customer.country = this.countryResponse.description
      this.customer.countryCode = this.countryResponse.countryCode
      this.customer.city = this.countryResponse.capital
    }
  }
}
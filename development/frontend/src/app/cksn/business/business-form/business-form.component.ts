import { Component, OnInit } from '@angular/core';
import { StatusCode } from '../../../utilities/StatusCode';
import { BusinessPartnerModel } from '../../../model/businesspartner.model';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { countrieList } from '../../../model/country.model';
import { BusinessPartnerService } from '../../../services/business/business-partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DateFormatPipe } from '../../../utilities/DateFormatPipe';
import { PhoneValidator } from '../../../utilities/validation';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { SessionManagement } from '../../../utilities/session_management';
import { Permission } from '../../../model/permission.model';
import { UserModel } from '../../../model/user.model';
import { Criterial } from '../../../services/predata/criterial';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.scss']
})
export class BusinessFormComponent extends BaseComponent implements OnInit {

  bizDetailForm: FormGroup;
  // emailFormControl1 = new FormControl('', [ Validators.required,Validators.email,]);
  // emailFormControl2 = new FormControl('', [Validators.email]);
  // phoneFormControl1 = new FormControl('', [Validators.required,Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$")]);
  // matcher = new ErrorStateMatcher();
  validation_messages = {
    firstName: [{ type: 'required', message: "First name is required" }],
    lastName: [{ type: 'required', message: "Last name is required" }],
    dob: [{ type: 'required', message: "DOB is required" }],
    phone: [
      { type: 'required', message: 'Phone is required' }
      //   { type: 'validCountryPhone', message: 'Phone is incorrect' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ]
  }
  business = new BusinessPartnerModel()
  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(private formBuilder: FormBuilder,
    private bizService: BusinessPartnerService,
    private dialog: MatDialog,
    public router: Router,
    private activateRoute: ActivatedRoute,
    private _dateFormatPipe: DateFormatPipe,
    private matSnackbar: MatSnackBar
  ) {

    super(router)

  }

  ngOnInit() {
    this.initForm()
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.businessFormPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.checkModifyPermission();
      this.onLoadData();
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  initForm() {
    let lastNameControl = new FormControl()
    let nameControl = new FormControl()
    let phoneControl = new FormControl()
    let handPhoneControl = new FormControl()
    let emailControl = new FormControl('', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]))
    let faxControl = new FormControl('', { validators: Validators.compose([]) })
    let websiteControl = new FormControl('', { validators: Validators.compose([]) })
    let descriptionControl = new FormControl('', { validators: Validators.compose([]) })
    let positionControl = new FormControl('', { validators: Validators.compose([]) })

    this.bizDetailForm = this.formBuilder.group(
      {
        name: nameControl,
        company: new FormControl(),
        lastName: lastNameControl,
        telephone: phoneControl,
        handPhone: handPhoneControl,
        email: emailControl,
        fax: faxControl,
        website: websiteControl,
        description: descriptionControl,
        position: positionControl
      }
    )
  }

  onSubmitBizDetail(value) {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    //   console.log(regexp.test(this.customer.email1)) 
    if (regexp.test("" + this.business.email) == false) {
      ComponentUtilities.showNotification("Validation, Invalid Email!", Criterial.dangerNotify)
      return
    }

    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure to CREATE ?", title: "An CREATE" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.bizService.saveBusinessPartner(this.business).subscribe(res => {
          if (res.status == StatusCode.success) {
            ComponentUtilities.showNotification("YOU are created, Successfully!", Criterial.successNotify)
            this.router.navigate(["/business"])
          }
          else {
            this.matSnackbar.open(res.body[0].toString(), res.status, { duration: 2000 });
          }
        })
      }
    });

  }


  onClick_new() {
    this.business = new BusinessPartnerModel()
  }

  isEdit = "0"
  onLoadData() {
    this.activateRoute.queryParams.subscribe(param => {
      if (param["element"]) {
        let element = JSON.parse(param["element"])
        if (element && element.isEdit == "1") {
          this.isEdit = "1"
          if (this.permission.isUpdate == false) this.isModify = false;
          this.bizService.getBusinessPartnerByID(element.ID)
            .subscribe(res => {
              if (res.status == StatusCode.success && res.body.length > 0) {
                this.business = res.body[0] as BusinessPartnerModel
              }
            })
        }
      }
    })
  }

  // =====|ON CANCLE|===== //
  onClickCancel() {
    this.router.navigate(["/business"])
    ComponentUtilities.showNotification("Biz Form YOU are cancled!", Criterial.warningNotify)
  }

}

import { SessionManagement } from '../utilities/session_management';
import { Permission } from '../model/permission.model';
import { Router } from '@angular/router';
import { JWTHelper } from '../utilities/jwt';
export class BaseComponent {
  public session: SessionManagement = new SessionManagement()
  public permission: Permission
  public isModify: boolean = false;
  public date_format_dd_mm_yy = "dd-MM-yy"

  constructor(public router: Router) {
    this.validateCache()
  }

  checkModifyPermission() {
    if (this.permission != undefined) {
      if (this.permission.isAdd == true) {
        this.isModify = true
      }
      else if (this.permission.isUpdate) {
        this.isModify = true
      }

    }
  }

  validateCache() { }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
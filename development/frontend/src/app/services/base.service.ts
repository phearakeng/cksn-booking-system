import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JWTHelper } from '../utilities/jwt';
import { SessionManagement } from '../utilities/session_management';
import { Router } from '@angular/router';
export class BaseService {

    //abc123
    // client_id = "abc123"
    // client_secret = "ssh-secret"
    // static basic = "Basic YWJjMTIzOnNzaC1zZWNyZXQ=";

    constructor(protected router: Router) { 
        if(!this.isValidToken()){
           this.logout()
        }
    }


 public logout() {
    console.log("logout")
    localStorage.clear();
    this.router.navigate(['pages/login'])
  }

    getHeader() {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            "client_id": "CK9999",
            "key": "99596168-f64f-489a-8679-c02eaf7b3d49"
        });
        return headers;
    }

    isValidToken() {
        try {
            let session = new SessionManagement()
            let decode = new JWTHelper(session.getAcToken()).decode()

            var currentTimeStamp = Date.parse(new Date().toLocaleString()) / 1000;
            // if current date  > token date
            if (currentTimeStamp >= decode.exp) {
                return false;
            }
            else {
                return true;
            }
        } catch (error) {
            return false;
        }
    }

}

export enum ResponseCode {
    invalid_grant = 403,
    unathorize = 401
}
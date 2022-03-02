import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../utilities/api';
import { EmailModel } from '../../model/email.model';
import { ResponseBody } from '../../utilities/responsebody';

@Injectable({
  providedIn: 'root'
})
export class MailService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

  // return token , refresh token , expire of token
  sendEmail(model:EmailModel){
    return this.http.post<ResponseBody<any>>
          (Api.sendMail,
            model
          )
  }
}

import { Injectable, Pipe } from '@angular/core';
import { UserModel } from '../../model/user.model';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';
import { HttpClient } from '@angular/common/http';
import { BaseService, ResponseCode } from '../base.service';
import { SessionManagement } from '../../utilities/session_management';
import { Router } from '@angular/router';
import { group } from '@angular/animations';
import { JWTHelper } from '../../utilities/jwt';
import { CryptoHelper } from '../../utilities/crypto.helper';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  constructor(private http: HttpClient, router: Router) { super(router); }

  addUsers(user: UserModel) {
    return this.http.post<ResponseBody<any>>(Api.addUser, user)
  }


  // return token , refresh token , expire of token
  login(user: UserModel) {
    let session = new SessionManagement();
    session.removeAcToken();
    // session.removeRefreshToken();
    const options = {
      headers: this.getHeader()
    };

    let json = {
      "username": user.userName,
      "password": user.password
    }
    return this.http.post<any>
      (Api.Login,
        json,
        options
      )
  }

  /**
   * method : findUserByID
   * @param ID 
   */
  findUserByID(ID: any) {
    // let session = new SessionManagement();
    // session.getUID()
    let json = { ID: ID }
    return this.http.post<ResponseBody<UserModel>>(Api.findUserByID, json)
  }

  /**
   * 
   * @param ID 
   * @method remove
   */
  removeUserByID(ID: any) {
    let json = { ID: ID }
    return this.http.post<ResponseBody<any>>(Api.removeUserByID, json)
  }


  /**
   * method : getUserByGroups
   * @param groupID 
   */
  getUserByGroups(groupID: any) {
    let json = { groupID: groupID }
    return this.http.post<ResponseBody<UserModel>>(Api.getUserByGroups, json)
  }


  /**
   * method : getListUserByPosition
   * @param positionID 
   */
  getListUserByPosition(positionID: any) {
    // let session = new SessionManagement();
    // session.getUID()
    let json = { positionID: positionID }
    return this.http.post<ResponseBody<UserModel>>(Api.getListUserByPosition, json)
  }

  /**
   * 
   * @param pageIndex 
   * @param pageSize 
   */
  getListUsers(pageIndex: any, pageSize: any) {
    let json = { "pageIndex": pageIndex, "pageSize": pageSize }
    return this.http.post<ResponseBody<UserModel>>(Api.getListUsers, json)
  }

  getListUserOperation() {
    return this.http.post<ResponseBody<UserModel>>(Api.getListUserOperation, {})
  }

  getCountUsers() {
    return this.http.post<ResponseBody<any>>(Api.getCountUsers, {})
  }

  isValidAccessToken() {
    try {
      let session = new SessionManagement()
      let decode = new JWTHelper(session.getAcToken()).decode()

      var currentTimeStamp = Date.parse(new Date().toLocaleString()) / 1000;
      // if current date  > token date
      if (currentTimeStamp >= decode.exp) {
        console.log("token expire")
        return false;
      }
      else {
        console.log("token valid")
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  getToken() {
    let session = new SessionManagement();
    return session.getAcToken();
  }
}
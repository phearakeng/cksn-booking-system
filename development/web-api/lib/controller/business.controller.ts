import { baseController } from './base.controller';
import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { BusinessPartnerRepository } from '../orm/repository/business.repository';

export class BusinessPartnerController extends baseController {

  constructor() {
    super()
    this.controllerName = "/Business/"
  }
  /**
   * @method getAllBusinessPartners
   * @param app s
   */
  public getAllBusinessPartners(app): void {
    app
      .post(this.controllerName + "getAllBusinessPartners",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(BusinessPartnerRepository).getAllBusinessPartners().then(
            qb => { res.send(qb) }
          )
        })
  }


  /**
   * 
   */
  getCountBusinessPartner(app) {
    app
      .post(this.controllerName + "getCountBusinessPartner",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(BusinessPartnerRepository).getCountBusinessPartner().then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * 
   */
  getListBusinessPartner(app) {
    app
      .post(this.controllerName + "getListBusinessPartner",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let pageIndex = req.body.pageIndex
          let pageSize = req.body.pageSize
          getCustomRepository(BusinessPartnerRepository).getListBusinessPartner(pageIndex, pageSize).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * 
   */
  getBusinessPartnerByID(app) {
    app
      .post(this.controllerName + "getBusinessPartnerByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let ID = req.body.ID
          console.log(ID)
          getCustomRepository(BusinessPartnerRepository).getBusinessPartnerByID(ID).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
  * 
  */
  removeBusinessPartnerByID(app) {
    app
      .post(this.controllerName + "removeBusinessPartnerByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let ID = req.body.ID
          getCustomRepository(BusinessPartnerRepository).removeBusinessPartnerByID(ID).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * 
   */
  saveBusinessPartner(app) {
    app
      .post(this.controllerName + "saveBusinessPartner",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let biz = req.body
          getCustomRepository(BusinessPartnerRepository).saveBusinessPartner(biz).then(
            qb => { res.send(qb) }
          )
        })
  }

}
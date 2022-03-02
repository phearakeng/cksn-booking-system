import { baseController } from './base.controller';
import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { CustomerRepository } from '../orm/repository/customer.repository';

export class CustomerController extends baseController {

  constructor() {
    super()
    this.controllerName = "/Customer/"
  }

  /**
* @method addCustomers
* @param app 
*/
  public addCustomers(app): void {
    app
      .post(this.controllerName + "addCustomers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let customer = req.body
          getCustomRepository(CustomerRepository).addCustomers(customer).then(
            qb => { res.send(qb) }
          )
        })
  }


  /**
  * @method getCountCustomers
  * @param app 
  */
  public getCountCustomers(app): void {
    app
      .post(this.controllerName + "getCountCustomers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(CustomerRepository).getCountCustomers()
            .then(
              qb => { res.send(qb) }
            )
        })
  }


  /**
  * @method getListCustomers
  * @param app 
  */
  public getListCustomers(app): void {
    app
      .post(this.controllerName + "getListCustomers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let pageIndex = req.body.pageIndex
          let pageSize = req.body.pageSize
          getCustomRepository(CustomerRepository).getListCustomers(pageIndex, pageSize).then(
            qb => { res.send(qb) }
          )
        })
  }


  removeCustomer(app): void {
    app
      .post(this.controllerName + "removeCustomer",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let customerID = req.body.customerID
          let userID = req.body.userID
          getCustomRepository(CustomerRepository).removeCustomer(customerID).then(
            qb => { res.send(qb) }
          )
        })
  }


  /**
   * @method getCustomerByType
   * @param app 
   */
  public getCustomerByType(app): void {
    app
      .post(this.controllerName + "getCustomerByType",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let customerType = req.body.customerType
          getCustomRepository(CustomerRepository).getCustomerByType(customerType).then(
            qb => { res.send(qb) }
          )
        })
  }


  /**
     * @method findCustomerByID
     * @param app 
     */
  public findCustomerByID(app): void {
    app
      .post(this.controllerName + "findCustomerByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let customerID = req.body.customerID
          getCustomRepository(CustomerRepository).findCustomerByID(customerID).then(
            qb => { res.send(qb) }
          )
        })
  }
}
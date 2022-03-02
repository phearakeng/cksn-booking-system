import { Request, Response } from "express";
import { baseController } from './base.controller';
import { getCustomRepository } from 'typeorm';
import { BrokerRepository } from '../orm/repository/broker.repostiory';

export class BrokerController extends baseController {

  constructor() {
    super()
    this.controllerName = "/Broker/"
  }

  /**
   * @method getListBroker
   * @param app 
   */
  public getAllBrokers(app): void {
    app
      .post(this.controllerName + "getAllBrokers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(BrokerRepository).getAllBrokers().then(
            qb => { res.send(qb) }
          )
        })
  }

}
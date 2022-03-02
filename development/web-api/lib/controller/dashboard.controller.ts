import { baseController } from './base.controller';
import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { BookingRepository } from '../orm/repository/booking.repository';

export class DashboardController extends baseController {

  constructor() {
    super()
    this.controllerName = "/Dashboard/"
  }


  /**
* @method getCountBookingStatusInMonth
* @param app 
*/
  public getCountBookingStatusInMonth(app): void {
    app
      .post(this.controllerName + "getCountBookingStatusInMonth",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(BookingRepository).getCountBookingStatusInMonth().then(
            qb => { res.send(qb) }
          )
        })
  }

  public getCountDataInMonth(app): void {
    app
      .post(this.controllerName + "getCountDataInMonth",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(BookingRepository).getCountDataInMonth().then(
            qb => { res.send(qb) }
          )
        })
  }

  public getCountMonthlyBooking(app): void {
    app
      .post(this.controllerName + "getCountMonthlyBooking",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(BookingRepository).getCountMonthlyBooking().then(
            qb => { res.send(qb) }
          )
        })
  }


}
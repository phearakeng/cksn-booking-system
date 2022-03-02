import { baseController } from './base.controller';
import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { TruckRepository } from '../orm/repository/truck.repository';
export class TruckController extends baseController {
    constructor() {
        super()
        this.controllerName = "/Truck/"
    }

    /**
   * @method getListTruckByDriver
   * @param app 
   */
    public getListTruckByDriver(app): void {
        app
            .post(this.controllerName + "getListTruckByDriver",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(TruckRepository).getListTruckByDriver().then(
                        qb => { res.send(qb) }
                    )
                })
    }

    public getAllTrucks(app) {
        app
            .post(this.controllerName + "getAllTrucks",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let pageIndex = req.body.pageIndex
                    let pageSize = req.body.pageSize
                    getCustomRepository(TruckRepository).getAllTrucks(pageSize, pageIndex).then(
                        qb => { res.send(qb) }
                    )
                })
    }

    public getCountTrucks(app) {
        app
            .post(this.controllerName + "getCountTrucks",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(TruckRepository).getCountTrucks().then(
                        qb => { res.send(qb) }
                    )
                })
    }

    /**
     * @method getAllTruck
     */

    public getAllTruck(app) {
        app
            .post(this.controllerName + "getAllTruck",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(TruckRepository).getAllTruck().then(
                        qb => { res.send(qb) }
                    )
                })
    }

    /**
     * @method getAllTruck
     */

    public saveTruck(app) {
        app
            .post(this.controllerName + "saveTruck",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(TruckRepository).saveTruck(req.body).then(
                        qb => { res.send(qb) }
                    )
                })
    }

}
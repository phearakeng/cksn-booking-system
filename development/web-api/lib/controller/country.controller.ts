import { baseController } from './base.controller';
import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { CountryRepository } from '../orm/repository/country.repository';

export class CountryController extends baseController {

    constructor() {
        super()
        this.controllerName = "/Country/"
    }

    /**
    * @method getListCountrys
    * @param app 
    */
    public getListCountrys(app): void {
        app
            .get(this.controllerName + "getListCountrys",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(CountryRepository).getListCountry().then(
                        qb => { res.send(qb) }
                    )
                })
    }


}
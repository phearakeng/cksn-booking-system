import { baseController } from './base.controller';
import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { PreDefinedFieldRepository } from '../orm/repository/preDefined.repository';
/**
 * @Controller
 */
export class PreDefinedFieldController extends baseController {

    constructor() {
        super()
        this.controllerName = "/predata/"
    }
    /**
   * @method getListPreDefinedsByCriterial
   * @param app 
   */
    public getPredataByCriterial(app): void {
        app
            .post(this.controllerName + "getPredataByCriterial",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let criterial = req.body.criterial
                    getCustomRepository(PreDefinedFieldRepository).getPreDefinedsByCriterial(criterial).then(
                        qb => { res.send(qb) }
                    )
                })
    }

    /**
       * @method addPreData
       * @param app 
       */
    public addPreData(app): void {
        app
            .post(this.controllerName + "addPreData",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let criterial = req.body.predata;
                    getCustomRepository(PreDefinedFieldRepository).addPreData(criterial).then(
                        qb => { res.send(qb) }
                    )
                })
    }

    /**
     * @method getListPredatas
     * @param app 
     */
    public getListPredatas(app): void {
        app
            .post(this.controllerName + "getListPredatas",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let criterial = req.body.criterial;
                    let pageIndex = req.body.pageIndex
                    let pageSize = req.body.pageSize

                    getCustomRepository(PreDefinedFieldRepository).getListPredatas(criterial, pageIndex, pageSize).then(
                        qb => { res.send(qb) }
                    )
                })
    }


    /**
     * @method getListCriterial
     * @param app 
     */
    public getListCriterial(app): void {
        app
            .post(this.controllerName + "getListCriterial",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(PreDefinedFieldRepository).getListCriterial().then(
                        qb => { res.send(qb) }
                    )
                })
    }

    /**
    * @method getCountPredatas
    * @param app 
    */
    public getCountPredatas(app): void {
        app
            .post(this.controllerName + "getCountPredatas",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let criterial = req.body.criterial
                    getCustomRepository(PreDefinedFieldRepository).getCountPredatas(criterial).then(
                        qb => { res.send(qb) }
                    )
                })
    }


}
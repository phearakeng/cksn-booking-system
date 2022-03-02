import { baseController } from './base.controller';
import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import { DepartmentRepository } from '../orm/repository/department.repository';
export class DepartmentController extends baseController {
    constructor() {
        super()
        this.controllerName = "/Department/"
    }


    /**
     * @method getDepartmentByID
     * @param app 
     * 
     */
    getDepartmentByID(app) {
        app
            .post(this.controllerName + "getDepartmentByID",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let departmentID = req.body.departmentID
                    getCustomRepository(DepartmentRepository).getDepartmentByID(departmentID).then(
                        qb => { res.send(qb) }
                    )
                })
    }


    /**
     * @method addNewGroupPermission
     * @param app 
     * 
     */
    addDepartment(app) {
        app
            .post(this.controllerName + "addDepartment",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let department = req.body
                    getCustomRepository(DepartmentRepository).addDepartment(department).then(
                        qb => {
                            console.log(qb)
                            res.send(qb)
                        }
                    )
                })
    }


    /**
     * @method addNewGroupPermission
     * @param app 
     * 
     */
    getListDepartments(app) {
        app
            .post(this.controllerName + "getListDepartments",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(DepartmentRepository).getListDepartments().then(
                        qb => {
                            console.log(qb)
                            res.send(qb)
                        }
                    )
                })
    }

    /**
     * @method getListDepartmentsPagin
     * @param app 
     * 
     */
    getListDepartmentsPagin(app) {
        app
            .post(this.controllerName + "getListDepartmentsPagin",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let pageIndex = req.body.pageIndex
                    let pageSize = req.body.pageSize
                    getCustomRepository(DepartmentRepository).getListDepartmentsPagin(pageIndex, pageSize).then(
                        qb => {
                            console.log(qb)
                            res.send(qb)
                        }
                    )
                })
    }

    /**
    * @method getCountDepartments
    * @param app 
    * 
    */
    getCountDepartments(app) {
        app
            .post(this.controllerName + "getCountDepartments",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    getCustomRepository(DepartmentRepository).getCountDepartments().then(
                        qb => {
                            res.send(qb)
                        }
                    )
                })
    }




    /**
   * @method addNewGroupPermission
   * @param app 
   * 
   */
    updateDepartment(app) {
        app
            .post(this.controllerName + "updateDepartment",
                //     passport.authenticate('bearer', { session: false }),
                (req: Request, res: Response) => {
                    let department = req.body
                    getCustomRepository(DepartmentRepository).updateDepartment(department).then(
                        qb => {
                            console.log(qb)
                            res.send(qb)
                        }
                    )
                })
    }



    /**
   * @method addNewGroupPermission
   * @param app 
   * 
   */
    // addMoreGroupIntoDepartment(app){
    //     app
    //     .post(this.controllerName+"addMoreGroupIntoDepartment",
    //       // passport.authenticate('bearer', { session: false }),
    //         (req: Request, res: Response) => {  
    //         let departmentID = req.body.departmentID
    //         let newGroup = req.body.newGroup
    //         getCustomRepository(DepartmentRepository).addMoreGroupIntoDepartment(departmentID,newGroup).then(
    //             qb =>{
    //                 console.log(qb)
    //                 res.send(qb)}
    //         ) 
    //      })  
    // }



}
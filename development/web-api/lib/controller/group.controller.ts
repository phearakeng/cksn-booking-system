import { baseController } from './base.controller';
import { getCustomRepository, createConnection } from 'typeorm';
import { Request, Response } from 'express';
import { GroupRepository } from '../orm/repository/group.repository';
export class GroupController extends baseController {
    constructor() {
        super()
        this.controllerName = "/group/"
    }

    /**
     * @method getListGroups
     */
    getListGroups(app): void {
        app.
            post(this.controllerName + "getListGroups",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                }
                , (req: Request, res: Response) => {
                    let pageIndex = req.body.pageIndex
                    let pageSize = req.body.pageSize
                    getCustomRepository(GroupRepository).getListGroups(pageIndex, pageSize)
                        .then(qb => {
                            res.send(qb)
                        })
                })
    }

    /**
    * @method getCountGroups
    */
    getCountGroups(app): void {
        app.
            post(this.controllerName + "getCountGroups",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                }
                , (req: Request, res: Response) => {
                    getCustomRepository(GroupRepository).getCountGroups()
                        .then(qb => {
                            res.send(qb)
                        })
                })
    }


    /**
     * @method getPermissionByGroupID
     * @param app 
     * 
     */
    getPermissionByGroupID(app) {
        app
            .post(this.controllerName + "getPermissionByGroupID",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let groupID = req.body.groupID
                    getCustomRepository(GroupRepository).getPermissionByGroupID(groupID).then(
                        qb => { res.send(qb) }
                    )
                })
    }


    /**
     * @method addNewGroupPermission
     * @param app 
     * 
     */
    addGroup(app) {
        app
            .post(this.controllerName + "addGroup",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let groupPersmissions = req.body
                    getCustomRepository(GroupRepository).addGroup(groupPersmissions).then(
                        qb => { res.send(qb) }
                    )
                })
    }

    /**
    * @method getGroupByDepartmentID
    * @param app 
    * 
    */
    getGroupByDepartmentID(app) {
        app
            .post(this.controllerName + "getGroupByDepartmentID",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let departmentID = req.body.departmentID
                    getCustomRepository(GroupRepository).getGroupByDepartmentID(departmentID).then(
                        qb => { res.send(qb) }
                    )
                })
    }


    /**
     * @method addNewGroupPermission
     * @param app 
     * 
     */
    updateGroupPermission(app) {
        app
            .post(this.controllerName + "updateGroupPermission",
                (req, res, next) => {
                    this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
                },
                (req: Request, res: Response) => {
                    let groupPersmissions = req.body
                    getCustomRepository(GroupRepository).updateGroupPermission(groupPersmissions).then(
                        qb => { res.send(qb) }
                    )
                })
    }



}
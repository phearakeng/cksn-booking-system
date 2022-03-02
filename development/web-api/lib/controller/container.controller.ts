import { Request, Response } from "express";
import { baseController } from './base.controller';
import { getCustomRepository } from 'typeorm';
import { ContainerRepository } from '../orm/repository/container.repository';
import { EWOULDBLOCK } from "constants";

export class ContainerController extends baseController {

  constructor() {
    super()
    this.controllerName = "/Container/"
  }


  /**
  * @method saveContainer
  * @param app 
  */
  public saveContainer(app): void {
    app
      .post(this.controllerName + "saveContainer",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let container = req.body
          getCustomRepository(ContainerRepository).saveContainer(container).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * @method saveTheContainer
   * @param app 
   */
  public saveDataImport(app): void {
    app
      .post(this.controllerName + "saveDataImport",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let container = req.body
          getCustomRepository(ContainerRepository).saveDataImport(container).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
 * @method saveTheContainer
 * @param app 
 */
  public saveTheContainer(app): void {
    app
      .post(this.controllerName + "saveTheContainer",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let container = req.body
          getCustomRepository(ContainerRepository).saveTheContainer(container).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
  * @method getListCotainters
  * @param app 
  */
  public getListCotainters(app): void {
    app
      .post(this.controllerName + "getListCotainters",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let pageIndex = req.body.pageIndex
          let pageSize = req.body.pageSize
          let containerStatusID = req.body.containerStatusID
          let fromDate = req.body.fromDate
          let toDate = req.body.toDate
          let groupID = req.body.groupID
          let userID = req.body.userID
          let isViewAll = req.body.isViewAll
          getCustomRepository(ContainerRepository).getListCotainters(pageIndex, pageSize, containerStatusID, fromDate, toDate, userID, groupID, isViewAll).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * 
   * @param app 
   * @method removeContainerByID
   */
  removeContainerByID(app): void {
    app
      .post(this.controllerName + "removeContainerByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let containerID = req.body.containerID
          getCustomRepository(ContainerRepository).removeContainerByID(containerID).then(
            qb => { res.send(qb) }
          )
        })

  }

  /**
   * @method getContainerByID
   * @param app 
   */
  public getContainerByID(app): void {
    app
      .post(this.controllerName + "getContainerByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let containerID = req.body.containerID
          getCustomRepository(ContainerRepository).getContainerByID(containerID).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * @method getCountBookings
   * @param app 
   */
  public getCountContainers(app): void {
    app
      .post(this.controllerName + "getCountContainers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let containerStatusID = req.body.containerStatusID
          let groupID = req.body.groupID
          let userID = req.body.userID
          let fromDate = req.body.fromDate
          let toDate = req.body.toDate
          let isViewAll = req.body.isViewAll
          console.log(req.body)
          getCustomRepository(ContainerRepository).getCountContainers(containerStatusID, userID, groupID, fromDate, toDate, isViewAll).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * @method getMultiDropByContainers
   * @param app 
   */
  public getMultiDropByContainers(app): void {
    app
      .post(this.controllerName + "getMultiDropByContainers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let containerID = req.body.containerID
          let isActive = req.body.isActive
          getCustomRepository(ContainerRepository).getMultiDropByContainers(containerID, isActive).then(
            qb => { res.send(qb) }
          )
        })
  }


  /**
  * @method saveMultiDelivery
  * @param app 
  */
  public saveMultiDelivery(app): void {
    app
      .post(this.controllerName + "saveMultiDelivery",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let multiDelivery = req.body
          getCustomRepository(ContainerRepository).saveMultiDelivery(multiDelivery).then(
            qb => { res.send(qb) }
          )
        })
  }

}
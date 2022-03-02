import { Request, Response } from "express";
import { baseController } from './base.controller';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../orm/repository/user.repository';
import { AuthenticationHandler } from "../authorization/AuthenticationHandler";

export class UserController extends baseController {

  constructor() {
    super()
    this.controllerName = "/User/"
  }


  /**
  * @method getListUsers
  * @param app 
  */
  public logIn(app): void {
    app.post('/user/login', new AuthenticationHandler().token);
  }




  /**
  * @method addUsers
  * @param app 
  */
  public addUsers(app): void {
    app
      .post(this.controllerName + "addUsers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let user = req.body
          getCustomRepository(UserRepository).addUser(user).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
  * @method updateUser
  * @param app 
  */
  public updateUser(app): void {
    app
      .post(this.controllerName + "updateUser",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let user = req.body
          getCustomRepository(UserRepository).updateUser(user).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * @method getUserByGroups
   * @param app 
   */
  public getUserByGroups(app): void {
    app
      .post(this.controllerName + "getUserByGroups",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let groupID = req.body.groupID
          getCustomRepository(UserRepository).getUserByGroups(groupID).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * @method getListUserByPosition
   * @param app 
   */
  public getListUserByPosition(app): void {
    app
      .post(this.controllerName + "getListUserByPosition",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let positionID = req.body.positionID
          getCustomRepository(UserRepository).getListUserByPosition(positionID).then(
            qb => { res.send(qb) }
          )
        })
  }

  public getListUserOperation(app): void {
    app
      .post(this.controllerName + "getListUserOperation",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(UserRepository).getListUserOperation().then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * @method getListUsers
   * @param app 
   */
  public getListUsers(app): void {
    app
      .post(this.controllerName + "getListUsers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let pageIndex = req.body.pageIndex
          let pageSize = req.body.pageSize
          getCustomRepository(UserRepository).getListUsers(pageIndex, pageSize).then(
            qb => { res.send(qb) }
          )
        })
  }



  /**
   * @method : getListUsersByType
   * @param app 
   */
  public getListUsersByType(app): void {
    app
      .post(this.controllerName + "getListUsersByType",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let userType = req.body.userType
          console.log(userType)
          getCustomRepository(UserRepository).getListUsersByType(userType).then(
            qb => { res.send(qb) }
          )
        })
  }




  /**
   * @method getCountUser
   * @param app 
   */
  public getCountUsers(app): void {
    app
      .post(this.controllerName + "getCountUsers",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          getCustomRepository(UserRepository).getCountUsers()
            .then(
              qb => { res.send(qb) }
            )
        })
  }

  /**
   * @method 
   */
  public findUserByID(app): void {
    app
      .post(this.controllerName + "findUserByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let ID = req.body.ID;
          getCustomRepository(UserRepository).findUserByID(ID)
            .then(
              qb => {
                res.send(qb)
              }
            )
        })
  }

  /**
   * @method removeUserByID
   * @param userID
   */
  public removeUserByID(app): void {
    app
      .post(this.controllerName + "removeUserByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let ID = req.body.ID;
          getCustomRepository(UserRepository).removeUserByID(ID)
            .then(
              qb => { res.send(qb) }
            )
        })
  }



  // // outhorization setting
  // /**
  //  * @method removeUserByID
  //  * @param userID
  //  */
  // public addClientAuhtorization(app): void {
  //   app
  //     .post(this.controllerName + "addClientAuhtorization",
  //       (req, res, next) => {
  //         this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
  //       },
  //       (req: Request, res: Response) => {
  //         let u = req.body;
  //         getCustomRepository(ClientOAuth2Repository).addClientAuhtorization(u)
  //           .then(
  //             qb => { res.send(qb) }
  //           )
  //       })
  // }


}
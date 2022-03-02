import { User } from '../entity/user';
import { EntityRepository, Repository, getRepository, getCustomRepository, QueryBuilder, getManager } from 'typeorm';
//import { DriverVehicleDetailRepository } from './vehicleDriver.repository';
import { Status } from '../../controller/base.controller';
import { ResponseBody } from './responseBody';
import { resolve } from 'path';
import { Department } from '../entity/department';
import { CryptoHelper } from '../../helper/crypto.helper';

/**
 * @Rina Chen
 */
@EntityRepository(User)
export class UserRepository extends Repository<User>
{


    /**
     * @method findByUsername
     * @param userName 
     */
    findByUsername(userName: String): Promise<any> {
        try {
            return this.createQueryBuilder("user")
                .select("user.ID")
                .addSelect("user.userName")
                .addSelect("user.password")
                .where("username = :username and isActive=1", { username: userName })
                .getOne();
        } catch (error) {
            console.log("UserRepository -> findByUsername " + error)
            return Promise.resolve(error)
        }
    }

    /**
        * @method findUser
        * @param userName , pasword
        */
    findUser(_username: String, _password: String): Promise<any> {
        try {
            return this.createQueryBuilder("user")
                .select('user.ID')
                .addSelect('user.password')
                .innerJoinAndSelect("user.group", "group")
                .where("username = :username and isActive=1", { username: _username })
                .getOne().then(q => {
                    let res: ResponseBody<any> = new ResponseBody()
                    res.body = [q]
                    res.status = Status.success
                    return Promise.resolve(res)
                })
        } catch (error) {
            let resBody: ResponseBody<any> = new ResponseBody()
            resBody.status = Status.server_error
            resBody.body = [error.message]
            return Promise.resolve(resBody);
        }
    }

    /**
     * @method findUserByID
     * @param ID 
     */
    async findUserByID(ID: number) {
        try {
            return this.createQueryBuilder("user")
                .leftJoinAndSelect("user.group", "group")
                .leftJoinAndSelect("group.department", "department")
                .leftJoinAndSelect("group.groupPermission", "permission")
                .leftJoinAndSelect("permission.page", "page")
                //   .innerJoinAndSelect("tblDepartment","dp","dg.tblDepartmentID=dp.ID")
                .where("user.ID=:ID and user.isActive=1", { ID: ID })
                //       .cache(true)
                .getOne()
                .then(x => {
                    let res: ResponseBody<any> = new ResponseBody()
                    res.body = [x]
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    let resBody: ResponseBody<any> = new ResponseBody()
                    resBody.status = Status.server_error
                    resBody.body = [error.message]
                    return Promise.resolve(resBody)
                })
        } catch (error) {
            console.log("UserRepository->findById " + error)
            let resBody: ResponseBody<any> = new ResponseBody()
            resBody.status = Status.server_error
            resBody.body = [error.message]
            return Promise.resolve(resBody)
        }
    }

    /**
     * @method updateUser
     * @param user 
     */
    updateUser(user: User): Promise<any> {
        let resBody: ResponseBody<String> = new ResponseBody()
        try {
            return this.update(user.ID, user)
                .then(res => {
                    resBody.body = ["1"]
                    resBody.status = Status.success
                    return Promise.resolve(resBody)
                })
                .catch(err => {
                    resBody.body = [err.message]
                    resBody.status = Status.logic_error
                    return Promise.resolve(resBody)
                })
        } catch (error) {
            resBody.body = [error]
            resBody.status = Status.server_error
            return Promise.resolve(resBody)
        }
    }

    /**
     * @method updateUsernamePassword
     * @param user : {ID:number,userName:string,password:any}
     */
    updateUsernamePassword(user: any) {
        let resBody: ResponseBody<String> = new ResponseBody()
        try {
            this.update(
                user.ID,
                {
                    userName: user.userName,
                    password: user.password
                }
            )
                .then(res => {
                    resBody.status = Status.success
                    resBody.body = ["1"]
                    return Promise.resolve(resBody)
                })
                .catch(err => {
                    resBody.status = Status.logic_error
                    resBody.body = [err.message]
                    return Promise.resolve(resBody)
                })
        }
        catch (error) {
            console.log("UserRepository->updateUsernamePassword " + error)
            resBody.body = [error]
            resBody.status = Status.server_error
            return Promise.resolve(resBody)
        }
    }


    /**
     * @method addUser
     * @param user 
     * 
     */
    addUser(user: User): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
           // console.log(user.password)
            user.password = CryptoHelper.decrypt_req(user.password)
          
            return getManager().transaction(transactionalEntityManager => {
                user.created = new Date()
                user.isActive = 1
                return this.save(user)
                    .then(res => {
                        resBody.status = Status.success
                        resBody.body = ["1"]
                        return Promise.resolve(resBody)
                    })
                    .catch(err => {
                        resBody.status = Status.logic_error
                        resBody.body = [err.message]
                        return Promise.resolve(resBody)
                    })

            })
        }
        catch (error) {
            resBody.status = Status.server_error
            resBody.body = [error.message]
            return Promise.resolve(resBody)
        }
    }

    /**
        * @method getUserByGroups
        */
    getUserByGroups(groupID: number): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("user")
                .select("user.ID")
                .addSelect("user.firstName")
                .addSelect("user.lastName")
                .where("user.isActive=1 and user.groupID = :groupID", { groupID: groupID })
                .getMany().then(x => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = x
                    rr.status = Status.success
                    return Promise.resolve(rr)
                })
                .catch(err => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = [err]
                    rr.status = Status.success
                    return Promise.resolve(rr)
                });
        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }

    /**
     * @method getListUserByPosition
     */
    getListUserByPosition(positionID: number): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("user")
                .select("user.ID")
                .addSelect("user.firstName")
                .addSelect("user.lastName")
                .addSelect("user.telephone1")
                .addSelect("user.telephone2")
                .where("user.isActive=1 and user.positionID = :positionID", { positionID: positionID })
                .getMany().then(x => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = x
                    rr.status = Status.success
                    return Promise.resolve(rr)
                })
                .catch(err => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = [err]
                    rr.status = Status.logic_error
                    return Promise.resolve(rr)
                });
        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }

    /**
     * @method getListUserByPosition
     */
    getListUserOperation(): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("user")
                .select("user.ID")
                .addSelect("user.firstName")
                .addSelect("user.lastName")
                .where("user.groupID = 1 and user.isActive=1 ")
                .getMany().then(x => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = x
                    rr.status = Status.success
                    return Promise.resolve(rr)
                })
                .catch(err => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = [err]
                    rr.status = Status.logic_error
                    return Promise.resolve(rr)
                });
        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }


    /**
     * @method getListUsers
     * @param pageIndex 
     * @param pageSize 
     */
    getListUsers(pageIndex, pageSize): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("user")
                .skip(pageIndex)
                .take(pageSize)
                .where("user.isActive='1'")
                .getMany().then(x => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = x
                    rr.status = Status.success
                    return Promise.resolve(rr)
                })
                .catch(err => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = [err]
                    rr.status = Status.success
                    return Promise.resolve(rr)
                });
        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }

    /**
     * @method getListUsersByType
     */
    public getListUsersByType(userType: number): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("user")
                .select("user.ID")
                .addSelect("user.userName")
                .where("user.isActive=1 and user.userType=:userType", { "userType": userType })
                .getMany().then(x => {
                    let rr: ResponseBody<any> = new ResponseBody()
                    rr.body = x
                    rr.status = Status.success
                    return Promise.resolve(rr)
                });
        } catch (error) {
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }

    /**
     * @@method getCountUsers
     */
    getCountUsers(): Promise<any> {

        try {
            return this.createQueryBuilder("user").getCount().then(
                x => {
                    let res: ResponseBody<any> = new ResponseBody()
                    res.status = Status.success
                    res.body = [x]
                    return Promise.resolve(res)
                }
            )
        } catch (error) {
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error]
            return Promise.resolve(res)
        }
    }

    /**
     * @method removeUserByID
     * @param ID 
     */
    removeUserByID(ID) {
        try {
            return this.update(ID, {
                isActive: 0,
            }).then(x => {
                let affectedRows: any = x.raw.affectedRows

                let res: ResponseBody<any> = new ResponseBody()
                res.body = ["Remove"]
                res.status = affectedRows == 1 ? Status.success : Status.logic_error
                return Promise.resolve(res)
            })
        } catch (error) {
            let res: ResponseBody<any> = new ResponseBody()
            res.status = Status.server_error
            res.body = [error]
            return Promise.resolve(res)
        }
    }


}
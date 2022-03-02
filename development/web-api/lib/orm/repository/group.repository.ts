import { EntityRepository, Repository, getRepository, getCustomRepository, QueryBuilder, getManager, getConnectionManager, getConnection } from 'typeorm';
//import { DriverVehicleDetailRepository } from './vehicleDriver.repository';
import { Status } from '../../controller/base.controller';
import { ResponseBody } from './responseBody';
import { Group } from '../entity/group.entity';
import { PermissionRepository } from './permission.repository';

/**
 * @Rina Chen
 */
@EntityRepository(Group)
export class GroupRepository extends  Repository<Group>
{


    getListGroups(pageIndex,pageSize){
        let resBody : ResponseBody<any> = new ResponseBody()
        try{
            return this.createQueryBuilder("group")
                        .skip(pageIndex)
                        .take(pageSize)
                        .where("group.status='1'")
                        .getMany()
                        .then(res=>{
                            resBody.body = res
                            resBody.status = Status.success
                            return  Promise.resolve(resBody)
                        })
                        .catch(err=>{
                            resBody.body = []
                            resBody.status = Status.logic_error
                           return Promise.resolve(resBody)
                        })
        }
        catch(err){
            resBody.status = Status.logic_error
            resBody.body = [err]
            return Promise.resolve(resBody)
        }
    }

    addGroup(grp:Group){
        console.log(grp.groupPermission)
        let resBody:ResponseBody<any> =new ResponseBody()   
         return  this.save(grp).then(res=>{
                     resBody.body = ["1"]
                     resBody.status = Status.success
                     return Promise.resolve(resBody);
                 })
                 .catch(err=>{
                        resBody.status = Status.logic_error
                        resBody.body = [err.message]
                        return Promise.resolve(resBody);
                 })
     }


      /**
     * @@method getCountGroups
     */
getCountGroups():Promise<any>{
    
    try {
     return this.createQueryBuilder("group").getCount().then(
          x =>{
              let res:ResponseBody<any> = new ResponseBody()
              res.status = Status.success
              res.body = [x]
              return Promise.resolve(res)
          }
      )
    } catch (error) {
      let res:ResponseBody<any> = new ResponseBody()
          res.status = Status.server_error
          res.body = [error]
      return Promise.resolve(res)
    }
}

getGroupByDepartmentID(departmentID){
        let resBody:ResponseBody<any> =new ResponseBody()   
        return  this
                .find(
                    {
                        where:[{departmentID:departmentID}]
                    }
                )
                .then(res=>{
                    resBody.body = res
                    resBody.status = Status.success
                    return Promise.resolve(resBody);
                })
                .catch(err=>{
                       resBody.status = Status.logic_error
                       resBody.body = [err.message]
                       return Promise.resolve(resBody);
                })
    }


    updateGroupPermission(grp:Group){
        let resBody:ResponseBody<any> =new ResponseBody()   
         return  this.update({ID:grp.ID},{group:grp.group,status:grp.status}).then(res=>{
                     return  getCustomRepository(PermissionRepository).updatePermission(grp.groupPermission)
                             .then(res=>{
                                    console.log(res)
                                    resBody.body = ["1"]
                                    resBody.status = Status.success
                                    return Promise.resolve(resBody);
                            })
                 })
                 .catch(err=>{
                        resBody.status = Status.logic_error
                        resBody.body = [err.message]
                        return Promise.resolve(resBody);
                 })
     }

    /**
     * @method getPermissionByGroupID
     * @param groupID 
     */
    getPermissionByGroupID(groupID){
        let resBody : ResponseBody<any> = new ResponseBody()
        try {
           resBody.status = Status.success
           console.log(groupID)
          return this.createQueryBuilder("group")
                     .innerJoinAndSelect("group.groupPermission","permission")
                     .innerJoinAndSelect("permission.page","page")
                     .where("group.ID = :ID",{ID:groupID})
                     .getMany().then(x=>{
                         console.log(x)
                        let rr : ResponseBody<any> = new ResponseBody()
                            rr.body = x
                            rr.status = Status.success
                            return Promise.resolve(rr)
                     })
                     .catch(err=>{
                        let rr : ResponseBody<any> = new ResponseBody()
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



}
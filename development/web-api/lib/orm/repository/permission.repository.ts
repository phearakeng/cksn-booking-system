import { EntityRepository, Repository, getRepository, getCustomRepository, QueryBuilder, getManager, getConnectionManager, getConnection } from 'typeorm';
//import { DriverVehicleDetailRepository } from './vehicleDriver.repository';
import { Status } from '../../controller/base.controller';
import { ResponseBody } from './responseBody';
import { Permission } from '../entity/group.permission';

/**
 * @Rina Chen
 */
@EntityRepository(Permission)
export class PermissionRepository extends  Repository<Permission>
{

  addPermission(grp:Permission[]){
    let resBody:ResponseBody<any> =new ResponseBody()
      try {
             return  this.save(grp)
                                     .then(res=>{
                                           resBody.body = ["1"]
                                           resBody.status = Status.success
                                           return Promise.resolve(resBody);
                                       })
                                        .catch(err=>{
                                                   resBody.status = Status.logic_error
                                                   resBody.body = [err.message]
                                            return Promise.resolve(resBody);
                                        })
      } catch (err) {
            resBody.status = Status.logic_error
            resBody.body = [err.message]
            return Promise.resolve(resBody)
      }
    }

    updatePermission(groupPermission:Permission[]){
      let resBody:ResponseBody<any> =new ResponseBody()
      try {
         groupPermission.forEach(p => {
            return this.update({ID:p.ID},p)
                .then(res=>{
                       resBody.status = Status.success
                       resBody.body = ["1"]
                               return Promise.resolve(resBody)
                 })
                .catch(err=>{
                         resBody.status = Status.logic_error
                        resBody.body = [err.message]
                        return Promise.resolve(resBody)
                 })
              });
        resBody.status = Status.success
        resBody.body = ["1"]
                      return Promise.resolve(resBody) 
      } catch (error) {
        resBody.status = Status.logic_error
        resBody.body = [error.message]
        return Promise.resolve(resBody)
      }
  }


}
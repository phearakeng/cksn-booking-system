import { EntityRepository, Repository, getRepository, getCustomRepository, QueryBuilder, getManager, getConnectionManager, getConnection } from 'typeorm';
//import { DriverVehicleDetailRepository } from './vehicleDriver.repository';
import { Status } from '../../controller/base.controller';
import { ResponseBody } from './responseBody';
import { Department } from '../entity/department';
/**
 * @Rina Chen
 */
@EntityRepository(Department)
export class DepartmentRepository extends  Repository<Department>
{
    async  addDepartment(grp:Department){
        let resBody:ResponseBody<any> =new ResponseBody()
          try {
            return this.save(grp) .then(res=>{
                resBody.body = ["1"]
                resBody.status = Status.success
                return Promise.resolve(resBody);
             })
          } catch (err) {
                resBody.status = Status.logic_error
                resBody.body = [err.message]
                return Promise.resolve(resBody)
          }
    }

    async  getListDepartments(){
        let resBody:ResponseBody<any> =new ResponseBody()
          try {
            return this.find({"status":1}).then(res=>{
                resBody.body = res
                resBody.status = Status.success
                return Promise.resolve(resBody);
             })
          } catch (err) {
                resBody.status = Status.logic_error
                resBody.body = [err.message]
                return Promise.resolve(resBody)
          }
    }


    async getListDepartmentsPagin(pageIndex,pageSize){
        let resBody : ResponseBody<any> = new ResponseBody()
        console.log(pageIndex+" "+pageSize)
    try {
            resBody.status = Status.success
            return this.createQueryBuilder("department")
                        .take(pageSize)
                       .skip(pageIndex)
                       
                       .getMany()
                       .then(x=>{
                              resBody.body = x
                              resBody.status = Status.success
                              return Promise.resolve(resBody)
                       })
                       .catch(err=>{
                          let rr : ResponseBody<any> = new ResponseBody()
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

 

    async  getCountDepartments(){
        let resBody:ResponseBody<any> =new ResponseBody()
          try {
            return this.createQueryBuilder("department")
            .getCount()
            .then(res=>{
                resBody.body = [res]
                resBody.status = Status.success
                return Promise.resolve(resBody);
             })
          } catch (err) {
                resBody.status = Status.logic_error
                resBody.body = [err.message]
                return Promise.resolve(resBody)
          }
    }

    async  updateDepartment(grp:Department){
        let resBody:ResponseBody<any> =new ResponseBody()
          try {
               return await this.update({ID:grp.ID},grp) .then(res=>{
                            resBody.body = ["1"]
                            resBody.status = Status.success
                             return Promise.resolve(resBody);
                        })
          } catch (err) {
                resBody.status = Status.logic_error
                resBody.body = [err.message]
                return Promise.resolve(resBody)
          }
    }

    /**
     * @method getPermissionByGroupID
     * @param departmentID 
     */
    getDepartmentByID(departmentID){
        let resBody : ResponseBody<any> = new ResponseBody()
        try {
           resBody.status = Status.success
           console.log(departmentID)
          return this.createQueryBuilder("department")
                     .innerJoinAndSelect("department.group","group")
                     .where("department.ID = :ID",{ID:departmentID})
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


    // async addMoreGroupIntoDepartment(department:Department,newGroup:Group){
    //     console.log(department)
    //     console.log(newGroup)
    
    //     let resBody:ResponseBody<any> =new ResponseBody()
    //     try {
    //         return  await getCustomRepository(GroupRepository).addGroup(newGroup).then(res=>{
    //             getConnection()
    //                .createQueryBuilder()
    //                .relation(Department, "groups")
    //               .of(department)
    //               .add(newGroup)
                  
    //             resBody.body = ["1"]
    //             resBody.status = Status.success
    //              return Promise.resolve(resBody);   
    //        });
    //     } catch (err) {
    //           resBody.status = Status.logic_error
    //           resBody.body = [err.message]
    //           return Promise.resolve(resBody)
    //     }

    // }

//    async  addDepartment(grp:Department){
//         console.log(grp)
//         let resBody:ResponseBody<any> =new ResponseBody()
//           try {
//             return  getCustomRepository(PermissionRepository).addPermission(grp.groups[0].groupPermission)
//                         .then(res=>{
//                             console.log(res)
//                             if(res.status==Status.success){
//                                 return  getCustomRepository(GroupRepository).addGroup(grp.groups[0])
//                                        .then(res=>{
//                                         console.log(res)
//                                              if(res.status==Status.success){
//                                                     return this.save(grp) .then(res=>{
//                                                             resBody.body = ["1"]
//                                                             resBody.status = Status.success
//                                                             return Promise.resolve(resBody);
//                                                     })
//                                                }
//                                             })
//                                         }
//                               })
//             resBody.body = ["1"]
//                                                             resBody.status = Status.success
//                                                              return Promise.resolve(resBody);
//           } catch (err) {
//                 resBody.status = Status.logic_error
//                 resBody.body = [err.message]
//                 return Promise.resolve(resBody)
//           }
//     }

}
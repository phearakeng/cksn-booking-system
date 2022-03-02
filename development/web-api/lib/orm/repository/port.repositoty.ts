
import { EntityRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { ResponseBody } from '../../orm/repository/responseBody';
import { Status } from '../../controller/base.controller';
import { Port } from '../entity/port.entity';

@EntityRepository(Port)
export  class PortRepository extends Repository<Port> {
    getPortList(portType:number):Promise<any>{
        let resBody : ResponseBody<any> = new ResponseBody()
        try {
          return this.createQueryBuilder("port")
                     .where("port.portType = :portType",{portType:portType})
                     .orderBy('port.port','ASC')
                     .getMany().then(x=>{
                            resBody.body = x
                            resBody.status = Status.success
                            return Promise.resolve(resBody)
                     })
                     .catch(err=>{
                        resBody.body = [err]
                        resBody.status = Status.logic_error
                        return Promise.resolve(resBody)
                     });
            } catch (error) {
                resBody.status = Status.server_error
                resBody.body = [error]
                return Promise.resolve(resBody);
            }
        }



        getPortListWithSize(pageIndex,pageSize){
            console.log(pageIndex,pageSize)
            let resBody : ResponseBody<any> = new ResponseBody()
            try{
                return this.createQueryBuilder("port")
                            .skip(pageIndex)
                            .take(pageSize)
                            .where("port.isActive='1'")
                            .orderBy("port.ID",'DESC')
                            .getMany()
                            .then(res=>{
                                resBody.body = res
                                resBody.status = Status.success
                                return  Promise.resolve(resBody)
                            })
                            .catch(err=>{
                                resBody.body = [err]
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

        getPortByID(ID:any){
            let resBody : ResponseBody<any> = new ResponseBody()
            try{
                return this.createQueryBuilder("port")
                            .where("port.isActive='1' and port.ID=ID",{ID:ID})
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

        addPort(port:Port){
            let resBody:ResponseBody<any> =new ResponseBody()   
            try{
             return  this.save(port).then(res=>{
                         resBody.body = ["1"]
                         resBody.status = Status.success
                         return Promise.resolve(resBody);
                     })
                     .catch(err=>{
                            resBody.status = Status.logic_error
                            resBody.body = [err.message]
                            return Promise.resolve(resBody);
                     })
                } catch (error) {
                    resBody.status = Status.server_error
                    resBody.body = [error]
                        return Promise.resolve(resBody)
            }
         }

         getCountPorts():Promise<any>{
    
            try {
             return this.createQueryBuilder("port")
             .where("port.isActive='1'")
             .getCount().then(
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



}
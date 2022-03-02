import { Carrier } from '../entity/carrier.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseBody } from './responseBody';
import { Status } from '../../controller/base.controller';

@EntityRepository(Carrier)
export  class CarrierRepository extends Repository<Carrier> {
    getAllCarriers():Promise<any>{
        let resBody : ResponseBody<any> = new ResponseBody()
        try {
          return this.createQueryBuilder("carrier")
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
}
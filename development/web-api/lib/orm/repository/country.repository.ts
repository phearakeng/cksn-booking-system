import { Repository, EntityRepository, getCustomRepository } from 'typeorm';
import { Customer } from '../entity/customer.entity';
import { ResponseBody } from './responseBody';
import { Status } from '../../controller/base.controller';
import { CustomerTypeRepository } from './customer.type.repository';
import { Country } from '../entity/country.entity';

@EntityRepository(Country)
export class CountryRepository extends Repository<Country>
{

/**
     * @method getListCustomers
 */
getListCountry():Promise<any>{
    let resBody : ResponseBody<any> = new ResponseBody()
    try {
       resBody.status = Status.success
      return this.createQueryBuilder("country")
                 .getMany().then(x=>{
                    
                    let rr : ResponseBody<any> = new ResponseBody()
                        rr.body = x
                        rr.status = Status.success
                        return Promise.resolve(rr)
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
}
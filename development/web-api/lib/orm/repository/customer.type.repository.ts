import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Customer } from '../entity/customer.entity';
import { ResponseBody } from './responseBody';
import { Status } from '../../controller/base.controller';
import { CustomerType } from '../entity/customer.type.entity';

@EntityRepository(CustomerType)
export class CustomerTypeRepository extends Repository<CustomerType>
{
    async addCustomerTypes(cusType:CustomerType){
            try {
                console.log("customerType",cusType)
                return await this.save(cusType)
                    .then(res=>{
                        let  response = new ResponseBody<any>();
                        response.body=["1"]
                        response.status = Status.success
                        return Promise.resolve(response);
                    })
                    .catch(error=>{
                        let  response = new ResponseBody<any>();
                        response.body=[error.message]
                        response.status = Status.logic_error
                        console.log("error addCustomerTypes",error)
                        return Promise.resolve(response);
                    })
            } 
            catch (error) {
                console.log("CustomerTypeRepository -> addCustomerType "+error)
                return Promise.resolve(error)
            }
        }

    
    remove(customerID){
            try {
                return this
                        .createQueryBuilder("customerType")
                        .delete()
                        .where("customerType.customerID = :customerID",{customerID:customerID})
                        .execute()
                        .then(res=>{
                             let  response = new ResponseBody<any>();
                            response.body=["1"]
                            response.status = Status.success
                            return Promise.resolve(response);
                    })
                    .catch(error=>{
                        let  response = new ResponseBody<any>();
                        response.body=[error.message]
                        response.status = Status.logic_error
                        return Promise.resolve(response);
                    })
            } 
            catch (error) {
                console.log("CustomerTypeRepository -> delete "+error)
                return Promise.resolve(error)
            }
        } 

}
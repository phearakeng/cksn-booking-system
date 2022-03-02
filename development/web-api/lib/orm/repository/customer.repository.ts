import { Repository, EntityRepository, getCustomRepository } from 'typeorm';
import { Customer } from '../entity/customer.entity';
import { ResponseBody } from './responseBody';
import { Status, baseController } from '../../controller/base.controller';
import { CustomerTypeRepository } from './customer.type.repository';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer>
{
    async addCustomers(customer: Customer) {
        try {
            let response = new ResponseBody();
            let dataExist = await this.checkExistingCustomerByEmail(customer);
            console.log("dataExist", dataExist);
            if (dataExist.body[0] == 0) {
                response = customer.ID == undefined ? await this.saveNew(customer) : await this.updateCustomer(customer);
            }
            else if (dataExist.body[0] >= 1) {
                if (customer.ID != undefined) {
                    this.addCustomerType(customer);
                    response = await this.updateCustomer(customer);
                }
                else {
                    response.body = ["Data is Existed, Please Review again!"];
                    response.status = Status.logic_error;
                }
            }
            return Promise.resolve(response);
        }
        catch (error) {
            console.log("CustomerRepository -> addCustomer" + error);
            return Promise.resolve(error);
        }
    }

    async saveNew(customer) {
        let response = new ResponseBody();
        return await this.save(customer)
            .then(() => {
                response.body = ["1"];
                response.status = Status.success;
                return Promise.resolve(response);
            })
            .catch(error => {
                response.body = [error.message];
                response.status = Status.logic_error;
                return Promise.resolve(response);
            })
    }

    updateCustomer(customer: Customer) {

        let response = new ResponseBody();
        if (customer.ID != undefined) {
            return this.update({ ID: customer.ID }, {
                email2: customer.email2,
                telephone1: customer.telephone1,
                telephone2: customer.telephone2,
                address1: customer.address1,
                address2: customer.address2,
                webSite: customer.webSite,
                country: customer.country,
                countryCode: customer.countryCode,
                isCustomer: customer.isCustomer,
                city: customer.city,
                nameKH: customer.nameKH,
                contactName: customer.contactName,
                VATNo: customer.VATNo,
                contactPhone: customer.contactPhone,
            })
                .then(() => {
                    response.body = ["1"];
                    response.status = Status.success;
                    return Promise.resolve(response);
                })
                .catch(error => {
                    response.body = [error.message];
                    response.status = Status.logic_error;
                    return Promise.resolve(response);
                });
        }
    }

    addCustomerType(customer: Customer) {
        customer.customerType.forEach((async ele => {
            ele.customer = customer;
            await getCustomRepository(CustomerTypeRepository).addCustomerTypes(ele);
        }));
    }


    async checkExistingCustomerByEmail(customer: Customer) {
        try {
            console.log("" + customer.email1.toLowerCase().replace(/\s+/g, ""))
            console.log("" + customer.name.toLowerCase().replace(/\s+/g, ""))
            return await // this.count({email1:""+customer.email1.toLowerCase().replace(" ",""),name:""+customer.name.toLowerCase().replace(" ","")})
                this.createQueryBuilder("customer")
                    .where("REPLACE(lower(email1),' ','') = :pemail and REPLACE(lower(name),' ','') = :pname", { pemail: "" + customer.email1.toLowerCase().replace(/\s+/g, ""), pname: "" + customer.name.toLowerCase().replace(/\s+/g, "") })
                    .getCount()
                    .then(res => {
                        let response = new ResponseBody<any>();
                        response.body = [res]
                        response.status = Status.success
                        console.log(response)
                        return Promise.resolve(response);
                    })
                    .catch(error => {
                        let response = new ResponseBody<any>();
                        response.body = [-1]
                        response.status = Status.logic_error
                        return Promise.resolve(response);
                    })
        }
        catch (error) {
            console.log("CustomerRepository -> addCustomer" + error)
            return Promise.resolve(error)
        }
    }

    /**
  * @method getCustomerByType
  */
    getCustomerByType(customerType): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.createQueryBuilder("customer")
                .innerJoin("customer.customerType", "customerType")
                .where("customerType.predataID = :customerType and customer.isActive=1", { customerType: customerType })
                //  .where(" customerType.predataID = :customerType",{customerType:customerType})
                .getMany().then(x => {
                    resBody.body = x
                    resBody.status = Status.success
                    return Promise.resolve(resBody)
                })
                .catch(err => {
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

    /**
     * 
     * @param customerID 
     */
    async removeCustomer(customerID: number) {
        try {
            return await this.update({ ID: customerID }, { isActive: 0 })
                .then(res => {
                    let response = new ResponseBody<any>();
                    response.body = ["1"]
                    response.status = Status.success
                    return Promise.resolve(response);
                })
                .catch(error => {
                    let response = new ResponseBody<any>();
                    response.body = [error.message]
                    response.status = Status.logic_error
                    return Promise.resolve(response);
                })
        }
        catch (error) {
            return Promise.resolve(error)
        }
    }


    /**
         * @method getListCustomers
         * @param pageIndex 
         * @param pageSize 
     */
    getListCustomers(pageIndex, pageSize): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("customer")
                .skip(pageIndex)
                .take(pageSize)
                .where("customer.isActive=1")
                .orderBy("createDate", "DESC")
                .getMany()
                .then(x => {

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
     * getCountCustomer
     */
    getCountCustomers(): Promise<any> {
        try {
            return this.createQueryBuilder("customer").getCount().then(
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
   * @method findCustomerByID
   * @param ID 
   */
    async findCustomerByID(ID: number) {
        try {
            return this.createQueryBuilder("customer")
                .leftJoinAndSelect("customer.customerType", "customerType")
                .where("customer.ID=:ID and customer.isActive=1", { ID: ID })
                //    .where("customer.ID=:ID",{ID:ID})
                //       .cache(true)
                .getOne()
                .then(x => {
                    let res: ResponseBody<any> = new ResponseBody()
                    res.body = [x]
                    console.log(x)
                    res.status = Status.success
                    return Promise.resolve(res)
                })
                .catch(error => {
                    let resBody: ResponseBody<any> = new ResponseBody()
                    resBody.status = Status.server_error
                    resBody.body = [error.message]
                    return Promise.resolve(resBody)
                })
        }
        catch (error) {
            let resBody: ResponseBody<any> = new ResponseBody()
            resBody.status = Status.server_error
            resBody.body = [error.message]
            return Promise.resolve(resBody)
        }
    }

}
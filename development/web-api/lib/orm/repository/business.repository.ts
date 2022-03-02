import { BusinessPartner } from '../entity/businesspartner';
import { EntityRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { ResponseBody } from '../../orm/repository/responseBody';
import { Status } from '../../controller/base.controller';

@EntityRepository(BusinessPartner)
export class BusinessPartnerRepository extends Repository<BusinessPartner> {
    getAllBusinessPartners(): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.createQueryBuilder("business")
                .where("business.isActive=1")
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


    getCountBusinessPartner() {
        try {
            return this.createQueryBuilder("biz").getCount().then(
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

    getListBusinessPartner(pageIndex, pageSize): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            resBody.status = Status.success
            return this.createQueryBuilder("biz")
                .skip(pageIndex)
                .take(pageSize)
                .where("biz.isActive=1")
                .orderBy("ID", "DESC")
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

    getBusinessPartnerByID(ID): Promise<any> {
        let resBody: ResponseBody<any> = new ResponseBody()
        try {
            return this.createQueryBuilder("biz")
                .where("biz.ID = :ID", { ID: ID })
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
            console.log(error)
            resBody.status = Status.server_error
            resBody.body = [error]
            return Promise.resolve(resBody);
        }
    }

    removeBusinessPartnerByID(ID: number) {
        let response = new ResponseBody<any>();
        try {
            return this.update({ ID: ID }, { isActive: 0 })
                .then(res => {
                    response.body = ["Remove"]
                    response.status = Status.success
                    return Promise.resolve(response);
                })
                .catch(error => {
                    response.body = [error.message]
                    response.status = Status.logic_error
                    return Promise.resolve(response);
                })
        }
        catch (error) {
            response.status = Status.server_error
            response.body = [error.message]
            return Promise.resolve(response);
        }
    }

    async saveBusinessPartner(biz: BusinessPartner) {
        let response = new ResponseBody<any>();
        try {
            let dataExisting = await this.checkExistingByEmail(biz)
            console.log(dataExisting.body[0])
            if (dataExisting.body[0] == 0) {
                return await this.save(biz)
                    .then(res => {
                        response.body = ["1"]
                        response.status = Status.success
                        return Promise.resolve(response);
                    })
                    .catch(error => {
                        response.body = [error.message]
                        response.status = Status.logic_error
                        return Promise.resolve(response);
                    })
            }
            else {
                if (biz.ID != null) {
                    return await this.save(biz)
                        .then(res => {
                            response.body = ["1"]
                            response.status = Status.success
                            return Promise.resolve(response);
                        })
                        .catch(error => {
                            response.body = [error.message]
                            response.status = Status.logic_error
                            return Promise.resolve(response);
                        })
                }
                else {
                    response.body = ["Data is Existed, Please Review again!"]
                    response.status = Status.logic_error
                    return Promise.resolve(response);
                }
            }

        }
        catch (error) {
            response.status = Status.server_error
            response.body = [error.message]
            return Promise.resolve(response);
        }
    }

    async checkExistingByEmail(biz: BusinessPartner) {
        try {

            return await
                this.count({ email: biz.email.trim() })
                    .then(res => {
                        let response = new ResponseBody<any>();
                        response.body = [res]
                        response.status = Status.success
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
            return Promise.resolve(error)
        }
    }

}
import { PreDefinedField } from '../entity/preDefinedField.entity';
import { Repository, EntityRepository } from 'typeorm';
import { ResponseBody } from './responseBody';
import { Status } from '../../controller/base.controller';

@EntityRepository(PreDefinedField)
export class PreDefinedFieldRepository extends Repository<PreDefinedField>{
    public getPreDefinedsByCriterial(criterial){
          let response =new  ResponseBody<any>()
          return this.createQueryBuilder("pre")
                //  .select("pre.ID")
                //  .addSelect("pre.criterial")
                //  .addSelect("pre.value")
                .orderBy('pre.value','ASC')
                 .where("pre.status='1' and pre.criterial=:criterial",{"criterial":criterial})
                 .getMany()
                 .then(qb=>{
                     response.body=qb
                     response.status=Status.success
                     return Promise.resolve(response)
                 })
                 .catch(err=>{
                    response.body=[err.message]
                    response.status=Status.logic_error
                    return Promise.resolve(response)
                 })
    }

    public getPreDefinedsByValue(criterial,value){
        let response =new  ResponseBody<any>()
        return this.createQueryBuilder("pre")
               .select("pre.ID")
               .addSelect("pre.criterial")
                .addSelect("pre.value")
                .orderBy('pre.value')
               .where("criterial = :criterial and LOWER(pre.value) = :value",{"criterial":criterial,"value":value})
               .getOne()
               .then(qb=>{
                
                   response.body=[qb]
                   response.status=Status.success
                   return Promise.resolve(response)
               })
               .catch(err=>{
                  response.body=[err.message]
                  response.status=Status.logic_error
                  return Promise.resolve(response)
               })
  }

   addPreData(data:PreDefinedField[]){
       console.log(data)
    let response =new  ResponseBody<any>()
    return this.save(data)
           .then(qb=>{
               response.body=["1"]
               response.status=Status.success
               return Promise.resolve(response)
           })
           .catch(err=>{
              response.body=[err.message]
              response.status=Status.logic_error
              return Promise.resolve(response)
           })
   }


   /**
    * @method getListPredatas
    * @param criterial 
    * @param pageIndex 
    * @param pageSize 
    */
   getListPredatas(criterial:string,pageIndex,pageSize){
       console.log("it called "+criterial)
    let resBody : ResponseBody<any> = new ResponseBody()
    try{
            if(criterial.toLocaleLowerCase() != "all")
            {
                return this.createQueryBuilder("predata")
                    // .select("predata.criterial","criterial")
                    // .addSelect("predata.description","description")
                    // .groupBy("predata.criterial")
                    // .addGroupBy("predata.description")
                    .skip(pageIndex)
                    .take(pageSize)
                    
                    .where("criterial=:criterial",{criterial:criterial})
                    
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
            else{
                return this.createQueryBuilder("predata")
                   .select("predata.description")
                   .addSelect("predata.criterial")
               // .skip(pageIndex)
                //.take(pageSize)
                .getMany()
                .then(res=>{
                    resBody.body = []
                    res.forEach(ele=>{
                         if(resBody.body.length==0){
                            resBody.body.push(ele) 
                         }
                         else {
                            let ch = resBody.body.filter(res=>res.criterial==ele.criterial)
                            if(ch.length==0){
                                resBody.body.push(ele)
                            }
                        }

                    })

                
                    
                    resBody.status = Status.success
                    return  Promise.resolve(resBody)
                })
                .catch(err=>{
                    resBody.body = []
                    resBody.status = Status.logic_error
                   return Promise.resolve(resBody)
                })
            }
    }
    catch(err){
        resBody.status = Status.logic_error
        resBody.body = [err]
        return Promise.resolve(resBody)
    }
}

getListCriterial(){
    try {
        return this.createQueryBuilder("predata")
        .select("predata.criterial","criterial")
        .groupBy("predata.criterial")
        .getRawMany()
        .then(
             x =>{
                 let res:ResponseBody<any> = new ResponseBody()
                 res.status = Status.success
                 res.body = x
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

    /**
     * @@method getCountPredatas
     */
getCountPredatas(criterial:string):Promise<any>{
    
    try {
        if(criterial.toLocaleLowerCase()=="all")
        {
            return this.
                   createQueryBuilder("predata").getCount().then(
                        x =>{
                              let res:ResponseBody<any> = new ResponseBody()
                              console.log(x)
                                  res.status = Status.success
                                  res.body = [x]
                                return Promise.resolve(res)
                     }
             )
        }
        else{
            return this.
            createQueryBuilder("predata")
            .where("predata.criterial=:criterial",{criterial:criterial})
            .getCount()
            .then(
                 x =>{
                         let res:ResponseBody<any> = new ResponseBody()
                             res.status = Status.success
                             res.body = [x]
                     return Promise.resolve(res)
               }
             )
             
        }
    } catch (error) {
      let res:ResponseBody<any> = new ResponseBody()
          res.status = Status.server_error
          res.body = [error]
      return Promise.resolve(res)
    }
}

} 
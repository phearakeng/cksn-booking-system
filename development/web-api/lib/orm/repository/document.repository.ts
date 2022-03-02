import { DocumentModel } from "../entity/document.entity";
import { EntityRepository, Repository } from 'typeorm';
import { Status } from '../../controller/base.controller';
import { ResponseBody } from './responseBody';
import { FileService } from '../../utilities';
import *  as uuid from 'uuid/v4';

@EntityRepository(DocumentModel)
export class DocumentRepository extends  Repository<DocumentModel>
{
    async  addDocuments(doc:DocumentModel[]){
        let resBody:ResponseBody<any> =new ResponseBody()
          try {
            return await this.save(doc) .then(res=>{
                             resBody.body = ["1"]
                             resBody.status = Status.success
                             this.saveCach(doc)
                             return Promise.resolve(resBody);
                          })
          } catch (err) {
                resBody.status = Status.logic_error
                resBody.body = [err.message]
                return Promise.resolve(resBody)
          }
    }

    async  getListDocuments(bookingID){
        let resBody:ResponseBody<any> =new ResponseBody()
          try {
            return await this.createQueryBuilder("doc")
                        .select("doc.ID")
                        .addSelect("doc.IDGenerate")
                        .addSelect("doc.bookingID")
                        .addSelect("doc.fileName")
                        .addSelect("doc.folder")
                        .addSelect("doc.ext")
                        .where ("doc.bookingID = :bookingID and status=1" ,{"bookingID":bookingID})
                        .getMany()
                        .then(res=>{
                              // let fileReader = new FileService()
                              // res.forEach(ele=>{
                              //      ele.file = fileReader.readDocument(ele.folder+"/"+ele.IDGenerate+"."+ele.ext)
                              //        if(!ele.file)  {
                              //                this.createQueryBuilder("doc")
                              //                .select("doc.file")
                              //                .where("doc.ID = :ID",{"ID":ele.ID})
                              //                .getOne()
                              //                .then(resFile=>{
                              //                      ele.file = resFile.file
                              //                      fileReader.saveLocalDocument(ele)
                              //                });
                              //      }
                              // })  
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

   async deleteDocument(IDGenerate){
      let resBody:ResponseBody<any> =new ResponseBody()
      try {
        return await this.update({IDGenerate:IDGenerate},{status:0}) .then(res=>{
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

    saveCach(documents:DocumentModel[]){
            try{
                let fileService =  new FileService();
                documents.forEach(element => {
                   try{
                          element.folder = fileService.getModayInWeek();
                          element.IDGenerate = uuid().toString()
                          fileService.saveLocalDocument(element)
                         
                          this.update({ID:element.ID},{IDGenerate:element.IDGenerate ,folder:fileService.getModayInWeek()})
                   }
                   catch(error){
                         console.log(error)
                   }
                }); 
                
            }
            catch(error){

            }
    }

    




 

}
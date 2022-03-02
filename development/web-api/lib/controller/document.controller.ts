import { baseController } from './base.controller';
import { getCustomRepository, createConnection } from 'typeorm';
import { Request, Response } from 'express';
import { DocumentRepository } from '../orm/repository/document.repository';
export class DocumentController extends baseController {
    constructor(){
        super()
        this.controllerName="/document/"
    }

    /**
     * @method addDocuments
     * @param app 
     * 
     */
    addDocuments(app){
        app
        .post(this.controllerName+"addDocuments",
        (req, res, next) => {
            this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
            (req: Request, res: Response) => {  
            let doc = req.body
            getCustomRepository(DocumentRepository).addDocuments(doc).then(
                qb =>{res.send(qb)}
            ) 
         })  
    }


    /**
     * @method getListDocuments
     * @param app 
     * 
     */
    getListDocuments(app){
        app
        .post(this.controllerName+"getListDocuments",
        (req, res, next) => {
            this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
            (req: Request, res: Response) => {  
            let bookingID = req.body.bookingID
            getCustomRepository(DocumentRepository).getListDocuments(bookingID).then(
                qb =>{res.send(qb)}
            ) 
         })  
    }


/**
 * 
 * @param app 
 * @method delete ducoment
 */
    deleteDocument(app){
        app
        .post(this.controllerName+"deleteDocument",
        (req, res, next) => {
            this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
            (req: Request, res: Response) => {  
            let IDGenerate = req.body.IDGenerate
            getCustomRepository(DocumentRepository).deleteDocument(IDGenerate).then(
                qb =>{res.send(qb)}
            ) 
         })
    }



}
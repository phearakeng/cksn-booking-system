import { baseController } from './base.controller';
import { Request, Response} from "express";
import { getCustomRepository } from 'typeorm';
import { PageRepository } from '../orm/repository/page.repository';

export class PageController extends baseController{

    constructor(){
        super()
        this.controllerName="/Page/"
    }
   /**
    * @method getAllPages
    * @param app s
    */
   public getAllPages(app):void{
    app
    .post(this.controllerName+"getAllPages",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
      },
        (req: Request, res: Response) => {
        getCustomRepository(PageRepository).getAllPages().then(
            qb =>{res.send(qb)}
        ) 
     })
   }
}
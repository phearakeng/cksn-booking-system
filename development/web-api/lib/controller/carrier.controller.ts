import { baseController } from './base.controller';
import { Request, Response} from "express";
import { getCustomRepository } from 'typeorm';
import { CarrierRepository } from '../orm/repository/carrier.repository';

export class CarrierController extends baseController{

    constructor(){
        super()
        this.controllerName="/Carrier/"
    }
   /**
    * @method getAllCarriers
    * @param app s
    */
   public getAllCarriers(app):void{
    app
    .post(this.controllerName+"getAllCarriers",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
    },
        (req: Request, res: Response) => {  
        getCustomRepository(CarrierRepository).getAllCarriers().then(
            qb =>{res.send(qb)}
        ) 
     })
   }
}
import { baseController } from './base.controller';
import { Request, Response} from "express";
import { getCustomRepository } from 'typeorm';
import { PortRepository } from '../orm/repository/port.repositoty';

export class PortController extends baseController{

    constructor(){
        super()
        this.controllerName="/Port/"
    }
   /**
    * @method getPortList
    * @param app s
    */
   public getPortList(app):void{
    app
    .post(this.controllerName+"getPortList",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
      },
        (req: Request, res: Response) => {  
            let portType = req.body.portType
        getCustomRepository(PortRepository).getPortList(portType).then(
            qb =>{res.send(qb)}
        ) 
     })
   }


   public getPortListWithSize(app):void{
    app
    .post(this.controllerName+"getPortListWithSize",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
      },
        (req: Request, res: Response) => {  
            let pageSize = req.body.pageSize
            let pageIndex = req.body.pageIndex
        getCustomRepository(PortRepository).getPortListWithSize(pageIndex,pageSize).then(
            qb =>{res.send(qb)}
        ) 
     })
   }

   public getPortByID(app):void{
    app
    .post(this.controllerName+"getPortByID",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
      },
        (req: Request, res: Response) => {  
            let ID = req.body.ID
        getCustomRepository(PortRepository).getPortByID(ID).then(
            qb =>{res.send(qb)}
        ) 
     })
   }

   public addPort(app):void{
    app
    .post(this.controllerName+"addPort",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
      },
        (req: Request, res: Response) => {  
            let port = req.body
        getCustomRepository(PortRepository).addPort(port).then(
            qb =>{res.send(qb)}
        ) 
     })
   }

   public getCountPorts(app):void{
    app
    .post(this.controllerName+"getCountPorts",
    (req, res, next) => {
        this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
      },
        (req: Request, res: Response) => {  
        getCustomRepository(PortRepository).getCountPorts().then(
            qb =>{res.send(qb)}
        ) 
     })
   }


}
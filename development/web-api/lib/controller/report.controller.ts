import { Request, Response} from "express";
import { baseController } from './base.controller';
import { ReportRepository } from "../orm/repository/report.repository";



export class ReportController extends baseController{
  
  repo : ReportRepository
    constructor(){
        super()
        this.controllerName="/report/"
        this.repo = new ReportRepository();
    }

   public getEmptyReport(app):void{
    app
    .post(this.controllerName+"getEmptyReport",
    (req, res, next) => {
      this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
    },
        (req: Request, res: Response) => {  
        let filterModel = req.body as FilterReportModel
        console.log(this.repo.getEmptyReport(filterModel))
       return this.repo.getEmptyReport(filterModel).then(   qb => { res.send(qb) });
     })
   }

   public getConsoleReport(app):void{
    app
    .post(this.controllerName+"getConsoleReport",
    (req, res, next) => {
      this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
    },
        (req: Request, res: Response) => {  
        let filterModel = req.body as FilterReportModel
        return this.repo.getConsoleReport(filterModel).then(   qb => { res.send(qb) })
     })
   }

}
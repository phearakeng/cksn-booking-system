import * as express from "express";
import * as bodyParser from "body-parser";
import { createConnection, getCustomRepository, getRepository } from 'typeorm';
import { UserController } from './controller/user.controller';
import { GroupController } from './controller/group.controller';
import { DepartmentController } from './controller/department.controler';
import { PreDefinedFieldController } from './controller/pre_defined.controller';
import { CustomerController } from "./controller/customer.controller";
import { BusinessPartnerController } from "./controller/business.controller";
import { CarrierController } from "./controller/carrier.controller";
import { TruckController } from "./controller/truck.controller";
import { BookingController } from "./controller/booking.controller";
import { PortController } from "./controller/port.controller";
import { DocumentController } from "./controller/document.controller";
import { ContainerController } from "./controller/container.controller";
import { BrokerController } from "./controller/broker.controller";
import { PageController } from "./controller/page.controller";
import { MailController } from "./controller/mail.cotroller";
import { CountryController } from './controller/country.controller';
import { DashboardController } from './controller/dashboard.controller';
import { ReportController } from "./controller/report.controller";
import { CryptoHelper } from "./helper/crypto.helper";
import "reflect-metadata";

// import { Reflect } from 'reflect-metadata';
var path = require('path')

/**
 * Scripter  : Rina Chen :>
 */
class App {

    public app: express.Application
    // public token=new Token()

    public userController: UserController = new UserController()
    public truckController: TruckController = new TruckController()
    public usrGrpPermisController = new GroupController()
    public usrDepartmentController = new DepartmentController();
    public preDefinedFieldController: PreDefinedFieldController = new PreDefinedFieldController()
    public customerController = new CustomerController()
    public businessController = new BusinessPartnerController()
    public carrierController = new CarrierController()
    public bookingController = new BookingController()
    public reportController = new ReportController()
    public portController = new PortController()
    public documentController = new DocumentController()
    public containerController = new ContainerController()
    public brokerController = new BrokerController()
    public pageController = new PageController()
    public mailController = new MailController()
    public countryController = new CountryController()
    public dasbaordControler = new DashboardController();

    constructor() {
        this.app = express();
        this.initDatabase()
        this.config();
        this.getUserController()
        this.groupPermissionController()
        this.getPredefinedFieldController()
        this.departmentController();
        this.getCustomerController();
        this.getBusinessController();
        this.getCarrierController();
        this.getTruckController();
        this.getBookingController();
        this.getPortController();
        this.getDocumentController()
        this.getContainerController()
        this.getBrokerController()
        this.getPageController();
        this.getDashboardController();
        this.getReportController();
        this.countryController.getListCountrys(this.app);
        this.mailController.sendMail(this.app)
    }
    private config(): void {
        this.app.use(express.static(path.join(__dirname + "/document")));
        this.app.use(bodyParser.json({ limit: '20mb' }));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,client_id,key");
            next();
        });
    }
    /**
    * @method init Database
    */
    private initDatabase() {
        createConnection().then(async connection => {
            console.log("ORM connected");
        }).catch(error => {
            console.log(error)
        });
    }
    /**
     * @controller  getUserController
     */
    private getUserController() {
        this.userController.logIn(this.app)
        this.userController.addUsers(this.app)
        this.userController.updateUser(this.app)
        this.userController.getListUsers(this.app)
        this.userController.getListUsersByType(this.app)
        this.userController.getCountUsers(this.app)
        this.userController.findUserByID(this.app)
        this.userController.removeUserByID(this.app)
        this.userController.getUserByGroups(this.app)
        this.userController.getListUserByPosition(this.app)
        this.userController.getListUserOperation(this.app)
    }

    /**
    *   @Truck
    */
    private getTruckController() {
        this.truckController.getListTruckByDriver(this.app);
        this.truckController.getAllTruck(this.app);
        this.truckController.getAllTrucks(this.app);
        this.truckController.getCountTrucks(this.app);
        this.truckController.saveTruck(this.app);
    }

    private groupPermissionController() {
        this.usrGrpPermisController.getPermissionByGroupID(this.app)
        this.usrGrpPermisController.updateGroupPermission(this.app)
        this.usrGrpPermisController.addGroup(this.app)
        this.usrGrpPermisController.getCountGroups(this.app)
        this.usrGrpPermisController.getGroupByDepartmentID(this.app)
        this.usrGrpPermisController.getListGroups(this.app)
    }

    private departmentController() {
        this.usrDepartmentController.addDepartment(this.app)
        this.usrDepartmentController.getListDepartments(this.app)
        this.usrDepartmentController.updateDepartment(this.app)
        this.usrDepartmentController.getDepartmentByID(this.app)
        this.usrDepartmentController.getCountDepartments(this.app)
        this.usrDepartmentController.getListDepartmentsPagin(this.app)
    }

    /**
     * @controller getPredefinedFieldController
     */
    private getPredefinedFieldController() {
        this.preDefinedFieldController.getPredataByCriterial(this.app)
        this.preDefinedFieldController.addPreData(this.app)
        this.preDefinedFieldController.getListPredatas(this.app)
        this.preDefinedFieldController.getListCriterial(this.app)
        this.preDefinedFieldController.getCountPredatas(this.app)
    }

    /**
     * @controller customer
     */
    private getCustomerController() {
        this.customerController.addCustomers(this.app);
        this.customerController.getCountCustomers(this.app)
        this.customerController.getListCustomers(this.app)
        this.customerController.findCustomerByID(this.app)
        this.customerController.getCustomerByType(this.app)
        this.customerController.removeCustomer(this.app)
    }

    /**
     * @controller bussiness
     */
    private getBusinessController() {
        this.businessController.getAllBusinessPartners(this.app)
        this.businessController.getCountBusinessPartner(this.app)
        this.businessController.getListBusinessPartner(this.app)
        this.businessController.saveBusinessPartner(this.app)
        this.businessController.getBusinessPartnerByID(this.app)
        this.businessController.removeBusinessPartnerByID(this.app)
    }

    /**
     * @controler
     */
    private getCarrierController() {
        this.carrierController.getAllCarriers(this.app)
    }

    /**
     * @cointroler booking
     */
    private getBookingController() {
        this.bookingController.saveBooking(this.app)
        this.bookingController.getCountBookings(this.app)
        this.bookingController.getListBookings(this.app)
        this.bookingController.getBookingByID(this.app)
        this.bookingController.updateBookingStatus(this.app)
        // this.bookingController.getGenerateCKSNCode(this.app)
        this.bookingController.removeBooking(this.app)
        this.bookingController.getBookingByCKSNNo(this.app)
        //reporting
        this.bookingController.getBookingsReport(this.app)
    }

    /**
     * @controller container
     */
    private getContainerController() {
        this.containerController.getListCotainters(this.app)
        this.containerController.getCountContainers(this.app)
        this.containerController.saveContainer(this.app)
        this.containerController.getContainerByID(this.app)
        this.containerController.removeContainerByID(this.app)
        this.containerController.getMultiDropByContainers(this.app)
        this.containerController.saveMultiDelivery(this.app)
        this.containerController.saveTheContainer(this.app)
        this.containerController.saveDataImport(this.app);
    }

    /**
     * @controller
     */
    private getPortController() {
        this.portController.getPortList(this.app)
        this.portController.addPort(this.app)
        this.portController.getCountPorts(this.app)
        this.portController.getPortByID(this.app)
        this.portController.getPortListWithSize(this.app)
        this.portController.addPort(this.app)
    }

    /**
     * @controller
     */
    private getDocumentController() {
        this.documentController.addDocuments(this.app)
        this.documentController.getListDocuments(this.app)
        this.documentController.deleteDocument(this.app)

    }

    /**
     * @Controller
     */
    private getBrokerController() {
        this.brokerController.getAllBrokers(this.app)
    }

    /**
     * @Controller
     */
    private getPageController() {
        this.pageController.getAllPages(this.app)
    }


    /**
     * @Controller
     */

    private getDashboardController() {
        this.dasbaordControler.getCountBookingStatusInMonth(this.app)
        this.dasbaordControler.getCountDataInMonth(this.app)
        this.dasbaordControler.getCountMonthlyBooking(this.app)
    }

    private getReportController() {
        this.reportController.getConsoleReport(this.app);
        this.reportController.getEmptyReport(this.app);
    }
}
export default new App().app;
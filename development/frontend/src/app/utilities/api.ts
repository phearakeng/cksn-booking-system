

export class Api {
  //static  Login = Api.url+"/oauth/token"/
  static url  = "http://localhost:8081";

  // uat
  // static url = "http://uatbooking.cksntransport.com:8081"

  // prod
  // static url = "http://booking.cksntransport.com:8081"


  // user
  // get access token ===========================
  static getAccessToken = Api.url + "/oauth/token"
  static Login = Api.url + "/user/login"
  static addUser = Api.url + "/user/addUsers"
  static findUserByID = Api.url + "/user/findUserByID"
  static getListUsers = Api.url + "/user/getListUsers"
  static getCountUsers = Api.url + "/user/getCountUsers"
  static getUserByGroups = Api.url + "/user/getUserByGroups"
  static removeUserByID = Api.url + "/user/removeUserByID"
  static getListUserByPosition = Api.url + "/user/getListUserByPosition"
  static getListUserOperation = Api.url + "/user/getListUserOperation"

  // truck ===========================
  static getListTruckByDriver = Api.url + "/truck/getListTruckByDriver"
  static getAllTruck = Api.url + "/truck/getAllTruck";
  static getAllTrucks = Api.url + "/truck/getAllTrucks";
  static getCountTrucks = Api.url + "/truck/getCountTrucks";
  static saveTruck = Api.url + "/truck/saveTruck";

  // group ===========================
  static getGroupByDepartmentID = Api.url + "/group/getGroupByDepartmentID"
  static getPermissionByGroupID = Api.url + "/group/getPermissionByGroupID"
  static getListGroups = Api.url + "/group/getListGroups"
  static getCountGroups = Api.url + "/group/getCountGroups"
  static addGroup = Api.url + "/group/addGroup"

  static getListDepartments = Api.url + "/department/getListDepartments"
  static getListDepartmentsPagin = Api.url + "/department/getListDepartmentsPagin"
  static getCountDepartments = Api.url + "/department/getCountDepartments"
  static addDepartment = Api.url + "/department/addDepartment"


  // preta ===========================
  static getListCriterial = Api.url + "/predata/getListCriterial"
  static getListPredatas = Api.url + "/predata/getListPredatas"
  static getPredataByCriterial = Api.url + "/predata/getPredataByCriterial"
  static addPreData = Api.url + "/predata/addPreData"
  static getCountPredatas = Api.url + "/predata/getCountPredatas"


  // customer ===========================
  static addCustomers = Api.url + "/Customer/addCustomers"
  static getCountCustomers = Api.url + "/Customer/getCountCustomers"
  static getListCustomers = Api.url + "/Customer/getListCustomers"
  static getCustomerByType = Api.url + "/Customer/getCustomerByType"
  static findCustomerByID = Api.url + "/Customer/findCustomerByID"
  static removeCustomer = Api.url + "/Customer/removeCustomer"

  // business ===========================
  static getAllBusinessPartners = Api.url + "/business/getAllBusinessPartners"
  static getCountBusinessPartner = Api.url + "/business/getCountBusinessPartner"
  static getListBusinessPartner = Api.url + "/business/getListBusinessPartner"
  static getBusinessPartnerByID = Api.url + "/business/getBusinessPartnerByID"
  static saveBusinessPartner = Api.url + "/business/saveBusinessPartner"
  static removeBusinessPartnerByID = Api.url + "/business/removeBusinessPartnerByID"

  // carrier
  static getAllCarriers = Api.url + "/carrier/getAllCarriers"

  //  booking 
  static saveBooking = Api.url + "/booking/saveBooking"
  static getCountBookings = Api.url + "/booking/getCountBookings"
  static getListBookings = Api.url + "/booking/getListBookings"
  static getBookingByID = Api.url + "/booking/getBookingByID"
  static removeBooking = Api.url + "/booking/removeBooking"
  static updateBookingStatus = Api.url + "/booking/updateBookingStatus"
  static getBookingsReport = Api.url + "/booking/getBookingsReport"
  static getBookingByCKSNNo = Api.url + "/booking/getBookingByCKSNNo"
  // static getGenerateCKSNCode =  Api.url+"/booking/getGenerateCKSNCode"

  //port
  static getPortList = Api.url + "/port/getPortList"
  static getPortListWithSize = Api.url + "/port/getPortListWithSize"
  static getPortByID = Api.url + "/port/getPortByID"
  static addPort = Api.url + "/port/addPort"
  static getCountPorts = Api.url + "/port/getCountPorts"

  static addDocuments = Api.url + "/document/addDocuments"
  static getListDocuments = Api.url + "/document/getListDocuments"
  static deleteDocument = Api.url + "/document/deleteDocument"

  // container
  static getListCotainters = Api.url + "/container/getListCotainters"
  static getCountContainers = Api.url + "/container/getCountContainers"
  static saveContainer = Api.url + "/container/saveContainer"
  static getContainerByID = Api.url + "/container/getContainerByID"
  static removeContainerByID = Api.url + "/container/removeContainerByID"
  static getMultiDropByContainers = Api.url + "/container/getMultiDropByContainers"
  static saveMultiDelivery = Api.url + "/container/saveMultiDelivery"
  static saveTheContainer = Api.url + "/container/saveTheContainer"
  static saveDataImport = Api.url + "/container/saveDataImport"

  // broker
  static getAllBrokers = Api.url + "/broker/getAllBrokers";

  // page 
  static getAllPages = Api.url + "/page/getAllPages"

  // page 
  static sendMail = Api.url + "/mail/sendMail"

  // country 
  static getListCountrys = Api.url + "/Country/getListCountrys"

  // dashboard 
  static getCountBookingStatusInMonth = Api.url + "/dashboard/getCountBookingStatusInMonth"
  static getCountDataInMonth = Api.url + "/dashboard/getCountDataInMonth"
  static getCountMonthlyBooking = Api.url + "/dashboard/getCountMonthlyBooking"

  static getEmptyReport = Api.url + "/report/getEmptyReport"
  static getConsoleReport = Api.url + "/report/getConsoleReport"

}

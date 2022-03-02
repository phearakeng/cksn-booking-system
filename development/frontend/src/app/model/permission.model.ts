import { PreData } from "./pre.data";
import { PageModel } from "./page.model";

export class Permission {
    ID: number;
    pageID: number;
    isView: boolean = false;
    isViewAll: boolean = false;
    isAdd: boolean = false;
    isDelete: boolean = false;
    isUpdate: boolean = false;
    status: number;
    created: Date;
    page: PageModel
}
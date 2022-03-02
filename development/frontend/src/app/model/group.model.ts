import { Permission } from './permission.model';
export class GroupModel {
    ID: number;
    group: string;
    status: null;
    created: Date;
    departmentID: number
    groupPermission: Permission[];
}
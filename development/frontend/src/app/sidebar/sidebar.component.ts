import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { SessionManagement } from '../utilities/session_management';
import { UserModel } from '../model/user.model';
import { filter } from 'rxjs/operators';
import { Permission } from '../model/permission.model';
import { MessageBusService, Messages, Channel } from '../services/notification/notification.service';
import { Subscription } from 'rxjs';
import { BookingModel } from '../model/booking.model';

declare const $: any;
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    groupcode: number;
    icontype: string;
    collapse?: string;
    children?: Permission[];
}

export interface ChildrenItems {
    ID: number;
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// ********************|-MENU ITEMS-|******************** //
export const ROUTES: RouteInfo[] = [
    {
        path: '',
        title: 'BOOKING',
        type: 'sub',
        icontype: 'content_paste',
        groupcode: 22,
        collapse: 'bookings',
        children: []
    },
    {
        path: '',
        title: 'CUTOMER',
        type: 'sub',
        groupcode: 23,
        icontype: 'people',
        collapse: 'customer',
        children: []
    },
    {
        path: '',
        title: 'BIZ PARTNER',
        type: 'sub',
        groupcode: 24,
        icontype: 'people',
        collapse: 'business',
        children: []
    },
    {
        path: '',
        title: 'REPORTING',
        type: 'sub',
        groupcode: 27,
        icontype: 'description',
        collapse: 'reporting',
        children: []
    },
    {
        path: '',
        title: 'USER MANAGEMENT',
        type: 'sub',
        groupcode: 25,
        icontype: 'person',
        collapse: 'user',
        children: []
    },
    {
        path: '',
        title: 'SETTING',
        type: 'sub',
        icontype: 'settings',
        collapse: 'settings',
        groupcode: 26,
        children: []
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {


    public menuItems: any[];
    ps: any;
    username: String
    session = new SessionManagement();
    user: UserModel

    constructor(private messageBus: MessageBusService) {

    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.user = this.session.getLoginSession() as UserModel
        if (this.user) {
            this.initSidebarMenu();
        }
        else {
            this.messageBus.getMessage().subscribe(res => {
                try {
                    if (res[0].channel == Channel.login) {
                        this.initSidebarMenu();
                    }
                } catch (error) {
                    console.log(error)
                }

            });
        }
    }

    ngAfterViewInit(): void { }

    // **************|GET USERNAME|************* //
    initSidebarMenu() {
        this.user = this.session.getLoginSession() as UserModel
        this.username = this.user ? this.user.lastName + " " + this.user.firstName : '';
        ROUTES.forEach(ro => {
            ro.children = this.user.group.groupPermission.filter(p => p.page.code == ro.groupcode)
        })
        this.menuItems = ROUTES.filter(menuItem => menuItem.children.length > 0);
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
    }

    ngOnDestroy(): void { }

    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}

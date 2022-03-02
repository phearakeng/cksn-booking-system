import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { SessionManagement } from '../../utilities/session_management';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { UserModel } from '../../model/user.model';
import { JWTHelper } from '../../utilities/jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MessageBusService, Messages, Channel } from '../../services/notification/notification.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { CryptoHelper } from 'src/app/utilities/crypto.helper';
import { StatusCode } from '../../utilities/StatusCode';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    loginFrm: FormGroup;
    userName: any;
    password: any;
    session = new SessionManagement()
    invisbleLoading = true;

    constructor(
        private formBuilder: FormBuilder,
        private element: ElementRef,
        private userService: UserService,
        private messageBus: MessageBusService,
        private router: Router,
        private matSnackbar: MatSnackBar) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.loginFrm = this.formBuilder.group({
            userName: new FormControl(),
            password: new FormControl()
        });
        localStorage.clear();
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        // setTimeout(function() {
        //     // after 1000 ms we add the class animated to the login/register card
        //     card.classList.remove('card-hidden');
        // }, 200);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        body.classList.remove('off-canvas-sidebar');
    }

    onClick_Login() {
        this.invisbleLoading = false;
        let user = { userName: this.userName, password: CryptoHelper.encrypt_req(this.password) } as UserModel
        //   console.log(user)
        this.userService.
            login(user)
            .subscribe(res1 => {
                //    console.log(res1.body)
                if (res1.status == StatusCode.success) {
                    this.session.setAcToken(res1.body[0].access_token)
                    let decoder = new JWTHelper(res1.body[0].access_token);

                    this.session.setUID(decoder.getID())
                    this.userService.findUserByID(this.session.getUID()).subscribe(res => {
                        let resUser = res.body[0] as UserModel
                        let user = new UserModel()
                        user.ID = resUser.ID
                        user.firstName = resUser.firstName
                        user.lastName = resUser.lastName
                        user.group = resUser.group
                        user.group.groupPermission = user.group.groupPermission.filter(res => res.isView == true)
                        user.userName = resUser.userName
                        this.session.setLoginSession(user)
                        //  console.log(user)
                        let message = new Messages();
                        message.channel = Channel.login
                        this.messageBus.sendMessage([message])
                        if (user.group.ID == 3) {
                            this.router.navigate(["/dashboard"])
                        }
                        else {
                            this.router.navigate(["/"])
                        }

                    })
                    this.invisbleLoading = true
                    //this.router.navigate(["/"])
                    //  return res1.access_token;
                }
            },
                error => {
                    //console.log(error)
                    this.matSnackbar.open("Invalid Username/Password", "Failed", {
                        duration: 2000,
                    });
                    this.invisbleLoading = true
                }
            )
    }

}

import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../baseComponent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

  constructor(public router:Router) {
      super(router);
}
  ngOnInit() {
  }

}

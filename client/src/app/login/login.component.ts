import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountsService } from '../accounts.service';

import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private accounts: AccountsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
  
  onSubmit(values) {
    if (!values.email.length) {
      return alert('Please enter an email address');
    }
    const pureEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pureEmail.test(values.email)) {
      return alert('Invalid email');
    }
    if (!values.password.length) {
      return alert('Please enter a password');
    }
    
    let self = this;
    self.accounts.login(values.email, values.password, (isSuccess) => {
      if (isSuccess) {
        self.router.navigate(['/dash']);
      } else {
        alert('Error logging in with given credentials.');
      }
    });
  }
}

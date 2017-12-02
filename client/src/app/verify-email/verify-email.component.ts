import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountsService } from '../accounts.service';


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  status = 'verifying...';

  constructor(private accounts: AccountsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      let token = params['token'];
      this.accounts.verifyEmail(token, isSuccess => {
        if (isSuccess) {
          this.status = 'Successfully verified!<br/><a href="/login">Log in</a>';
        } else {
          this.status = 'Error verifying. Token may have expired or your email is already verified.<br />Please <a href="/login">log in</a> and request another verification email if necessary.';
        };
      });
    });
  }

}

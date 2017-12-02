import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private accounts: AccountsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this;
    this.accounts.logout(function(success) {
      if (success) {
        self.router.navigate(['/']);
      } else {
        alert('Error logging you out.');
      }
    });
  }

}

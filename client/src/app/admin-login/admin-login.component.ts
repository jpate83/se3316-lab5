import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() { // take to dashboard if already verified
    let self = this;
    this.adminService.isAdmin(isAdmin => {
      if (isAdmin) {
        self.router.navigate(['/admin-dash']);
      }
    });
  }

  verifyPassword = ''; // used on submit event
  onVerifyPasswordChange(e) {
    this.verifyPassword = e.target.value;
    if (e.keyCode == 13) {
      this.onVerifySubmit();
    }
  }

  onVerifySubmit() {
    let verifyPassword = this.verifyPassword;
    if (!verifyPassword.length)
      return alert('Please enter a valid password.');
    this.adminService.verifyAdmin(verifyPassword, isVerified => {
      if (!isVerified)
        return alert('Incorrect password.');
      this.router.navigate(['/admin-dash']);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.css']
})
export class AdminDashComponent implements OnInit {
  isAdmin = false;

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() { // leave page if not verified
    let self = this;
    this.adminService.isAdmin(isAdmin => {
      if (!isAdmin) {
        self.router.navigate(['/admin-login']);
      } else {
        self.isAdmin = true;
      }
    });
  }
  
  onLogout() {
   this.adminService.logout(() => this.router.navigate(['/admin-login']));
  }

  onUpdatePolicies(values) {
    if (!this.isAdmin)
      return;
    let securityPolicy = values.securityPolicy.trim();
    let privacyPolicy = values.privacyPolicy.trim();
    let DMCAPolicy = values.DMCAPolicy.trim();
    let infringementContactInfo = values.infringementContactInfo.trim();
    if (!(securityPolicy.length * privacyPolicy.length * DMCAPolicy.length * infringementContactInfo.length)) {
      return alert('Please make sure you\'ve filled out all fields.')
    };
    this.adminService.updatePolicies({
      securityPolicy,
      privacyPolicy,
      DMCAPolicy,
      infringementContactInfo,
    }, isSuccess => {
      if (!isSuccess) {
        alert('Error saving policy updates.');
      } else {
        window.location.reload();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  policies = {
    securityPolicy: 'None set.',
    privacyPolicy: 'None set.',
    DMCAPolicy: 'None set.',
    infringementContactInfo: 'None set.',
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(base + '/policy-info').subscribe(data => {
      let res = data["data"];
      this.policies = res || this.policies;
    });
  }

}

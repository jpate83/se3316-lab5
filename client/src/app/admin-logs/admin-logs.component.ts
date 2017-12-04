import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css']
})
export class AdminLogsComponent implements OnInit {
  isAdmin = false;
  dmcaReports = [];
  dmcaNotices = [];

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    let self = this;
    this.adminService.isAdmin(isAdmin => { // leave page if not verified
      if (!isAdmin) {
        self.router.navigate(['/admin-login']);
      } else {
        self.isAdmin = true;
      }
    });
    this.adminService.getTakedownRequests(resp => {
      self.dmcaReports = resp || [];
    });
    this.adminService.getTakedownNotices(resp => {
      self.dmcaNotices = resp || [];
    });
  }

  
  reportIdNoticeMessageMap = {}; // acts as a hashmap: reportId -> infringement notice message
  onSendTakeDownNoticeMessageChange(e, reportId) {
    if (!this.isAdmin)
      return;
    this.reportIdNoticeMessageMap[reportId] = e.target.value.trim();
  }
  
  onSendTakeDownNoticeSubmit(report) { // reads message from reportIdNoticeMessageMap associated to {@param: report}
    if (!this.isAdmin)
      return;
    let message = this.reportIdNoticeMessageMap[report._id.toString()];
    if (!message.length) {
      return alert('Please enter a message');
    };
    this.adminService.createTakedownNotice(
      report.reportedEntityId.ownerId,
      report.reportedEntityId._id,
      report._id,
      message,
      isSuccess => {
      if (!isSuccess) {
        alert('Error sending takedown notice');
      } else {
        window.location.reload();
      }
    });
  }
  
  onTakeDownContent(collection) { // delete content
    if (!this.isAdmin)
      return;
    this.adminService.disableCollection(collection._id, isSuccess => {
      if (!isSuccess) {
        alert('Error taking down collection.');
      } else {
        window.location.reload();
      }
    })
  }
  
  onRestoreContent(collection) { // restore content
    if (!this.isAdmin)
      return;
    this.adminService.undoDisableCollection(collection._id, isSuccess => {
      if (!isSuccess) {
        alert('Error restoring collection.');
      } else {
        window.location.reload();
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountsService } from '../accounts.service';
import { CollectionsQuerierService } from '../collections-querier.service';
import { UserActionsService } from '../user-actions.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  myCollections = [];
  takedownNotices = [];
  currentUser = {};

  constructor(
    private accounts: AccountsService,
    private collectionsQuerier: CollectionsQuerierService,
    private userActions: UserActionsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (!this.accounts.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.currentUser = this.accounts.currentUser();
    let self = this;
    this.collectionsQuerier.getCollectionsForUser(resp => {
      self.myCollections = resp || [];
    });
    this.collectionsQuerier.getCollectionTakedownNotices(resp => {
      self.takedownNotices = resp || [];
    });
  }
  
  onResendVerification() {
    this.accounts.resendVerificationEmail(success => {
      if(!success) {
        alert('Error resending verification email');
      } else {
        alert('Verification email resent!');
      }
    });
  }
  
  onCreateCollection(values) {
    let name = values.name.trim();
    let description = values.description.trim();
    let isPublic = !!values.isPublic;
    if (!name.length || !description.length) {
      return alert('Please fill out name and description fields');
    }
    this.userActions.createCollection(name, description, isPublic, createdCollection => {
      if (createdCollection) {
        window.location.reload();
      } else {
        alert('Error creating collection.');
      }
    });
  }
  
  
  disputeMessage = '';
  onDisputeMessageChange(e) {
    this.disputeMessage = e.target.value.trim();
  }
  sendDisputeMessage(notice) {
    let disputeMessage = this.disputeMessage;
    if (!disputeMessage.length) {
      return alert('Please enter a message');
    }
    this.userActions.disputeTakedownNotice(notice._id.toString(), disputeMessage, isSuccess => {
      if (!isSuccess) {
        alert('Error sending dispute message.');
      } else {
        alert('Dispute message sent!');
        window.location.reload();
      }
    });
  }

}

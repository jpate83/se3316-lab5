import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountsService } from '../accounts.service';
import { CollectionsQuerierService } from '../collections-querier.service';

@Component({
  selector: 'app-public-feed',
  templateUrl: './public-feed.component.html',
  styleUrls: ['./public-feed.component.css']
})
export class PublicFeedComponent implements OnInit {
  collections = [{
    name: 'Loading...',
  }];

  constructor(
    private accounts: AccountsService,
    private collectionsQuerier: CollectionsQuerierService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (!this.accounts.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    let self = this;
    this.collectionsQuerier.getPublicCollectionsForAuthenticated(resp => {
      self.collections = resp || [];
    });
  }

}

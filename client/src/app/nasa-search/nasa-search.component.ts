import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountsService } from '../accounts.service';
import { CollectionsQuerierService } from '../collections-querier.service';
import { UserActionsService } from '../user-actions.service';
import { NasaApiService } from '../nasa-api.service';

@Component({
  selector: 'app-nasa-search',
  templateUrl: './nasa-search.component.html',
  styleUrls: ['./nasa-search.component.css']
})
export class NasaSearchComponent implements OnInit {
  searchResults = [];
  myCollections = [];
  showModal = false;
  selectedImageUrl = '';
  query = '';
  queryExecuted = false;
  currentPage = 1;
  
  constructor(
    private accounts: AccountsService,
    private collectionsQuerier: CollectionsQuerierService,
    private userActions: UserActionsService,
    private router: Router,
    private route: ActivatedRoute,
    private nasaApi: NasaApiService,
  ) { }

  ngOnInit() {
    if (!this.accounts.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    let self = this;
    this.collectionsQuerier.getCollectionsForUser(resp => {
      self.myCollections = resp || [];
    });
  }
  
  onSearchInputKeyup(e) {
    this.query = e.target.value.trim();
    this.queryExecuted = false;
    this.currentPage = 1;
    if (e.keyCode == 13) {
      this.executeQuery();
    }
  }
  executeQuery() {
    if (!this.query.length)
      return this.searchResults = [];
    this.nasaApi.query(this.query, this.currentPage, resp => {
      this.searchResults = resp.map(item => {
        item.image = item.links[0].href;
        item.title = item.data[0].title;
        return item;
      });
      this.queryExecuted = true;
    });
  }
  prevPage() {
    this.currentPage--;
    this.executeQuery();
  }
  nextPage() {
    this.currentPage++;
    this.executeQuery();
  }
  
  onAddToCollection(item) {
    this.selectedImageUrl = item.image;
    this.showModal = true;
  }

  onSelectCollectionToAddTo(matchedCollection) {
    let self = this;
    let collectionId = matchedCollection._id.toString();
    let selectedImageUrl = self.selectedImageUrl;
    if (!selectedImageUrl.length)
      return alert('Please select an image to add.');
    if (matchedCollection) {
      matchedCollection.images.push(selectedImageUrl);
      self.userActions.updateCollection(collectionId, matchedCollection, resp => {
        if (!resp)
          alert('Error adding image to selected collection.');
        self.selectedImageUrl = '';
        self.showModal = false;
      });
    } else {
      alert('Error processing your selection. Could not find selected collection.');
      self.selectedImageUrl = '';
      self.showModal = false;
    }
  }

  closeModal() {
    this.showModal = false;
  }
}

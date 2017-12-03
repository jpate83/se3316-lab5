import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountsService } from '../accounts.service';
import { CollectionsQuerierService } from '../collections-querier.service';
import { UserActionsService } from '../user-actions.service';

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.css']
})
export class CollectionViewComponent implements OnInit {
  thisCollection = {};
  thisUserOwns = false;
  existingRating = '';
  newRating = 0;
  currentUser = null;
  
  constructor(
    private accounts: AccountsService,
    private collectionsQuerier: CollectionsQuerierService,
    private userActions: UserActionsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.currentUser = this.accounts.currentUser();
    let self = this;
    
    this.route.params.subscribe(params => {
      let collectionId = params['collectionId'];
      self.collectionsQuerier.getCollection(collectionId, resp => {
        self.thisCollection = resp || {};
        
        if (self.thisCollection["ownerId"] && self.accounts.isLoggedIn()) {
          // this user owns collection
          let userId = self.currentUser._id.toString();
          let ownerId = self.thisCollection["ownerId"]._id.toString();
          self.thisUserOwns = userId == ownerId;
          
          // this user rated collection
          let thisRating = self.thisCollection["ratings"].find(el => {
            return el.ownerId.toString() == self.currentUser._id.toString();
          });
          if (thisRating) {
            self.existingRating = thisRating.rating;
          }
        }
      });
    });
  }
  
  
  removeImageFromCollection(url) {
    this.thisCollection["images"].splice(this.thisCollection["images"].indexOf(url), 1);
    this.userActions.updateCollection(this.thisCollection["_id"].toString(), this.thisCollection, isSuccess => {
      if (!isSuccess)
        return alert('Error removing image.');
    });
  }
  
  onUpdateCollection(values) {
    let name = values.name.trim();
    let description = values.description.trim();
    let isPublic = !!values.isPublic;
    if (!name.length || !description.length) {
      return alert('Please fill out name and description fields');
    }
    this.thisCollection["name"] = name;
    this.thisCollection["description"] = description;
    this.thisCollection["isPublic"] = isPublic;
    this.userActions.updateCollection(this.thisCollection["_id"].toString(), this.thisCollection, isSuccess => {
      if (!isSuccess)
        return alert('Error updating collection.');
      window.location.reload();
    });
  }
  
  
  ratingKeyup(e) {
    this.newRating = e.target.value;
  }
  makeRating() {
    let rating = this.newRating;
    if (rating < 1 || rating > 5) {
      return alert('Rating must be between 1 - 5');
    };
    this.userActions.rateCollection(this.thisCollection["_id"].toString(), rating, resp => {
      if (!resp) {
        return alert("Error saving your rating");
      }
      window.location.reload();
    });
  }

}

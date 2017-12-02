import { Component, OnInit } from '@angular/core';
import { CollectionsQuerierService } from '../collections-querier.service';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.css']
})
export class StartpageComponent implements OnInit {
  publicCollections = [];
  constructor(private collectionsQuerier:CollectionsQuerierService) {}

  ngOnInit() {
    this.collectionsQuerier.getTopTenPublic(data => {
      this.publicCollections = data || [];
    });
  }

}

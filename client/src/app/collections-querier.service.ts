import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';

@Injectable()
export class CollectionsQuerierService {

    constructor(private http: HttpClient) { }
    
    getTopTenPublic(callback) {
        this.http.get(base + '/collections/top-ten-public').subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getCollection(collectionId, callback) {
        this.http.get(base + '/api/collection/' + collectionId).subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getCollectionsForUser(callback) {
        this.http.get(base + '/api/collections/this-user').subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getPublicCollectionsForAuthenticated(callback) {
        this.http.get(base + '/api/collections/public').subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getCollectionTakedownNotices(callback) {
        this.http.get(base + '/api/user/takedown-notices').subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
}

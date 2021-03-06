import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AccountsService } from './accounts.service';
import { AdminService } from './admin.service';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';

@Injectable()
export class CollectionsQuerierService {

    constructor(private http: HttpClient, private accounts: AccountsService, private adminService: AdminService) { }
    
    //* NOTE: The below method signatures and parameter names are quite self explanatory of the services *//
    
    getTopTenPublic(callback) {
        this.http.get(base + '/collections/top-ten-public').subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }

    getCollection(collectionId, callback) {
        let params = new HttpParams();
        if(this.adminService.getAdminVerificationCode()) {
            params.set('password', this.adminService.getAdminVerificationCode());
        };
        if (this.accounts.isLoggedIn()) {
            params = params.set('userId', this.accounts.currentUser()._id.toString());
        };

        this.http.get(base + '/collection/' + collectionId, { params }).subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }

    getCollectionsForUser(callback) {
        let params = new HttpParams().set('userId', this.accounts.currentUser()._id.toString());

        this.http.get(base + '/collections/this-user', { params }).subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getPublicCollectionsForAuthenticated(callback) {
        if (!this.accounts.isLoggedIn()) {
            return callback(undefined);
        };

        this.http.get(base + '/collections/public').subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getCollectionTakedownNotices(callback) {
        let params = new HttpParams().set('userId', this.accounts.currentUser()._id.toString());

        this.http.get(base + '/user/takedown-notices', { params }).subscribe(data => {
            callback(data["data"]);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
}

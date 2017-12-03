import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountsService } from './accounts.service';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';

@Injectable()
export class UserActionsService {

    constructor(private http: HttpClient, private accounts: AccountsService) { }
    
    createCollection(name, description, isPublic, callback) {
        this.http.post(base + '/user/create-collection', {
            name,
            description,
            isPublic,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    updateCollection(collectionId, updatedCollection, callback) {
        this.http.post(base + '/user/update-collection', {
            updatedCollection,
            updatedCollectionId: collectionId,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    deleteCollection(collectionId, callback) {
        this.http.post(base + '/user/delete-collection', {
            updatedCollectionId: collectionId,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['success']);
        }, err => {
            console.log(err);
            callback(false);
        });
    }
    
    rateCollection(collectionId, rating, callback) {
        this.http.post(base + '/user/rate-collection', {
            rating,
            collectionId,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }

    reportCollection(collectionId, message, callback) {
        this.http.post(base + '/user/report-collection', {
            reportedEntityId: collectionId,
            message,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }

    readTakedownNotice(noticeId, callback) {
        this.http.post(base + '/user/read-takedown-notice', {
            noticeId,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }

    disputeTakedownNotice(noticeId, message, callback) {
        this.http.post(base + '/user/dispute-takedown-notice', {
            noticeId,
            message,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
}

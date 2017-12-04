import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountsService } from './accounts.service';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';

@Injectable()
export class UserActionsService {

    constructor(private http: HttpClient, private accounts: AccountsService) { }
    
    // create a collection
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
    
    // update a collection's fields
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
    
    // delete a collection
    deleteCollection(collectionId, callback) {
        this.http.post(base + '/user/delete-collection', {
            collectionId,
            user: this.accounts.currentUser(),
        }).subscribe(data => {
            callback(data['success']);
        }, err => {
            console.log(err);
            callback(false);
        });
    }
    
    // rate a collection. update rating if there's already one. disabled if current user is the owner of the collection
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

    // request a takedown of a collection for infringing on copyright
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

    // not used in this app
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

    // dispute an infringement notice
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';

@Injectable()
export class UserActionsService {

    constructor(private http: HttpClient) { }
    
    createCollection(name, description, isPublic, callback) {
        this.http.post(base + '/user/create-collection', {
            name,
            description,
            isPublic,
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    updateCollection(collectionId, updatedCollection, callback) {
        this.http.post(base + '/user/create-collection', {
            updatedCollection,
            updatedCollectionId: collectionId,
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
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
}

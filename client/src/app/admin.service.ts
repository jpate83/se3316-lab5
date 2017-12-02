import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';

@Injectable()
export class AdminService {

    constructor(private http: HttpClient) { }
    
    verifyAdmin(password, callback) {
        this.http.post(base + '/admin/verify', {
            password,
        }).subscribe(data => {
            var verified = data['verified'];
            if (verified) {
                localStorage.setItem('adminVerified', 'true');
            }
            callback(verified);
        }, err => {
            console.log(err);
            callback(false);
        });
    }
    
    updatePolicies(newPolicies, callback) {
        this.http.post(base + '/admin/updatePolicies', newPolicies)
        .subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    createTakedownNotice(toUserId, forCollectionId, message, callback) {
        this.http.post(base + '/admin/create-takedown-notice', {
            to: toUserId,
            for: forCollectionId,
            message,
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    disableCollection(collectionId, message, callback) {
        this.http.post(base + '/admin/disable-collection', {
            collectionId,
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    undoDisableCollection(collectionId, message, callback) {
        this.http.post(base + '/admin/undo-disable-collection', {
            collectionId,
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    
    getTakedownRequests(callback) {
        this.http.get(base + '/admin/takedown-requests').subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getTakedownNotices(callback) {
        this.http.get(base + '/admin/takedown-notices').subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
}

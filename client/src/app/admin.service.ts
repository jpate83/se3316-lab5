import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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
                localStorage.setItem('adminVerified', password);
            }
            callback(verified);
        }, err => {
            console.log(err);
            callback(false);
        });
    }
    
    updatePolicies(newPolicies, callback) {
        let body = { ...newPolicies };
        body.password = localStorage.getItem('adminVerified');
        this.http.post(base + '/admin/updatePolicies', body)
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
            password: localStorage.getItem('adminVerified'),
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
            password: localStorage.getItem('adminVerified'),
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
            password: localStorage.getItem('adminVerified'),
        }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    
    getTakedownRequests(callback) {
        let params = new HttpParams().set('password', localStorage.getItem('adminVerified'));
        
        this.http.get(base + '/admin/takedown-requests', { params }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
    
    getTakedownNotices(callback) {
        let params = new HttpParams().set('password', localStorage.getItem('adminVerified'));
        
        this.http.get(base + '/admin/takedown-notices', { params }).subscribe(data => {
            callback(data['data']);
        }, err => {
            console.log(err);
            callback(undefined);
        });
    }
}

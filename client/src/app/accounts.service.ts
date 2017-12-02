import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base = 'https://lab5-sumkcid.c9users.io:8081/api';


@Injectable()
export class AccountsService {

    constructor(private http: HttpClient) { }

    login(email, password, callback) {
        this.http.post(base + '/login', {
            email,
            password,
        }).subscribe(data => {
            var user = data['data'];
            if (user) {
                localStorage.setItem('user', user);
            };
            callback(user, data["error"]);
        }, err => {
            console.log(err);
            callback(false, err);
        });
    }
    
    isLoggedIn(callback) {
        this.http.get(base + '/isAuthenticated', {}).subscribe(data => {
            var isAuthenticated = data['isAuthenticated'];
            callback(isAuthenticated);
        }, err => {
            console.log(err);
            callback(false);
        });
    }
    
    logout(callback) {
        this.http.post(base + '/logout', {}).subscribe(data => {
            var success = data['success'];
            if (success) {
                localStorage.removeItem('user');
                callback(true);
            } else {
                callback(false);
            };
        }, err => {
            console.log(err);
            callback(false);
        });
        
    }
    
    verifyEmail(token, callback) {
        this.http.post(base + '/verify/'+ token, {}).subscribe(data => {
            var success = data['success'];
            callback(success);
        }, err => {
            console.log(err);
            callback(false);
        });
    }
    
    register(email, name, password, callback) {
        this.http.post(base + '/register', {
            email,
            name,
            password,
        }).subscribe(data => {
            var user = data['user'];
            if (user) {
                localStorage.setItem('user', user);
            }
            callback(user, data["error"]);
        }, err => {
            console.log(err);
            callback(false, err);
        });
    }
}

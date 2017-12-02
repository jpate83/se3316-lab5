import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const base = 'https://images-api.nasa.gov';

@Injectable()
export class NasaApiService {
    queryResults = {}; // cache
    
    constructor(private http: HttpClient) {}
    
    query(q, page, callback) {
        if (this.queryResults[q] && this.queryResults[q][page]) {
            callback(this.queryResults[q][page]);
        } else {
            let params = new HttpParams();
            params = params.set('q', q);
            params = params.set('media_type', 'image');
            params = params.set('page', page);
            this.http.get(base + '/search', { params }).subscribe(data => {
                let resp = data["collection"];
                if (resp)
                    resp = resp["items"];
                this.queryResults[q][page] = resp;
                callback(resp);
            }, err => {
                console.log(err);
                callback(undefined);
            });
        };
    }

}

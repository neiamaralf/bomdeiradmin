import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Config } from "../config";

@Injectable()
export class DbService {
  constructor(private http: HttpClient) {

  }

  put(jsondata) {
    return this.http.put(Config.apiUrl + "put.php", { jsondata }, { headers: this.getCommonHeaders() })
      .map(res => res);
  }

  post(jsondata) {
    return this.http.post(Config.apiUrl + "post.php", { jsondata }, { headers: this.getCommonHeaders() })
      .map(res => res);
  }

  delete(params) {
    return this.http.delete(Config.apiUrl + "delete.php?" + params, { headers: this.getCommonHeaders() })
      .map(res => res);
  }


  get(params) {
    
    return this.http.get(Config.apiUrl + "get.php?" + params, { headers: this.getCommonHeaders() });
  }

  geturl(url) {
    return this.http.get(url, { headers: this.getCommonHeaders() });
  }

  getCommonHeaders() {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return headers;
  }
}

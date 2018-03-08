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
  return this.http.post(Config.apiUrl + "put.php", { jsondata }, { headers: this.getCommonHeaders()  })
  .map(res =>res);
 }

 getCommonHeaders() {
  let headers = new HttpHeaders();
  headers.append("Content-Type", "application/json");
  return headers;
 }
}

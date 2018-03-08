import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import {RouterExtensions} from "nativescript-angular/router";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { User } from "./user";
import { Config } from "../config";
import {
  getBoolean,
  setBoolean,
  getNumber,
  setNumber,
  getString,
  setString,
  hasKey,
  remove,
  clear
} from "application-settings";

@Injectable()
export class UserService {
  constructor(private http: Http,private routerExtensions: RouterExtensions) { }

  register(user:User) {
    return this.http.put(
      Config.apiUrl + "put.php",
      JSON.stringify({
        key: "adduser",
        name: user.email,
        email: user.email,
        password: user.senha
      }),
      { headers: this.getCommonHeaders() }
    )
      .map(response => response.json())
      .do(data => {
        Config.token = data.user.email
      })
      .catch(this.handleErrors);
  }

  login(user: User) {
    return this.http.post(
      Config.apiUrl + "post.php",
      JSON.stringify({
        key: "login",
        email: user.email,
        password: user.senha
      }),
      { headers: this.getCommonHeaders() }
    )
      .map(response => response.json())
      .do(data => {
        Config.token = data.user.token;
        //user=data.user;
        this.saveusr(data.user);
        console.dir(data.user);
        console.log(getString("usr"));
      })
      .catch(this.handleErrors);
  }

  saveusr(user:any){    
    setString("usr", JSON.stringify(user));
   
     // this.loadsusr();
   
  }

  logout(user) {
    this.http.post(Config.apiUrl + "post.php",  { key: 'logout', id: user.id, token: user.token })
    .map(res => res.json())
      .do(res => {
        if (res.status == 'success') {
          remove('usr');     
          this.routerExtensions.navigate(["/"],{clearHistory: true});
        } else {
         
            console.log(res.msg) ;
        }        
      }, err => {
        console.error('ERROR', err);               
      }).subscribe();
   
  }

  verifytoken(user:User){
    if(!hasKey("usr"))return;
    var  usr=JSON.parse(getString("usr"));
    user.id = usr.id;
    user.email = usr.email;
    user.token = usr.token;
    if (user.email != null) {
      this.http.post(
        Config.apiUrl + "post.php",
        JSON.stringify({
          key: 'asserttoken',
          id: user.id,
          token: user.token
        }),
        { headers: this.getCommonHeaders() }
      )
        .map(res => res.json())
        .do(res => {
          if (res.status == 'success') {
            console.dir(res.user);
            //user = res.user;
            //this.saveusr(user);
            this.routerExtensions.navigate(["/settings"],{clearHistory: true});

            console.log(user);
          } else {
            /*let toast = this.toastCtrl.create({
              message: res.msg,
              duration: 3000,
              position: 'top'
            });
            toast.present();*/
            console.log("token ruim");
            this.routerExtensions.navigate(["/"]);
          }
        }, err => {
          console.error('ERROR', err);
        })
        .catch(this.handleErrors).subscribe();
    }
    else {
      this.routerExtensions.navigate(["/"]);
    }
    console.dir(usr);

  }
  


  getCommonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return headers;
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}

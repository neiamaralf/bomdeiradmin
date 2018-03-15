import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { RouterExtensions } from "nativescript-angular/router";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { User } from "./user";
import { DbService } from "../db/db.service";
import { Config } from "../config";
import {
  getString,
  setString,
  hasKey,
  remove,
  clear
} from "application-settings";
import * as platformModule from "tns-core-modules/platform";

@Injectable()
export class UserService {
  constructor(public user: User, private db: DbService, private routerExtensions: RouterExtensions) {
    user.goodtoken = false;
  }

  register(page) {
    return this.db.put({
      key: "adduser",
      email: this.user.email,
      password: this.user.senha
    }
    )
      .subscribe(res => {
        if ((<any>res).status == 'success') {
          Config.token = (<any>res).result.email;
          alert("Sua conta foi criada com sucesso.");
          page.toggleDisplay();
          console.dir(res);
          console.log((<any>res).status);
        }
        else
          alert((<any>res).msg)
      });
  }

  login() {



    return this.db.post({
      key: "login",
      email: this.user.email,
      password: this.user.senha,
      DeviceModel: platformModule.device.model,
      DeviceType: platformModule.device.deviceType,
      OS: platformModule.device.os,
      OSVersion: platformModule.device.osVersion,
      SDKVersion: platformModule.device.sdkVersion
    }
    )
      .subscribe(res => {
        if ((<any>res).status == 'success') {
          Config.token = (<any>res).result.token
          console.dir(res);
          console.log((<any>res).status);
          this.user = (<any>res).result;
          console.log("1");
          this.saveusr(); console.log("2");
          console.log(getString("usr"));
          this.routerExtensions.navigate(["/items"], { clearHistory: true })
        }
        else
          alert((<any>res).msg)
      });
  }

  saveusr() {
    setString("usr", JSON.stringify(this.user));
  }

  logout() {
    this.db.post({ key: 'logout', id: this.user.id, token: this.user.token })
      .subscribe(res => {
        if ((<any>res).status == 'success') {
          remove('usr');
          this.user.goodtoken = false;
          this.routerExtensions.navigate(["/"], { clearHistory: true });
        } else {
          alert((<any>res).result.msg);
        }
      });
  }

  verifytoken(loginpage) {
    if (!hasKey("usr")) return;
    var usr = JSON.parse(getString("usr"));
    console.log("usr");
    console.dir(usr);
    this.user.id = usr.id;
    this.user.email = usr.email;
    this.user.token = usr.token;
    if (this.user.email != null) {
      this.db.post({
        key: 'asserttoken',
        id: this.user.id,
        token: this.user.token
      }
      )
        .subscribe(res => {
          if ((<any>res).status == 'success') {
            console.dir((<any>res).result);
            //user = res.user; 
            //this.saveusr(user);
            this.user.goodtoken = true;
            this.routerExtensions.navigate(["/items"], { clearHistory: true });
            console.dir(this.user);
          } else {
            console.log("token inválido");
            this.routerExtensions.navigate(["/"]);
          }
        });
    }
    else {
      loginpage.goodtoken = false;
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

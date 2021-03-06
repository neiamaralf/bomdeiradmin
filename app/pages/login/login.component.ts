import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UserService } from "../../shared/user/user.service";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import { RouterExtensions } from "nativescript-angular/router";
import * as switchModule from "tns-core-modules/ui/switch";

@Component({
  selector: "my-app",
  templateUrl: "./pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit {
  isLoggingIn = true;
  admin = false;

  @ViewChild("container") container: ElementRef;

  constructor( public userService: UserService, private page: Page) {
    this.verifytoken();
  }

  showadmin() {
    this.admin = !this.admin;
  }


  ngOnInit() {
    this.page.actionBarHidden = true;
    //this.page.backgroundImage = "res://bg_login";
  }

  submit() {
    if (this.isLoggingIn)
      this.userService.login();
    else
      this.userService.register(this);
  }

  verifytoken() {
    this.userService.verifytoken(this);
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    let container = <View>this.container.nativeElement;
    container.animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#601217"),
      duration: 200
    });
  }
}

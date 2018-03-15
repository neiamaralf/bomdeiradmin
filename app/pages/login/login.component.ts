import {Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import {RouterExtensions} from "nativescript-angular/router";

@Component({
  selector: "my-app",
  templateUrl:"./pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
}) 
export class LoginComponent  implements OnInit{
  isLoggingIn = true;
  
  @ViewChild("container") container: ElementRef;

  constructor(private routerExtensions: RouterExtensions,public userService: UserService, private page: Page) {
    console.log("constructor");
    this.verifytoken();
  }

  ngOnInit() {
    console.log("ngOnInit");
    
   this.page.actionBarHidden = true;
   //this.page.backgroundImage = "res://bg_login";
 }

  submit() {
    console.log("email="+this.userService.user.email);
    console.log("pass="+this.userService.user.senha);  
    if (this.isLoggingIn) 
      this.login();
    else
      this.signUp();
  }
  
  login() {
   this.userService.login()
 } 

 verifytoken(){
  this.userService.verifytoken(this);
 }
  
  signUp() {
    this.userService.register(this);
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    let container = <View>this.container.nativeElement;
    container.animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
      duration: 200
    });
  }
}

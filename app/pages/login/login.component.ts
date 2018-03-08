import {Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import { topmost } from "ui/frame";
import {RouterExtensions} from "nativescript-angular/router";

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl:"./pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent  implements OnInit{
  isLoggingIn = true;
  @ViewChild("container") container: ElementRef;

  constructor(public user:User,private routerExtensions: RouterExtensions,private userService: UserService, private page: Page) {
    console.log("constructor");
    this.verifytoken();
  }

  ngOnInit() {
    console.log("ngOnInit");
    
   this.page.actionBarHidden = true;
   //this.page.backgroundImage = "res://bg_login";
 }

  submit() {
    console.log("email="+this.user.email);
    console.log("pass="+this.user.senha);  
    if (this.isLoggingIn) 
      this.login();
    else
      this.signUp();
  }
  
  login() {
   this.userService.login(this.user)
     .subscribe(       
       () => this.routerExtensions.navigate(["/settings"],{
        clearHistory: true}),
       (error) => alert("O email ou a senha estão incorretos! Tente novamente.")
     );     
 } 

 verifytoken(){
  this.userService.verifytoken(this.user);
 }
  
  signUp() {
    this.userService.register(this.user)
      .subscribe(
        () => {
          alert("Sua conta foi criada com sucesso.");
          this.toggleDisplay();
        },
        (error) => alert("Unfortunately we were unable to create your account.")
      );
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

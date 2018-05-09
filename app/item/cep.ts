import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";


@Component({
 selector: "ns-cep",
 moduleId: module.id,
 templateUrl: "./cep.html",
})
export class CepComponent{
 cep: any;

 constructor( private routerExtensions: RouterExtensions) { }

 buscacep(){
  this.routerExtensions.navigate(["/buscacep"], { clearHistory: false });
 }

}
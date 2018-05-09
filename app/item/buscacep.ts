import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";


@Component({
 selector: "ns-buscacep",
 moduleId: module.id,
 templateUrl: "./buscacep.html",
})
export class BuscaCepComponent{
 cep: any;

 constructor( private routerExtensions: RouterExtensions) { }

 buscacep(){
  this.routerExtensions.navigate(["/buscacep"], { clearHistory: false });
 }

}

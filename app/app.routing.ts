import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { SubItemDetailComponent } from "./item/subitem-detail.component";
import { LoginComponent } from "./pages/login/login.component";
import { CepComponent } from "./item/cep";
import { BuscaCepComponent } from "./item/buscacep";
import { LocaisComponent } from "./item/locais";

const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "items", component: ItemsComponent },
    { path: "item/:id", component: ItemDetailComponent },
    { path: "subitem/:id", component: SubItemDetailComponent },
    { path: "cep/:idcategoria/:idadmin", component: CepComponent },
    { path: "buscacep/:idcategoria/:idadmin", component: BuscaCepComponent },
    { path: "locais/:acao/:cep/:logradouro/:bairro/:localidade/:uf/:idcategoria/:idadmin", component: LocaisComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
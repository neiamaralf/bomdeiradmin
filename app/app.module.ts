import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { ItemService } from "./item/item.service";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";
import { SubItemDetailComponent } from "./item/subitem-detail.component";
import { CepComponent } from "./item/cep";
import { EventosComponent } from "./item/eventos";
import { BuscaCepComponent } from "./item/buscacep";
import { LocaisComponent } from "./item/locais";
import { BuscasComponent } from "./item/buscas";

import { LoginComponent } from "./pages/login/login.component";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { User } from "./shared/user/user";
import { UserService } from "./shared/user/user.service";
import { DbService } from "./shared/db/db.service";
import { WebView, LoadEventData } from "ui/web-view";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        AppRoutingModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent,
        SubItemDetailComponent,
        LoginComponent,
        CepComponent,
        EventosComponent,
        BuscaCepComponent,
        LocaisComponent,
        BuscasComponent
    ],
    providers: [
        ItemService,
        DbService,
        User,
        UserService,WebView
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }

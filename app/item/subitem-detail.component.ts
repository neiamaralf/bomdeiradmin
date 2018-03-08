import { Component, OnInit } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";

import { Item } from "./item";
import { ItemService } from "./item.service";

import { DbService } from "../shared/db/db.service";


@Component({
    selector: "ns-subdetails",    
    providers: [DbService],
    moduleId: module.id,
    templateUrl: "./subitem-detail.component.html",
})
export class SubItemDetailComponent implements OnInit {
    item: Item;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private router:Router,
        private db:DbService
    ) { 
        //
    }

    add(){
       // console.dir(this.item );
        this.db
        .put({
            key: "addestilo",
            name: "teste"
          })
        .subscribe(res => {
            console.log("res");
            console.dir(res);
            console.log((<any>res).status);
        });
    }

    onclick(item){
        console.dir(item );
        //this.ngOnInit();
       /* this.router.navigate([
            '/item', this.item.id,this.item.nivel
          ])*/
        //this.item = this.itemService.getItem(item.id,item.nivel);
    }

    ngOnInit(): void {
        var id:number = this.route.snapshot.params["id"];console.log(id);
        this.item = this.itemService.getItem(id);console.dir(this.item );

    }
}

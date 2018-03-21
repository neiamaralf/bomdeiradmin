import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as dialogs from "ui/dialogs";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { DbService } from "../shared/db/db.service";
import { UserService } from "../shared/user/user.service";


@Component({
    selector: "ns-subdetails",
    moduleId: module.id,
    templateUrl: "./subitem-detail.component.html",
})
export class SubItemDetailComponent implements OnInit {
    item: Item;
    isLoading = true;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private router: Router,
        private db: DbService, private userService: UserService
    ) {

    }

    obterlista() {
        this.isLoading = true;
        this.db
            .get("key=" + this.item.key + "&idcategoria=" + this.item.iddono)
            .subscribe(res => {
                console.dir(res);
                console.log((<any>res).status);
                this.item.menu = [];
                if (res != null)
                    (<any>res).forEach(row => {
                        this.item.menu.push({
                            name: row.nome, id: row.id, menu: null,

                        });
                    });

                this.isLoading = false;
            });
    }

    add() {
        console.dir(this.item);
        var title = "INSERIR " + this.item.name;

        dialogs.prompt({
            title: title,
            message: "",
            okButtonText: "Inserir",
            cancelButtonText: "Cancelar",
            defaultText: "",
            inputType: dialogs.inputType.text
        }).then(r => {
            if (r.result) {
                this.db
                    .put({
                        key: "addestilo",
                        name: r.text.toUpperCase(),
                        idcategoria: this.item.iddono
                    })
                    .subscribe(res => {
                        this.item.menu.push({
                            name: (<any>res).result.nome, id: (<any>res).result.id, menu: null,

                        });
                        console.dir(res);
                        console.log((<any>res).status);
                    });
            }
            console.log("Dialog result: " + r.result + ", text: " + r.text);
        });

    }

    delete(item) {

        this.db
            .delete("key=delestilo&id=" + item.id)
            .subscribe(res => {
                console.dir(res);
                console.log((<any>res).status);
                if (res != null) {
                    var index = this.item.menu.indexOf(item, 0);
                    this.item.menu.splice(index, 1);
                }

            });



    }

    onclick(item) {
        console.dir(item);
        dialogs.prompt({
            title: "Editar",
            message: "",
            okButtonText: "Salvar",
            cancelButtonText: "Cancelar",
            neutralButtonText: "Apagar",
            defaultText: item.name,
            inputType: dialogs.inputType.text
        }).then(r => {
            switch (r.result) {
                case true:
                    this.db
                        .put({
                            key: "updateestilo",
                            name: r.text.toUpperCase(),
                            id: item.id
                        })
                        .subscribe(res => {
                            item.name = (<any>res).result.nome;
                        });
                    break;
                case false:
                    break;
                default:
                    this.delete(item);

            }
            console.log("Dialog result: " + r.result + ", text: " + r.text);
        });        
    }

    ngOnInit(): void {
        var id: number = this.route.snapshot.params["id"]; console.log(id);
        this.item = this.itemService.getItem(id); console.dir(this.item);
        this.obterlista();

    }
}

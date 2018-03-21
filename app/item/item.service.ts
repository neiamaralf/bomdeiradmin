import { Injectable } from "@angular/core";
import { Item } from "./item";

import { UserService } from "../shared/user/user.service";

@Injectable()
export class ItemService {
    private items = new Array<Item>(
    );



    constructor(private userService: UserService) {
        console.log("itemservice");
        console.dir(userService.user);
        console.log(userService.user.super);
        this.inititems();
    }

    inititems() {
        this.items=[];
        if (this.userService.user.super == 0) {
            this.items.push(
                {
                    id: 1, name: "SHOWS", menu: new Array<Item>(
                        { id: 6, iddono: 1, key: "getestilos", name: "ESTILO MUSICAL", menu: new Array<Item>() }
                    )
                },
                {
                    id: 2, name: "TEATROS", menu: new Array<Item>(
                        { id: 7, iddono: 2, key: "getestilos", name: "ESTILO TEATRAL", menu: new Array<Item>() }
                    )
                },
                {
                    id: 3, name: "EXPOSIÇÕES", menu: new Array<Item>(
                        { id: 8, iddono: 3, key: "getestilos", name: "ESTILO DE EXPOSIÇÃO", menu: new Array<Item>() }
                    )
                },
                {
                    id: 4, name: "CINEMAS", menu: new Array<Item>(
                        { id: 9, iddono: 4, key: "getestilos", name: "ESTILO DE FILME", menu: new Array<Item>() }
                    )
                },
                {
                    id: 5, name: "REQUISIÇÕES", menu: new Array<Item>(
                        { id: 10, iddono: 5, key: "getrequisicoes", name: "REQUISIÇÕES DE POSTAGENS", menu: new Array<Item>() }
                    )
                });
        }
        else if (this.userService.user.super == 2) {
            this.items.push(
                {
                    id: 1, name: "SHOWS", menu: new Array<Item>(
                        { id: 5, name: "REGIÃO", menu: new Array<Item>() },
                        { id: 6,iddono: 1, key: "getestilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 7, name: "BANDA", menu: new Array<Item>() },
                        { id: 8, name: "LOCAL", menu: new Array<Item>() },
                        { id: 9, name: "DATA", menu: new Array<Item>() }
                    )
                },
                {
                    id: 2, name: "TEATROS", menu: new Array<Item>(
                        { id: 10, name: "REGIÃO", menu: new Array<Item>() },
                        { id: 11,iddono: 2, key: "getestilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 12, name: "GRUPO", menu: new Array<Item>() },
                        { id: 13, name: "TEATRO", menu: new Array<Item>() },
                        { id: 14, name: "DATA", menu: new Array<Item>() }
                    )
                },
                {
                    id: 3, name: "EXPOSIÇÕES", menu: new Array<Item>(
                        { id: 15, name: "REGIÃO", menu: new Array<Item>() },
                        { id: 16,iddono: 3, key: "getestilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 17, name: "ARTISTA", menu: new Array<Item>() },
                        { id: 18, name: "LOCAL", menu: new Array<Item>() },
                        { id: 19, name: "DATA", menu: new Array<Item>() }
                    )
                },
                {
                    id: 4, name: "CINEMAS", menu: new Array<Item>(
                        { id: 20, name: "REGIÃO", menu: new Array<Item>() },
                        { id: 21,iddono: 4, key: "getestilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 22, name: "FILME", menu: new Array<Item>() },
                        { id: 23, name: "CINEMA", menu: new Array<Item>() },
                        { id: 24, name: "DATA", menu: new Array<Item>() }
                    )
                }
            );
        }

    }

    getItems(): Item[] {
        return this.items;
    }

    filterByIdNivel(id): Item {
        var filtered: Item;
        this.items.forEach(function (item) {
            if (item.id == id) { filtered = item; return; }
            else if (item.menu) {
                item.menu.forEach(function (subitem) {
                    if (subitem.id == id) { filtered = subitem; return; }
                })
            }
        });
        return filtered;
    }

    getItem(id: number): Item {
        return this.filterByIdNivel(id);
    }
}

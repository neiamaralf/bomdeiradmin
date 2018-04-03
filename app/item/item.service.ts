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
                        { id: 6, iddono: 1, key: "estilos", name: "ESTILO MUSICAL", menu: new Array<Item>() }
                    )
                },
                {
                    id: 2, name: "TEATROS", menu: new Array<Item>(
                        { id: 7, iddono: 2, key: "estilos", name: "ESTILO TEATRAL", menu: new Array<Item>() }
                    )
                },
                {
                    id: 3, name: "EXPOSIÇÕES", menu: new Array<Item>(
                        { id: 8, iddono: 3, key: "estilos", name: "ESTILO DE EXPOSIÇÃO", menu: new Array<Item>() }
                    )
                },
                {
                    id: 4, name: "CINEMAS", menu: new Array<Item>(
                        { id: 9, iddono: 4, key: "estilos", name: "ESTILO DE FILME", menu: new Array<Item>() }
                    )
                },
                {
                    id: 5, name: "REQUISIÇÕES", menu: new Array<Item>(
                        { id: 10, iddono: 5, key: "getrequisicoes", name: "REQUISIÇÕES DE POSTAGENS", menu: new Array<Item>() }
                    )
                });
        }
        else if (this.userService.user.super == 1) {
            this.items.push(
                {
                    id: 1, name: "SHOWS", menu: new Array<Item>(
                        { id: 6,iddono: 1, key: "artistas", name: "MÚSICOS\\BANDAS", menu: new Array<Item>() },
                        { id: 7,iddono: 1, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 8,iddono: 1, key: "geteventos",name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 2, name: "TEATROS", menu: new Array<Item>(
                        { id: 9,iddono: 2, key: "artistas", name: "GRUPOS TEATRAIS", menu: new Array<Item>() },
                        { id: 10,iddono: 2, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 11,iddono: 2, key: "geteventos",name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 3, name: "EXPOSIÇÕES", menu: new Array<Item>(
                        { id: 12,iddono: 3, key: "artistas", name: "ARTISTAS", menu: new Array<Item>() },
                        { id: 13,iddono: 3, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 14,iddono: 3, key: "geteventos",name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 4, name: "CINEMAS", menu: new Array<Item>(
                        { id: 15,iddono: 3, key: "locais", name: "LOCAIS", menu: new Array<Item>() },
                        { id: 16,iddono: 3, key: "geteventos",name: "EVENTOS", menu: new Array<Item>() }
                    )
                },
                {
                    id: 5, name: "REQUISIÇÕES", menu: new Array<Item>(
                        { id: 17, iddono: 5, key: "getreqpend", name: "REQUISIÇÕES PENDENTES", menu: new Array<Item>() },
                        { id: 18, iddono: 5, key: "getreqaprovadas", name: "REQUISIÇÕES APROVADAS", menu: new Array<Item>() }
                    )
                });
        }
        else if (this.userService.user.super == 2) {
            this.items.push(
                {
                    id: 1, name: "SHOWS", menu: new Array<Item>(
                        { id: 5,iddono: 1, name: "REGIÃO", menu: new Array<Item>() },
                        { id: 6,iddono: 1, key: "estilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 7,iddono: 1, key: "artistas", name: "BANDA", menu: new Array<Item>() },
                        { id: 8,iddono: 1, name: "LOCAL", menu: new Array<Item>() },
                        { id: 9,iddono: 1, name: "DATA", menu: new Array<Item>() }
                    )
                },
                {
                    id: 2, name: "TEATROS", menu: new Array<Item>(
                        { id: 10,iddono: 2, name: "REGIÃO", menu: new Array<Item>() },
                        { id: 11,iddono: 2, key: "estilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 12,iddono: 2, key: "artistas", name: "GRUPO TEATRAL", menu: new Array<Item>() },
                        { id: 13,iddono: 2, name: "TEATRO", menu: new Array<Item>() },
                        { id: 14,iddono: 2, name: "DATA", menu: new Array<Item>() }
                    )
                },
                {
                    id: 3, name: "EXPOSIÇÕES", menu: new Array<Item>(
                        { id: 15,iddono: 3, name: "REGIÃO", menu: new Array<Item>() },
                        { id: 16,iddono: 3, key: "estilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 17,iddono: 3, key: "artistas", name: "ARTISTA", menu: new Array<Item>() },
                        { id: 18,iddono: 3, name: "LOCAL", menu: new Array<Item>() },
                        { id: 19,iddono: 3, name: "DATA", menu: new Array<Item>() }
                    )
                },
                {
                    id: 4, name: "CINEMAS", menu: new Array<Item>(
                        { id: 20,iddono: 4,  name: "REGIÃO", menu: new Array<Item>() },
                        { id: 21,iddono: 4, key: "estilos", name: "ESTILO", menu: new Array<Item>() },
                        { id: 22,iddono: 4,  name: "FILME", menu: new Array<Item>() },
                        { id: 23,iddono: 4,  name: "CINEMA", menu: new Array<Item>() },
                        { id: 24,iddono: 4,  name: "DATA", menu: new Array<Item>() }
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

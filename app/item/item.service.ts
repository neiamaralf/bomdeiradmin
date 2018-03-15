import { Injectable } from "@angular/core";
import { Item } from "./item";

@Injectable()
export class ItemService {
    private items = new Array<Item>(
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
        }
    );

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

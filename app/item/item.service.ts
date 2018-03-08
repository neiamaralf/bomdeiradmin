import { Injectable } from "@angular/core";

import { Item } from "./item";

@Injectable()
export class ItemService {
    private items = new Array<Item>(
        {
            id: 1, nivel: 0, name: "SHOWS", role: "Goalkeeper", menu: new Array<Item>(
                { id: 6, nivel: 1, name: "SHOWS->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 2, nivel: 0, name: "TEATROS", role: "Defender", menu: new Array<Item>(
                { id: 7, nivel: 1, name: "TEATROS->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 3, nivel: 0, name: "EXPOSIÇÕES", role: "Midfielder", menu: new Array<Item>(
                { id: 8, nivel: 1, name: "EXPOSIÇÕES->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 4, nivel: 0, name: "CINEMAS", role: "Midfielder", menu: new Array<Item>(
                { id: 9, nivel: 1, name: "CINEMAS->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 5, nivel: 0, name: "REQUISIÇÕES", role: "Midfielder", menu: new Array<Item>(
                { id: 10, nivel: 1, name: "REQUISIÇÕES DE POSTAGENS", role: "", menu: null }
            )
        }
    );

    getItems(): Item[] {
        return this.items;
    }

    filterByIdNivel(id):Item{
        var filtered:Item;
        this.items.forEach(function (item) {
            if(item.id==id){filtered= item;return;}
            else if(item.menu){
                item.menu.forEach(function (subitem){
                    if(subitem.id==id){filtered= subitem;return;}
                })
            }
          }); 
        
        return filtered;    
    }

    getItem(id: number): Item {
        return this.filterByIdNivel(id);
    }
}

import { Injectable } from "@angular/core";

import { Item } from "./item";

@Injectable()
export class ItemService {
    private items = new Array<Item>(
        {
            id: 1,  name: "SHOWS", role: "Goalkeeper", menu: new Array<Item>(
                { id: 6,  name: "SHOWS->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 2,  name: "TEATROS", role: "Defender", menu: new Array<Item>(
                { id: 7,  name: "TEATROS->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 3,  name: "EXPOSIÇÕES", role: "Midfielder", menu: new Array<Item>(
                { id: 8,  name: "EXPOSIÇÕES->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 4,  name: "CINEMAS", role: "Midfielder", menu: new Array<Item>(
                { id: 9,  name: "CINEMAS->ESTILOS", role: "", menu: null }
            )
        },
        {
            id: 5,  name: "REQUISIÇÕES", role: "Midfielder", menu: new Array<Item>(
                { id: 10,  name: "REQUISIÇÕES DE POSTAGENS", role: "", menu: null }
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

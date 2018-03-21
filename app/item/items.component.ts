import { Component, OnInit } from "@angular/core";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { UserService } from "../shared/user/user.service";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[];
    constructor(private itemService: ItemService, private userService: UserService) {
        console.log("user");
        console.dir(userService.user);
        itemService.inititems();

    }

    logout() {
        this.userService.logout();
    }

    ngOnInit(): void {
        this.items = this.itemService.getItems();
    }
}
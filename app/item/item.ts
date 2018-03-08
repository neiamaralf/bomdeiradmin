export interface Item {
    id: number;
    name: string;
    role: string;
    menu:Array<Item>;
}

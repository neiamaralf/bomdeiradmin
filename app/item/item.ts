export interface Item {
    id: number;
    nivel:number;
    name: string;
    role: string;
    menu:Array<Item>;
}

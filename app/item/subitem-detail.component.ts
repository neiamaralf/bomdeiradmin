import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as dialogs from "ui/dialogs";
import {StackLayout} from "ui/layouts/stack-layout";
import {Button} from "tns-core-modules/ui/button";
import * as observable from "tns-core-modules/data/observable";
import { TextField } from "ui/text-field";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { DbService } from "../shared/db/db.service";
import { UserService } from "../shared/user/user.service";
import {Label} from "tns-core-modules/ui/label";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import { Page, ShownModallyData, NavigatedData } from "tns-core-modules/ui/page";
import { topmost, NavigationEntry } from "tns-core-modules/ui/frame";
import * as listPickerModule from "tns-core-modules/ui/list-picker";
import { getCssFileName, start } from "application";
import { Color } from "color";
import { fromObject } from "data/observable";
import { BindingOptions } from "ui/core/bindable";


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
        private db: DbService,
        private userService: UserService
    ) {

    }

    obterlista() {
        this.isLoading = true;
        this.db
            .get("key=" + this.item.key + "&idcategoria=" + this.item.iddono + "&idadmin=" + this.userService.user.id)
            .subscribe(res => {
                console.dir(res);
                console.log((<any>res).status);
                this.item.menu = [];
                if (res != null)
                    (<any>res).result.forEach(row => {
                        this.item.menu.push({
                            key: (<any>res).key, name: row.nome, id: row.id, menu: null,

                        });
                    });

                this.isLoading = false;
            });
    }

    listaUFs(array){
        this.db
        .get("key=estados")
        .subscribe(res => {
            console.dir(res);
            console.log((<any>res).status);
            this.item.menu = [];
            if (res != null)
                (<any>res).result.forEach(row => {
                    array.push({
                        value: row.id,
                        name: row.nome,
                        uf:row.uf,
                        toString: () => {
                          return row.nome;
                        }

                    });
                });

            this.isLoading = false;
        });
    }

    cepIsOk(cep):any {
       return this.db
        .geturl("https://viacep.com.br/ws/"+cep+"/json/");
        
    }

    add() {
        console.dir(this.item);
        var title = "INSERIR " + this.item.name;
        //this.userService.user.super!=2;
        console.dir(this.userService.user);

        if ((this.userService.user.super == 1)&&(this.item.key=="locais")) {
            const topFrame = topmost();
            const currentPage = topFrame.currentPage;         
            
            let cepPage: Page;
            var curestado:any;
            var __this=this;
            var estados: any[]=[];
            this.listaUFs(estados);
            console.dir(estados);
            const pageFactory = function (): Page {                
                cepPage = new Page();
                cepPage.className="page";
                cepPage.actionBar.title="INSERIR LOCAL";
                cepPage.actionBar.color=new Color("#ffffff");
                cepPage.actionBar.className="page";                
                var stackLayout = new StackLayout();
                var txtcep = new TextField();
                txtcep.text = "";
                txtcep.margin=10;
                txtcep.backgroundColor=new Color("#acacac");
                txtcep.hint = "Digite o CEP (só números)";
                const source = fromObject({
                    cep: ""
                });
                const textFieldBindingOptions: BindingOptions = {
                    sourceProperty: "cep",
                    targetProperty: "text",
                    twoWay: true
                };
                txtcep.bind(textFieldBindingOptions, source);
                txtcep.keyboardType="number";
                txtcep.maxLength=8;
                stackLayout.addChild(txtcep);
                var lbl = new Label();
                lbl.on(Button.tapEvent, function (args: observable.EventData) {
                    let pesqCepPage: Page;
                    const pesqCepFactory = function (): Page {
                        pesqCepPage = new Page();
                        pesqCepPage.actionBar.title="BUSCAR CEP";
                        pesqCepPage.actionBar.color=new Color("#ffffff");
                        pesqCepPage.className="page";
                        pesqCepPage.actionBar.className="page";
                        
                        var stackLayout = new StackLayout();
                       
                        var pickUF = new listPickerModule.ListPicker();
                        pickUF.color=new Color("#ffffff");
                        pickUF.margin=10;
                        pickUF.backgroundColor=new Color("#0c0c0c");
                        pickUF.items = estados;
                        pickUF.on("selectedIndexChange", function (arg) {
                            curestado=(<any>arg.object).items[(<any>arg.object).selectedIndex];
                            console.dir(curestado);
                        });
                        stackLayout.addChild(pickUF);

                        var txtcep = new TextField();
                        txtcep.hint = "Cidade";
                        txtcep.padding=10;
                        txtcep.margin=10;
                        txtcep.backgroundColor=new Color("#acacac");
                        stackLayout.addChild(txtcep);
                        var txtcep = new TextField();
                        txtcep.hint = "Endereço";
                        txtcep.margin=10;
                        txtcep.backgroundColor=new Color("#acacac");
                        stackLayout.addChild(txtcep);
                        var lbl = new Button();
                        lbl.className="btn btn-primary btn-active roundbt";
                        lbl.on(Button.tapEvent, function (args: observable.EventData) {
                            // Do something
                        });
                        
                        lbl.text = "Pesquisar CEP";
                        stackLayout.addChild(lbl);
                        
                        pesqCepPage.content = stackLayout;
                        return pesqCepPage;
                    };
                    
                    const navEntry = {
                        create: pesqCepFactory,
                        animated: false
                    };
                    topFrame.navigate(navEntry);
                });
                lbl.text = "Pesquisar CEP";
                lbl.className="btn btn-primary btn-active roundbt";
                stackLayout.addChild(lbl);
                var lbl = new Label();
                lbl.text = "Continuar";
                lbl.className="btn btn-primary btn-active roundbt";
                lbl.on(Button.tapEvent, function (args: observable.EventData) {
                    __this.cepIsOk(source.get("cep"))
                    .subscribe(res => {     
                        console.dir(<any>res);      
                        const bindlocal = fromObject(<any>res);
                         
                        let cadastroPage: Page;
                        const cadastroFactory = function (): Page {                
                            cadastroPage = new Page();
                            cadastroPage.className="page";
                            cadastroPage.actionBar.title="INSERIR LOCAL";
                            cadastroPage.actionBar.color=new Color("#ffffff");
                            cadastroPage.actionBar.className="page";                
                            var stackLayout = new StackLayout();
                            var txt = new TextField();
                            txt.text = "";
                            txt.margin=10;
                            txt.backgroundColor=new Color("#acacac");      
                            const textFieldBindingOptions: BindingOptions = {
                                sourceProperty: "cep",
                                targetProperty: "text",
                                twoWay: true
                            };     
                            txt.bind(textFieldBindingOptions, bindlocal);
                            txt.keyboardType="number";
                            txt.maxLength=8;
                            stackLayout.addChild(txt); 
                            cadastroPage.content = stackLayout;
                            return cadastroPage;
                        };
                        const navEntry = {
                            create: cadastroFactory,
                            animated: false
                        };
                        topFrame.navigate(navEntry);
                              
                     });
                });
                stackLayout.addChild(lbl);
                
                cepPage.content = stackLayout;
                return cepPage;
            };
            
            const navEntry = {
                create: pageFactory,
                animated: false
            };
            topFrame.navigate(navEntry);
            

        }
        else
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
                            op: 'adicionar',
                            key: this.item.key,
                            name: r.text.toUpperCase(),
                            idcategoria: this.item.iddono,
                            idadmin: this.userService.user.id
                        })
                        .subscribe(res => {
                            this.item.menu.push({
                                key: (<any>res).key, name: (<any>res).result.nome, id: (<any>res).result.id, menu: null,

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
            .delete("key=" + item.key + "&id=" + item.id)
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
                            op: 'atualizar',
                            key: item.key,
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

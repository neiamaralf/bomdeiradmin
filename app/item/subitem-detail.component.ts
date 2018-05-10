import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterExtensions, NativeScriptRouterModule } from "nativescript-angular/router";
import * as dialogs from "ui/dialogs";
import { StackLayout } from "ui/layouts/stack-layout";
import { Button } from "tns-core-modules/ui/button";
import * as observable from "tns-core-modules/data/observable";
import { TextField } from "ui/text-field";
import { Item } from "./item";
import { ItemService } from "./item.service";
import { DbService } from "../shared/db/db.service";
import { UserService } from "../shared/user/user.service";
import { Label } from "tns-core-modules/ui/label";
import * as htmlViewModule from "tns-core-modules/ui/html-view";
import { Page, ShownModallyData, NavigatedData } from "tns-core-modules/ui/page";
import { topmost, NavigationEntry, ViewBase } from "tns-core-modules/ui/frame";
import * as listPickerModule from "tns-core-modules/ui/list-picker";
import { getCssFileName, start } from "application";
import { Color } from "color";
import { fromObject } from "data/observable";
import { BindingOptions } from "ui/core/bindable";
import { ObservableArray } from 'data/observable-array';
import { Observable, EventData } from 'data/observable';

import { ListView } from "ui/list-view"
import { CepComponent } from "./cep"


@Component({
    selector: "ns-subdetails",
    moduleId: module.id,
    templateUrl: "./subitem-detail.component.html",
})
export class SubItemDetailComponent {
    item: Item;
    isLoading = true;


    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private router: Router,
        private routerextensions: RouterExtensions,
        private db: DbService,
        private userService: UserService,
        private page: Page,
        private routerExtensions: RouterExtensions
    ) {
        this.ngOnInit();
        /*this.page.on("navigatingFrom", () => {
            this.ngOnInit();
           });*/
        /* this.page.on("navigatingTo", () => {
          this.ngOnInit();
         });*/

    }

    obterlista() {
        this.isLoading = true;
        this.db
            .get("key=" + this.item.key + "&idcategoria=" + this.item.iddono + "&idadmin=" + this.userService.user.id)
            .subscribe(res => {
                // console.dir(res);
                // console.log((<any>res).status);



                if (res != null) {
                    this.item.menu = [];
                    (<any>res).result.forEach(row => {
                        this.item.menu.push({
                            key: (<any>res).key, name: row.nome, id: row.id, menu: null,

                        });
                    });
                    //this.refresh();
                    console.log("item...");
                    console.dir(this.item);
                }

                this.isLoading = false;
            });
    }

    listaUFs(array) {
        this.db
            .get("key=estados")
            .subscribe(res => {
                console.dir(res);
                console.log((<any>res).status);
                if (res != null)
                    (<any>res).result.forEach(row => {
                        array.push({
                            value: row.id,
                            name: row.nome,
                            uf: row.uf,
                            toString: () => {
                                return row.nome;
                            }

                        });
                    });
                console.dir(array);

                this.isLoading = false;
            });
    }

    cepIsOk(cep): any {
        return this.db
            .geturl("https://viacep.com.br/ws/" + cep + "/json/");
    }

    pesqCEP(UF, Cidade, Logradouro): any {
        return this.db
            .geturl("https://viacep.com.br/ws/" + UF+"/"+Cidade+"/"+Logradouro+"/json/");
    }


    createTxtField(srcprop, kbtype, maxleng, bindoj, enabled, hint) {
        var txt = new TextField();
        txt.marginLeft = 10;
        txt.marginRight = 10;
        txt.marginBottom = 1;
        txt.marginTop = 1;
        txt.backgroundColor = new Color("#ffffff");
        const textFieldBindingOptions: BindingOptions = {
            sourceProperty: srcprop,
            targetProperty: "text",
            twoWay: true
        };
        txt.bind(textFieldBindingOptions, bindoj);
        txt.hint = hint;
        txt.height = 40;
        txt.isEnabled = enabled;
        if (kbtype != "")
            txt.keyboardType = kbtype;
        if (maxleng != -1)
            txt.maxLength = maxleng;
        return txt;
    }

    createLabel(srcprop, bindoj) {
        var txt = new Label();
        const textFieldBindingOptions: BindingOptions = {
            sourceProperty: srcprop,
            targetProperty: "text",
            twoWay: true
        };
        txt.bind(textFieldBindingOptions, bindoj);
        txt.marginLeft = 10;
        txt.marginRight = 10;
        txt.color = new Color("#ffffff");
        return txt;
    }

    add() {
        console.dir(this.item);
        var title = "INSERIR " + this.item.name;
        console.dir(this.userService.user);
        if ((this.userService.user.super == 1) && (this.item.key == "locais")) {
            const topFrame = topmost();
            const currentPage = topFrame.currentPage;
            let cepPage: Page;
            var curestado: any;
            var __this = this;
            var estados: any[] = [];
            this.listaUFs(estados);
            const pageFactory = function (): Page {
                cepPage = new Page();
                cepPage.className = "page";
                cepPage.actionBar.title = "INSERIR LOCAL";
                cepPage.actionBar.color = new Color("#ffffff");
                cepPage.actionBar.className = "page";
                var stackLayout = new StackLayout();
                const source = fromObject({
                    cep: ""
                });
                stackLayout.addChild(__this.createTxtField("cep", "number", 8, source, true, "Digite o CEP (só números)"));
                var lbl = new Label();
                lbl.on(Button.tapEvent, function (args: observable.EventData) {
                    let pesqCepPage: Page;
                    const pesqCepFactory = function (): Page {
                        pesqCepPage = new Page();
                        pesqCepPage.actionBar.title = "BUSCAR CEP";
                        pesqCepPage.actionBar.color = new Color("#ffffff");
                        pesqCepPage.className = "page";
                        pesqCepPage.actionBar.className = "page";

                        var stackLayout = new StackLayout();

                        var pickUF = new listPickerModule.ListPicker();
                        pickUF.color = new Color("#ffffff");
                        pickUF.margin = 10;
                        pickUF.height=80;
                        pickUF.backgroundColor = new Color("#0c0c0c");
                        pickUF.items = estados;
                        pickUF.selectedIndex=15;
                        curestado = estados[pickUF.selectedIndex];
                        pickUF.on("selectedIndexChange", function (arg) {
                            curestado = (<any>arg.object).items[(<any>arg.object).selectedIndex];
                            console.dir(curestado);
                        });
                        stackLayout.addChild(pickUF);

                        const cepsearch = fromObject({
                            cidade: "",
                            endereco: ""
                        });
                        var txt:TextField=__this.createTxtField("cidade", "", -1, cepsearch, true, "Cidade");
                        pickUF.on("loaded", function (arg) {
                            setTimeout(() => {
                                txt.focus(); // Shows the soft input method, ususally a soft keyboard.
                            }, 100);
                        });
                        stackLayout.addChild(txt);
                        stackLayout.addChild(__this.createTxtField("endereco", "", -1, cepsearch, true, "Endereço"));
                        var lbl = new Label();
                        lbl.className = "btn btn-primary btn-active roundbt";
                        var cepres:any;
                        lbl.on(Button.tapEvent, function (args: observable.EventData) {
                            console.dir(curestado);
                            console.log(cepsearch.get("cidade"));
                            console.log(cepsearch.get("endereco"));
                            __this.pesqCEP(curestado.uf,cepsearch.get("cidade"),cepsearch.get("endereco"))
                            .subscribe(res => {
                                console.dir(<any>res);
                                cepres=<any>res;
                                

                            });
                           
                        });

                        lbl.text = "Pesquisar CEP";
                        stackLayout.addChild(lbl);

                        let viewModel = new ObservableArray(cepres);
                      

                        var lv=new ListView();
                      //  lv.bindingContext=viewModel;
                        lv.items=cepres;
                      //  lv.itemTemplate = "<StackLayout><Label text='{{ logradouro }}' /></StackLayout>"
                      lv.itemTemplate='\
                           <ng-template let-item="item">\
                                   <label [text]="item.logradouro" />\
                           </ng-template>';
                             
                           
                        stackLayout.addChild(lv);

                        pesqCepPage.content = stackLayout;
                        return pesqCepPage;
                    };

                    const navEntry = {
                        create: pesqCepFactory,
                        animated: false
                    };

                    __this.router.navigate(["/buscacep"]);
                    //topFrame.navigate(navEntry);
                });
                lbl.text = "Pesquisar CEP";
                lbl.className = "btn btn-primary btn-active roundbt";
                stackLayout.addChild(lbl);
                var lbl = new Label();
                lbl.text = "Continuar";
                lbl.className = "btn btn-primary btn-active roundbt";
                lbl.on(Button.tapEvent, function (args: observable.EventData) {
                    __this.cepIsOk(source.get("cep"))
                        .subscribe(res => {
                            console.dir(<any>res);
                            const bindlocal = fromObject(<any>res);
                            let cadastroPage: Page;
                            const cadastroFactory = function (): Page {
                                cadastroPage = new Page();
                                cadastroPage.className = "page";
                                cadastroPage.actionBar.title = "INSERIR LOCAL";
                                cadastroPage.actionBar.color = new Color("#ffffff");
                                cadastroPage.actionBar.className = "page";
                                var stackLayout = new StackLayout();
                                const binddescnum = fromObject({
                                    nome: "",
                                    numero: "",
                                    fone: '',
                                    email: '',
                                    site: ''
                                });
                                stackLayout.addChild(__this.createTxtField("nome", "", -1, binddescnum, true, "descrição"));
                                stackLayout.addChild(__this.createTxtField("numero", "", -1, binddescnum, true, "número"));
                                stackLayout.addChild(__this.createTxtField("complemento", "", -1, bindlocal, true, "complemento"));
                                stackLayout.addChild(__this.createTxtField("fone", "phone", -1, binddescnum, true, "fone"));
                                stackLayout.addChild(__this.createTxtField("email", "email", -1, binddescnum, true, "email"));
                                stackLayout.addChild(__this.createTxtField("site", "url", -1, bindlocal, true, "site"));

                                stackLayout.addChild(__this.createLabel("cep", bindlocal));
                                stackLayout.addChild(__this.createLabel("logradouro", bindlocal));
                                stackLayout.addChild(__this.createLabel("bairro", bindlocal));
                                stackLayout.addChild(__this.createLabel("localidade", bindlocal));
                                stackLayout.addChild(__this.createLabel("uf", bindlocal));
                                var lbl = new Button();
                                lbl.className = "btn btn-primary btn-active roundbt";
                                lbl.on(Button.tapEvent, function (args: observable.EventData) {   
                                    __this.db
                                        .put({
                                            op: 'adicionar',
                                            key: 'locais',
                                            nome: binddescnum.get("nome"),
                                            numero: binddescnum.get("numero"),
                                            fone: binddescnum.get("fone"),
                                            email: binddescnum.get("email"),
                                            site: binddescnum.get("site"),
                                            complemento: bindlocal.get("complemento"),
                                            cep: bindlocal.get("cep"),
                                            logradouro: bindlocal.get("logradouro"),
                                            bairro: bindlocal.get("bairro"),
                                            localidade: bindlocal.get("localidade"),
                                            uf: bindlocal.get("uf"),
                                            idcategoria: __this.item.iddono,
                                            idadmin: __this.userService.user.id
                                        })
                                        .subscribe(res => {
                                            topFrame.goBack();
                                            topFrame.goBack();
                                            __this.item.menu.push({
                                                key: (<any>res).key, name: (<any>res).result.nome, id: (<any>res).result.id, menu: null,
                                            });
                                            __this.item.menu.sort(function (a, b) {
                                                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                                                if (nameA < nameB)
                                                    return -1
                                                if (nameA > nameB)
                                                    return 1
                                                return 0
                                            });
                                            console.dir(res);
                                            console.log((<any>res).status);
                                        });
                                });
                                lbl.text = "Inserir local";
                                stackLayout.addChild(lbl);
                                cadastroPage.content = stackLayout;
                                return cadastroPage;
                            };
                            const navEntry = {
                                create: cadastroFactory,
                                animated: false
                            };
                            topFrame.navigate(navEntry);
                            //this.ngOnInit();

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
            __this.router.navigate(["/cep/"+this.item.iddono+"/"+this.userService.user.id]);
            //topFrame.navigate(navEntry);

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

    public refresh() {


        //do something
        var listview: ListView = <ListView>this.page.getViewById("lvId");
        listview.refresh();
    }

    ngOnInit(): void {
        console.log("ngOnInit");
        var id: number = this.route.snapshot.params["id"]; console.log(id);
        this.item = this.itemService.getItem(id); console.dir(this.item);
        this.obterlista();


    }
}

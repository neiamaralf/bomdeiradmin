import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DbService } from "../shared/db/db.service";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { StackLayout } from "ui/layouts/stack-layout";
import { Page } from "tns-core-modules/ui/page";
import { Color } from "color";
import { fromObject } from "data/observable";
import { TextField } from "ui/text-field";
import { ActivatedRoute } from "@angular/router";


@Component({
  moduleId: module.id,
  templateUrl: "./eventos.html",
})
export class EventosComponent implements OnInit {
  cep: any;
  public artistas: any[];
  public estilos: any[];
  public locais: any[];
  curartista: any;
  curestilo: any;
  curlocal: any;
  isLoading: boolean = true;
  cepres: any;
  evento = fromObject({
    titulo: "",
    descricao: ""
  });

  params = fromObject({
    itemid: 0,
    idcategoria: "",
    idadmin: ""
  });


  constructor(
    private routerExtensions: RouterExtensions,
    private db: DbService,
    private route: ActivatedRoute,
    private page: Page) {
    this.artistas = [];
    this.estilos = [];
    this.locais = [];
  }

  ngOnInit() {
   this.params.set("acao", this.route.snapshot.params["acao"]);
    this.params.set("itemid", this.route.snapshot.params["itemid"]);
    this.params.set("idcategoria", this.route.snapshot.params["idcategoria"]);
    this.params.set("idadmin", this.route.snapshot.params["idadmin"]);
    this.loadlist(this.artistas,"artistas");
    this.loadlist(this.estilos,"estilos");
    this.loadlist(this.locais,"locais");
    var txt: TextField = <TextField>this.page.getViewById("titulo");
    setTimeout(() => {
      txt.focus(); // Shows the soft input method, ususally a soft keyboard.
    }, 100);
  }

  selectedIndexChanged(arg) {
   switch((<any>arg.object).id){
    case "artistas":
    this.curartista = (<any>arg.object).items[(<any>arg.object).selectedIndex];
    console.dir(this.curartista);
    break;
    case "estilos":
    this.curestilo = (<any>arg.object).items[(<any>arg.object).selectedIndex];
    console.dir(this.curestilo);
    break;
    case "artistas":
    this.curlocal = (<any>arg.object).items[(<any>arg.object).selectedIndex];
    console.dir(this.curlocal);
    break;
   }
    
  }

  loadlist(array,key) {
    this.db
      .get("key="+key+ "&idcategoria=" + this.params.get("idcategoria") + "&idadmin=" + this.params.get("idadmin") )
      .subscribe(res => {
        if (res != null) {
          (<any>res).result.forEach(row => {
            let nome = row.nome;
            array.push({
              id: row.id,
              nome: row.nome,
              uf: row.uf,
              toString: () => { return nome; },
            })
          });
          var pickUF: ListPicker = <ListPicker>this.page.getViewById(key);
          pickUF.items = array;
          pickUF.selectedIndex = 0;
          switch(key){
           case "artistas":
           this.curartista = pickUF.items[pickUF.selectedIndex];
           console.dir(this.curartista);
           break;
           case "estilos":
           this.curestilo = pickUF.items[pickUF.selectedIndex];
           console.dir(this.curestilo);
           break;
           case "artistas":
           this.curlocal = pickUF.items[pickUF.selectedIndex];
           console.dir(this.curlocal);
           break;
          }
         
          console.dir(array);
        }
        this.isLoading = false;
      });
  }
  
  onclick(item) {
    console.dir(item);
    this.routerExtensions.navigate(["/locais/" + this.params.get("itemid") + "/" + "inserir/" + item.cep + "/" + item.logradouro + "/" + item.bairro + "/" + item.localidade + "/" + item.uf + "/" + this.params.get("idcategoria") + "/" + this.params.get("idadmin")], { clearHistory: false });

  }

}

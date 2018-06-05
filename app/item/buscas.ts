import { Component, OnInit,ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DbService } from "../shared/db/db.service";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { StackLayout } from "ui/layouts/stack-layout";
import { Page } from "tns-core-modules/ui/page";
import { Color } from "color";
import { fromObject } from "data/observable";
import { TextField } from "ui/text-field";
import { ActivatedRoute } from "@angular/router";
import { TimePicker } from "ui/time-picker";
import { DatePicker } from "ui/date-picker";
import { ObservableArray } from "data/observable-array";
import { Observable } from "data/observable";
import { SearchBar } from "ui/search-bar";
import { ItemService } from "./item.service";
import { Item } from "./item";
import * as utils from "utils/utils";
import { WebView, LoadEventData } from "ui/web-view";


@Component({
  moduleId: module.id,
  templateUrl: "./buscas.html",
})
export class BuscasComponent implements OnInit {
  public artistas: any[];
  titulo: string = "ESTADO"
  public cidades: any[];
  public locais: any[];
  public estados: any[];
  public bairros: any[];
  public eventos: any[];
  pagenumber: number = 0;
  curartista: any;
  curcidade: any;
  curlocal: any;
  curestado: any;
  curbairro: any;
  curevento: any;
  isLoading: boolean = true;  
  showwebview:boolean=false;

  params = fromObject({
    itemid: 0,
    idcategoria: "",
    idadmin: ""
  });

  item: Item;
  @ViewChild("myWebView") webViewRef: ElementRef;

  constructor(
    private itemService: ItemService,
    private routerExtensions: RouterExtensions,
    private db: DbService,
    private route: ActivatedRoute,
    private page: Page,
  private webview: WebView) {
   
    this.artistas = [];
    this.cidades = [];
    this.locais = [];
    this.estados = [];
    this.bairros = [];
    this.eventos = [];
  }



  ngOnInit() {
    this.webview=this.webViewRef.nativeElement;
    this.webview.on(WebView.loadFinishedEvent, function (args: LoadEventData) {
      let message;
      if (!args.error) {
          message = "WebView finished loading of " + args.url;
      } else {
          message = "Error loading " + args.url + ": " + args.error;
      }

      //label.text = message;
      console.log("WebView message - " + message);
  });
    this.params.set("key", this.route.snapshot.params["key"]);
    var itemid = this.route.snapshot.params["itemid"];
    this.params.set("itemid", itemid);
    this.item = this.itemService.getItem(itemid);
    this.params.set("idcategoria", this.route.snapshot.params["idcategoria"]);
    this.params.set("idadmin", this.route.snapshot.params["idadmin"]);
    this.loadlist(this.artistas, "artistas");
    this.loadlist(this.estados, "estadosevt");
  }

  updateLstPickCurrent(lstpck) {
    switch (lstpck.id) {
      case "estadosevt":
        this.curestado = lstpck.items[lstpck.selectedIndex];
        console.dir(this.curestado);
        break;
      case "artistas":
        this.curartista = lstpck.items[lstpck.selectedIndex];
        console.dir(this.curartista);
        break;
      case "cidadesevt":
        this.curcidade = lstpck.items[lstpck.selectedIndex];
        console.dir(this.curcidade);
        break;
      case "locais":
        this.curlocal = lstpck.items[lstpck.selectedIndex];
        console.dir(this.curlocal);
        break;
      case "bairrosevt":
        this.curbairro = lstpck.items[lstpck.selectedIndex];
        console.dir(this.curbairro);
        break;
    }
  }

  selectedIndexChanged(arg) {
    this.updateLstPickCurrent(<any>arg.object);
  }

  public onSubmit(args) {

  }

  filterlistpicker(array, lstpickid, text) {
    var items = [];
    array.forEach(row => {
      var n = row.row.nome.toLowerCase().search(text.toLowerCase());
      if (n === 0)
        items.push(row);
    });
    var lstpick: ListPicker = <ListPicker>this.page.getViewById(lstpickid);

    lstpick.items = items;
    this.updateLstPickCurrent(lstpick);
  }

  searchPhrase = "";
  Searchhint = "Digite o estado";

  public onTextChanged(args) {
    let searchBar = <SearchBar>args.object;
    switch (this.pagenumber) {
      case 0:
        this.filterlistpicker(this.estados, "estadosevt", searchBar.text);
        break;
      case 1:
        this.filterlistpicker(this.cidades, "cidadesevt", searchBar.text);
        console.dir(this.curcidade);
        break;
      case 2:
        this.filterlistpicker(this.bairros, "bairrosevt", searchBar.text);
        break;
    }

    console.log("SearchBar text changed! New value: " + searchBar.text);

  }

  loadlist(array, key) {
    this.db
      .get("key=" + key +
        "&idcategoria=" + this.params.get("idcategoria") +
        "&idadmin=" + this.params.get("idadmin") +
        "&uf=" + (this.curestado == undefined ? "" : this.curestado.row.uf) +
        "&cidade=" + (this.curcidade == undefined ? "" : this.curcidade.row.id)+
        "&bairro=" + (this.curbairro == undefined ? "" : this.curbairro.row.nome))
      .subscribe(res => {
        if (res != null) {
          (<any>res).result.forEach(row => {
            array.push({
              row,
              toString: () => { return row.nome; },
            })
          });
          var pickUF: ListPicker = <ListPicker>this.page.getViewById(key);
          pickUF.items = array;
          pickUF.selectedIndex = 0;
          this.updateLstPickCurrent(pickUF);
          // console.dir(array);
        }
        this.isLoading = false;
      });
  }

  onclick() {
    this.pagenumber++;
    switch (this.pagenumber) {
      case 1:
        this.Searchhint = "Digite a cidade";
        this.titulo = "CIDADE";
        this.loadlist(this.cidades, "cidadesevt");
        break;
      case 2:
        this.Searchhint = "Digite o bairro";
        this.titulo = "BAIRRO"
        this.loadlist(this.bairros, "bairrosevt");
        break;
      case 3:
        this.titulo = "EVENTOS";
        this.loadlist(this.eventos, "eventosregiao");
        break;
      case 5:
        this.titulo = "DADOS DO EVENTO";
        var txt: TextField = <TextField>this.page.getViewById("titulo");
        setTimeout(() => {
          txt.focus();
        }, 100);
        break;

      case 4:
        this.titulo = "HORÁRIO"
        break;
    }
    this.searchPhrase = "";
  }

  goBack() {
    if (this.webview.canGoBack) {
      this.webview.goBack();
    }
    this.webview.src="";
    this.showwebview=false;
}

  abresite(){
    this.webview.src=this.curevento.row.site;
    this.showwebview=true;
  }

  eventoclick(item) {
    this.curevento = item;
    var t = this.curevento.row.datahorario.split(/[- :]/);
    var data = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    var diames=data.getUTCDate()<10?"0"+data.getUTCDate():data.getUTCDate();
    var mes=data.getUTCMonth()<9?"0"+(data.getUTCMonth() + 1):(data.getUTCMonth() + 1);
    var hora=data.getUTCHours()<10?"0"+data.getUTCHours():data.getUTCHours();
    var minutos=data.getUTCMinutes()<10?"0"+data.getUTCMinutes():data.getUTCMinutes();
    this.curevento.row.data = diames + "\\" + mes + "\\" + data.getUTCFullYear() + " - " + semana[data.getDay()];
    this.curevento.row.time=hora+":"+minutos;
    console.dir(this.curevento);

    console.dir(data);
    
  }
 
  onPickerLoaded(args) {
    let datePicker = <DatePicker>args.object;
    datePicker.minDate = new Date(Date.now());
    datePicker.maxDate = new Date(2045, 4, 12);
    this.date = datePicker.date.toISOString().slice(0, 10);
  }

  onDateChanged(args) {
    let datePicker = <DatePicker>args.object;
    this.date = datePicker.date.toISOString().slice(0, 10);
    console.log(this.date);
  }


  onDTPickerLoaded(args) {
    let timePicker = <TimePicker>args.object;
    timePicker.hour = 20;
    timePicker.minute = 0;
  }

  time: string = "20:00:00";
  date: String = "";

  onTimeChanged(args) {
    let timePicker = <TimePicker>args.object;
    this.time = timePicker.time.toTimeString().slice(0, 8);
    console.log(this.time);
  }

}

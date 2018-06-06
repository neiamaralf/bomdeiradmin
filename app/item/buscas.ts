import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
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
import * as mapsModule from "nativescript-google-maps-sdk";
import * as application from "application";
import * as permissions from "nativescript-permissions";


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
  showwebview: boolean = false;
  showmap: boolean = false;

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
  ) {

    this.artistas = [];
    this.cidades = [];
    this.locais = [];
    this.estados = [];
    this.bairros = [];
    this.eventos = [];
  }



  ngOnInit() {
    let webview: WebView = this.webViewRef.nativeElement;
    webview.on(WebView.loadFinishedEvent, function (args: LoadEventData) {
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
        "&cidade=" + (this.curcidade == undefined ? "" : this.curcidade.row.id) +
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
    let webview: WebView = this.webViewRef.nativeElement;
    if (webview.canGoBack) {
      webview.goBack();
    }
    webview.src = "";
    this.showwebview = false;
  }
  public mapView = null;

  abremapa(){
    this.showmap = true;
  }

  abresite() {
    let webview: WebView = this.webViewRef.nativeElement;
    webview.src = this.curevento.row.site;
    this.showwebview = true;
  }

  eventoclick(item) {
    this.curevento = item;
    var t = this.curevento.row.datahorario.split(/[- :]/);
    var data = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    var diames = data.getUTCDate() < 10 ? "0" + data.getUTCDate() : data.getUTCDate();
    var mes = data.getUTCMonth() < 9 ? "0" + (data.getUTCMonth() + 1) : (data.getUTCMonth() + 1);
    var hora = data.getUTCHours() < 10 ? "0" + data.getUTCHours() : data.getUTCHours();
    var minutos = data.getUTCMinutes() < 10 ? "0" + data.getUTCMinutes() : data.getUTCMinutes();
    this.curevento.row.data = diames + "\\" + mes + "\\" + data.getUTCFullYear() + " - " + semana[data.getDay()];
    this.curevento.row.time = hora + ":" + minutos;
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

  printUISettings(settings) {
    console.log("Current UI setting:\n" + JSON.stringify({
                  compassEnabled: settings.compassEnabled,
                  indoorLevelPickerEnabled: settings.indoorLevelPickerEnabled,
                  mapToolbarEnabled: settings.mapToolbarEnabled,
                  myLocationButtonEnabled: settings.myLocationButtonEnabled,
                  rotateGesturesEnabled: settings.rotateGesturesEnabled,
                  scrollGesturesEnabled: settings.scrollGesturesEnabled,
                  tiltGesturesEnabled: settings.tiltGesturesEnabled,
                  zoomControlsEnabled: settings.zoomControlsEnabled,
                  zoomGesturesEnabled: settings.zoomGesturesEnabled
    }, undefined, 2));
  }

  requestPermissions() {
    return new Promise(function(resolve, reject) {
      if (!application.android) return resolve(true);
      permissions.requestPermission([
            application.android.context.Manifest.permission.ACCESS_FINE_LOCATION,
            application.android.context.Manifest.permission.ACCESS_COARSE_LOCATION],
          "This demo will stink without these...")
          .then(function (result) {
            console.log("Permissions granted!");
            resolve(true);
          })
          .catch(function (result) {
            console.log("Permissions failed :(", result);
            resolve(false);
          });
  
    });
  }

  mapparams = fromObject({
    latitude: -33.86,
    longitude: 151.20,
    zoom: 8,
    minZoom: 0,
    maxZoom: 22,
    bearing: 180,
    tilt: 35,
    padding: [80, 40, 40, 40],
    mapAnimationsEnabled: true
  });

  wait(){
    setTimeout(() => {return true;
  }, 1000);
  }


  onMapReady(args) {
    this.mapView = args.object;

    console.log("onMapReady");
    this.mapView.settings.compassEnabled = true;
    this.printUISettings(this.mapView.settings);


    console.log("Setting a marker...");
    var marker = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(-33.86, 151.20);
    marker.title = "Sydney";
    marker.snippet = "Australia";
    marker.color = "green";
    marker.userData = {index: 1};
    this.mapView.addMarker(marker);

    var circle = new mapsModule.Circle();
    circle.center = mapsModule.Position.positionFromLatLng(-33.42, 151.32);
    circle.visible = true;
    circle.radius = 5000;
    circle.fillColor = new Color('#99ff8800');
    circle.strokeColor = new Color('#99ff0000');
    circle.strokeWidth = 2;
    this.mapView.addCircle(circle);

    var polyline = new mapsModule.Polyline();
    var point = mapsModule.Position.positionFromLatLng(-32.89, 151.44);
    polyline.addPoints([
        mapsModule.Position.positionFromLatLng(-33.86, 151.20),
        point,
        mapsModule.Position.positionFromLatLng(-33.42, 151.32)
    ]);
    polyline.visible = true;
    polyline.width = 8;
    polyline.color = new Color('#DD00b3fd');
    polyline.geodesic = true;
    this.mapView.addPolyline(polyline);

    var polygon = new mapsModule.Polygon();
    polygon.addPoints([
        mapsModule.Position.positionFromLatLng(-33.86, 151.20),
        mapsModule.Position.positionFromLatLng(-33.89, 151.40),
        mapsModule.Position.positionFromLatLng(-34.22, 151.32)
    ]);
    polygon.visible = true;
    polygon.fillColor = new Color('#9970d0a0');
    polygon.strokeColor = new Color('#9900d0a0');
    polygon.strokeWidth = 5;
    this.mapView.addPolygon(polygon);

    marker = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(-33.42, 151.32);
    marker.title = "Gosford";
    marker.snippet = "Australia";
    // var icon = new Image();
    // icon.imageSource = imageSource.fromResource('icon');
    // marker.icon = icon;
    marker.icon = 'icon';
    marker.alpha = 0.6;
    marker.flat = true;
    marker.anchor = [0.5, 0.5];
    marker.draggable = true;
    marker.visible = false;
    marker.userData = {index: 2};
    this.mapView.addMarker(marker);

    // Custom Info Window Marker
    marker = new mapsModule.Marker();
    marker.position = mapsModule.Position.positionFromLatLng(-33.22, 151.20);
    marker.infoWindowTemplate = 'testWindow';
    this.mapView.addMarker(marker);
    marker.showInfoWindow();

    this.requestPermissions().then(function(granted) {
        if(granted) {
            console.log("Enabling My Location..");
            this.mapView.myLocationEnabled = true;
            this.mapView.settings.myLocationButtonEnabled = true;
        }
        return this.wait(6000);
    }).then(function () {
        marker.hideInfoWindow();
        marker = this.mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        console.log("Moving marker...", marker.userData);
        marker.position = mapsModule.Position.positionFromLatLng(-33.33, 151.08);
        marker.rotation = 45;
        console.log("Removing Point from polyline...", polyline, point);
        polyline.removePoint(point);
        return this.wait(3000);
    }).then(function () {
        this.mapparams.mapAnimationsEnabled=false;
        this.mapparams.zoom=9;
        console.log("Zooming in (no animation)...", this.mapparams);
        return this.wait(3000);
    }).then(function () {
        polyline.addPoint(mapsModule.Position.positionFromLatLng(-33.33, 151.08));
        console.log("Adding point to Polyline...", polyline);
        this.mapparams.padding=[30, 60, 40, 40];
        return this.wait(3000);
    }).then(function () {
        polygon.addPoint(mapsModule.Position.positionFromLatLng(-34.22, 151.20));
        console.log("Adding point to Polygon...", polygon);
        return this.wait(3000);
    }).then(function () {
        var marker = this.mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        marker.visible = true;
        return this.wait(3000);
    }).then(function () {
        var marker = this.mapView.findMarker(function (marker) {
            return marker.userData.index === 2;
        });
        // marker.position = mapsModule.Position.positionFromLatLng(-32.89,151.44);
        marker.anchor = [1, 1];
        marker.alpha = 0.8;
        return this.wait(3000);
    }).then(function () {
        console.log("Changing to dark mode...");
        //this.mapView.setStyle(style);
        return this.wait(3000);
    }).then(function () {
        var marker = this.mapView.findMarker(function (marker) {
            return marker.userData.index === 1;
        });
        console.log("Removing marker...", marker.userData);
        this.mapView.removeMarker(marker);
        return this.wait(3000);
    }).then(function () {
        console.log("Removing all circles...");
        this.mapView.removeAllCircles();
        console.log("Removing all polylines...");
        this.mapView.removeAllPolylines();
        console.log("Removing all polygons...");
        this.mapView.removeAllPolygons();
      return this.wait(3000);
    }).then(function () {
        console.log("Hiding compass...");
        this.mapView.settings.compassEnabled = false;
        this.printUISettings(this.mapView.settings);
      return this.wait(3000);
    }).then(function () {
        console.log("Changing bounds...");
        var bounds = mapsModule.Bounds.fromCoordinates(
            mapsModule.Position.positionFromLatLng(-33.88, 151.16),
            mapsModule.Position.positionFromLatLng(-33.78, 151.24)
        );
        this.mapView.setViewport(bounds);
        return this.wait(3000);
    }).then(function () {
        var marker = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(this.mapView.latitude, this.mapView.longitude);
        marker.title = "All Done";
        marker.snippet = "Enjoy!";
        marker.color = 240;
        this.mapView.addMarker(marker);
        marker.showInfoWindow();
    }).catch(function (error) {
        console.log(error);
    });
}

}

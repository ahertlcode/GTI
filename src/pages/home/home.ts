import { Component, ViewChild, ElementRef, Injectable } from '@angular/core';
import { NavController, ModalController, ModalOptions, Events, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
//import { googlemaps } from 'googlemaps';
import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";


declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
@Injectable()
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  infoWindow: any;
  to: string;
  from: string;


  constructor(public navCtrl: NavController, public alertMe: AlertController, private dload: LoadingController, private platfm: Platform, public events: Events, private remoteserve: RemoteServiceProvider, public geolocation: Geolocation, private xmodal: ModalController) {

  }

  showAlert(title,msg){
    let msgbox = this.alertMe.create({

    });
  }

  showloading(){
    let lwait = this.dload.create({
      content: "Please wait ...",
      duration: 5000
    });
    lwait.present();
  }

  exitAppl(){
    this.platfm.exitApp();
  }

  openrcabmodal(){
    const modalr = this.xmodal.create("RcabPage");
    modalr.onDidDismiss(()=>{
      this.from = this.remoteserve.getFrom();
      this.to = this.remoteserve.getTo();
      this.calculateroute(this.from,this.to);
      this.showloading();
      //setTimeout(this.calculateroute(this.from,this.to),1000);
    });
    modalr.present();
  }

  openschelmodal(){
    const modalschl = this.xmodal.create("ScheduletripPage");
    modalschl.present();
  }

  openmodal(titlex,contentx,modex){
    var data = {content: contentx,title:titlex,mode:modex};
    const modaloptx: ModalOptions = {
      enableBackdropDismiss: false
    }
    const modalx = this.xmodal.create("ModalPage",data,modaloptx);
    modalx.present();
  }

  ionViewDidLoad(){
    this.showloading();
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }
  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }
  addInfoWindow(marker, content){

    this.infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.open(this.map, marker);
    });
  }

  calculateroute(from, to){
    this.showloading();
    //Center initialized as your current location
    var mapopt = {
      zoom: 10,
      center: { lat: 6.3244, lng: 3.5467 },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Draw the map
    var mapObj = new google.maps.Map( this.mapElement.nativeElement,mapopt);

    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
      origin: from,
      destination: to,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsService.route(
      directionsRequest,
      function(response,status){
        if(status == google.maps.DirectionsStatus.OK){
          new google.maps.DirectionsRenderer({
            map: mapObj,
            directions: response
          });
        }
        else alert("Unable to retrieve your route");
      }
    )
  }
}

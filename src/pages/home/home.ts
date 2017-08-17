import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ModalOptions } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { googlemaps } from 'googlemaps';


declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;
  infoWindow: any;


  constructor(public navCtrl: NavController, public geolocation: Geolocation, private xmodal: ModalController) {

  }

  openrcabmodal(){
    const modalr = this.xmodal.create("RcabPage");
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
    this.loadMap();
  }

/**
  initMap(){
    this.map = new google.maps.Map(this.mapElement.nativeElement,{
      center: {lat: 6.5244, lng: 3.3792},
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.infoWindow = new google.maps.InfoWindow();

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.infoWindow.setPosition(pos);
        this.infoWindow.setContent('This is your Location');
        this.infoWindow.open(this.map);
        this.map.setCenter(pos);
      },function () {
        this.handleLocationError(true,this.infoWindow, this.map.getCenter());
      });
    }else{
      this.handleLocationError(false,this.infoWindow, this.map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation: boolean,infoWin: any, pos: any){
    infoWin.setPosition(pos);
    infoWin.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.':
      'Error: Your browser doesn\'t support geolocation.'
    );
    infoWin.open(this.map);
  }
*/

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

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}

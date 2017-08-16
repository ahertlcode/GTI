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


  constructor(public navCtrl: NavController, public geolocation: Geolocation, private xmodal: ModalController) {

  }

  /**

  ngOnInit() {
      this.acService = new google.maps.places.AutocompleteService();
      this.autocompleteItems = [];
      this.autocomplete = {
      query: ''
    };
  }

updateSearch(){
console.log('modal > updateSearch');
if (this.autocomplete.query == '') {
this.autocompleteItems = [];
return;
}
let self = this;
let config = {
//types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
input: this.autocomplete.query,
componentRestrictions: {  }
}
this.acService.getPlacePredictions(config, function (predictions, status) {
console.log('modal > getPlacePredictions > status > ', status);
self.autocompleteItems = [];
predictions.forEach(function (prediction) {
self.autocompleteItems.push(prediction);
});
});
}
*/


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

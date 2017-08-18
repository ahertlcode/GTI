import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { googlemaps } from 'googlemaps';

import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";
import { HomePage } from "../home/home";


declare var google;


/**
 * Generated class for the RcabPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rcab',
  templateUrl: 'rcab.html',
})
export class RcabPage {
  @ViewChild('quote') divElement: ElementRef;
  gtidata = [];
  address: string;
  price: any;
  xhome: HomePage;

  constructor(public navCtrl: NavController, public events: Events, private remoteService: RemoteServiceProvider, public geolocation: Geolocation, public navParams: NavParams, private view: ViewController) {
    this.getData();
  }

  getData(){
    this.remoteService.getGtiData().subscribe((data) => {
      this.gtidata = data;
    });
  }

  ionViewDidLoad() {
    google.maps.event.addDomListener(window,'load',this.fetchlocation());
    var napt = <HTMLInputElement>document.getElementById('narate').getElementsByTagName('input')[0];
    napt.value = null;
  }


  fetchlocation(){
    var from: any = (<HTMLInputElement>document.getElementById('xfrom').getElementsByTagName('input')[0]);
    var to: any = (<HTMLInputElement>document.getElementById('xto').getElementsByTagName('input')[0]);
    var autocomplete1 = new google.maps.places.Autocomplete(from);
    //autocomplete1.addListener('place_changed',this.getLatLng('xfrom'));
    var autocomplete2 = new google.maps.places.Autocomplete(to);
    //autocomplete2.addListener('place_changed',this.getLatLng('xto'));
  }

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        },function(results,status){
          if(status == google.maps.GeocoderStatus.OK){
            var inp = <HTMLInputElement>document.getElementById('xfrom').getElementsByTagName('input')[0];
            inp.value = results[0].formatted_address;
            var inp1 = <HTMLInputElement>document.getElementById('dummy').getElementsByTagName('input')[0];
            inp1.value = results[0].formatted_address;
          }else{
            alert("Unable to get Your Location Address.");
          }
        });
      });
    }
    this.getLatLngByAddr();
  }

  getLatLngByAddr(){
    var napt = <HTMLInputElement>document.getElementById('narate').getElementsByTagName('input')[0];
    napt.value = null;
    var ad = <HTMLInputElement>document.getElementById('dummy').getElementsByTagName('input')[0];
    var addr = ad.value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': addr},function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        var lati = <HTMLInputElement>document.getElementById('xfromLat').getElementsByTagName('input')[0];
        lati.value = results[0].geometry.location.lat();
        var long = <HTMLInputElement>document.getElementById('xfromLng').getElementsByTagName('input')[0];
        long.value = results[0].geometry.location.lng();
      }else{
        alert("Please click 'Get Current Location' again.");
      }
    });
    var napt = <HTMLInputElement>document.getElementById('narate').getElementsByTagName('input')[0];
    napt.value += addr+",";
  }

  getLatLng(tid){
    if(tid == 'xfrom'){
      var napt = <HTMLInputElement>document.getElementById('narate').getElementsByTagName('input')[0];
      napt.value = null;
    }
    var adpt = <HTMLInputElement>document.getElementById(tid).getElementsByTagName('input')[0];
    this.address = adpt.value;
    var napt = <HTMLInputElement>document.getElementById('narate').getElementsByTagName('input')[0];
    napt.value += this.address+",";


    //create async request to get LatLng for address
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': this.address},function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        var lati = <HTMLInputElement>document.getElementById(tid+'Lat').getElementsByTagName('input')[0];
        lati.value = results[0].geometry.location.lat();
        var long = <HTMLInputElement>document.getElementById(tid+'Lng').getElementsByTagName('input')[0];
        long.value = results[0].geometry.location.lng();
      }else{
        alert("Network Error: Ensure your data service is enabled.");
      }
    });
  }

  getQuote(){
    var lat1 = <HTMLInputElement>document.getElementById("xfromLat").getElementsByTagName('input')[0];
    var latitude1 = lat1.value;
    var lng1 = <HTMLInputElement>document.getElementById("xfromLng").getElementsByTagName('input')[0];
    var longitude1 = lng1.value;
    var lat2 = <HTMLInputElement>document.getElementById("xtoLat").getElementsByTagName('input')[0];
    var latitude2 = lat2.value;
    var lng2 = <HTMLInputElement>document.getElementById("xtoLng").getElementsByTagName('input')[0];
    var longitude2 = lng2.value;

    //Get the distance btw the two addresses geometry is used an was require through googlemap api.
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(latitude1,longitude1),
      new google.maps.LatLng(latitude2,longitude2)
    );

    //save distance in hidden field
    var vt = <HTMLInputElement>document.getElementById("vType").getElementsByTagName('input')[0];
    vt.value = distance;

    //call getprice to calculate price for this to cover
    this.getprice();
  }

  getprice(){
    var Typ =<HTMLInputElement>document.getElementById("isltVehicleType").getElementsByTagName('input')[0];
    var vTypex = Typ.value;
    var distVal = <HTMLInputElement>document.getElementById("vType").getElementsByTagName('input')[0];
    var gdist = parseFloat(distVal.value);
    var dist = Math.ceil(gdist/1000);
    var uprice = this.gtidata[vTypex];
    this.price = dist*uprice;
    var narator = <HTMLInputElement>document.getElementById("narate").getElementsByTagName('input')[0];
    narator.value += ", \nis "+dist+"Km, for "+vTypex+" Drive. @ NGN "+uprice.toLocaleString('en')+" per kilometer,\nCost NGN "+this.price.toLocaleString('en');
    var quote = narator.value;
    this.divElement.nativeElement.innerText = " ";
    this.showQuote(quote);
  }

  showQuote(cost){
    this.divElement.nativeElement.innerText = cost;
  }

  doVehicleSelect(selectedVal){
    var tve = <HTMLInputElement>document.getElementById("isltVehicleType").getElementsByTagName('input')[0];
    tve.value = selectedVal;
  }


  placeorder(){
    if(confirm("Are you sure? The sum of NGN "+this.price+" will be charged to your debit card.") == true){
      alert("You have been charged.");
      var ifrom = <HTMLInputElement>document.getElementById('xfrom').getElementsByTagName('input')[0];
      var from = ifrom.value;
      var ito = <HTMLInputElement>document.getElementById('xto').getElementsByTagName('input')[0];
      var to = ito.value;
      this.closemodal();
    }
    this.xhome.calculateroute(from,to);
  }


  closemodal(){
    this.view.dismiss();
  }
}

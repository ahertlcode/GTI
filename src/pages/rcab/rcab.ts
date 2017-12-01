import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { googlemaps } from 'googlemaps';

import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";


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
  imode: boolean = false;
  iconfirm: boolean = false;

  constructor(public navCtrl: NavController, private loader: LoadingController, public alertCtrl: AlertController, public events: Events, private remoteService: RemoteServiceProvider, public geolocation: Geolocation, public navParams: NavParams, private view: ViewController) {
    this.getData();
  }

  showloader(delay = null){
    if(delay == null){
      delay = 5000;
    }
    let waiti = this.loader.create({
      content: "Please wait ...",
      duration: delay
    });
    waiti.present();
  }

  getData(){
    this.remoteService.getGtiData().subscribe((data) => {
      this.gtidata = data;
    });
  }

  ionViewDidLoad() {
    google.maps.event.addDomListener(window,'load',this.fetchlocation());
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
    this.showloader();
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        },function(results,status){
          if(status == google.maps.GeocoderStatus.OK){
            var inp = <HTMLInputElement>document.getElementById('xfrom').getElementsByTagName('input')[0];
            var myadr = results[0].formatted_address;
            inp.value = myadr;
          }else{
            this.showAlert("Location Error!","Unable to get your current Location Address");
          }
        });
      });
    }else{
      this.showAlert("Geolocation Error!","The location service on your device appear off. Please turn it on.");
    }
  }

  showAlert(titlex,messagex){
    let alerti = this.alertCtrl.create({
      title: titlex,
      subTitle: messagex,
      buttons: ['OK']
    });
    alerti.present();
  }

  showConfirm(titlex,msgx):boolean {
    let confirm = this.alertCtrl.create({
      title: titlex,
      message: msgx,
      buttons: [
        {
          text: 'Disagree',
          role: 'cancel',
          handler: () => {
            //reject(false);
            this.iconfirm = false;
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.iconfirm = true;
            //resolve(true);
          }
        }
      ]
    });
    /**
     * alert.present().then(() => {
      this.testRadioOpen = true;
    });
     */

    confirm.present().then(()=>{
      return this.iconfirm;
    });
    return this.iconfirm;
  }

  getLatLng(tid){
    var adpt = <HTMLInputElement>document.getElementById(tid).getElementsByTagName('input')[0];
    var addrs = adpt.value;
    this.address = addrs; //for debugging purpose.
    var napt = <HTMLInputElement>document.getElementById('narate').getElementsByTagName('input')[0];
    if(tid == 'xfrom'){
      napt.value = addrs+", To "
    }else {
      napt.value += addrs + ",\n";
    }

    //create async request to get LatLng for address
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': addrs},function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        var lati = <HTMLInputElement>document.getElementById(tid+'Lat').getElementsByTagName('input')[0];
        var latx = results[0].geometry.location.lat();
        lati.value = latx;
        var long = <HTMLInputElement>document.getElementById(tid+'Lng').getElementsByTagName('input')[0];
        var lngx = results[0].geometry.location.lng();
        long.value = lngx;
      }else{
        //alert("Network Error: Ensure your data service is enabled.");
        this.showAlert("Network Error!","Please enable your data service and ensure to your provider data servcie is active.");
      }
    });
  }

  getQuote(){
      this.showloader(1000);
      this.divElement.nativeElement.innerText = null;
      if(this.imode == false){
        this.showAlert("Attention Please!","You must agree to GTI Logistics terms and conditions. ");
      }else{
        this.getDistance();
      }
  }

  getDistance() {
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
      new google.maps.LatLng(latitude1, longitude1),
      new google.maps.LatLng(latitude2, longitude2)
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
    narator.value += " is "+dist+"Km, for "+vTypex+" Drive. @ NGN "+uprice.toLocaleString('en')+" per kilometer,\nCost NGN "+this.price.toLocaleString('en');
    var quote = narator.value;
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
    this.showloader();
    if(confirm("Are you sure? The sum of NGN "+this.price+" will be charged to your debit card.") == true){
      this.showAlert("Charged!","You have been charged.");
      var ifrom = <HTMLInputElement>document.getElementById('xfrom').getElementsByTagName('input')[0];
      var from = ifrom.value;
      var ito = <HTMLInputElement>document.getElementById('xto').getElementsByTagName('input')[0];
      var to = ito.value;
      //this.rform.reset;
      this.remoteService.setFrom(from);
      this.remoteService.setTo(to);
      this.closemodal();
    }
  }

  checkaigree(mod){
    this.getLatLng('xfrom'); //get the latitude & Longitude for A
    this.getLatLng('xto');   //get the latitude & Longitude for B
    if(mod == false){
      this.imode = false;
      this.showAlert("Attention Please!","You must agree to GTI Logistics terms and conditions. ");
    }else{
      this.imode = true;
    }
  }

  closemodal(){
    this.view.dismiss();
  }
}

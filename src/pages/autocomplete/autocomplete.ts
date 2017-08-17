import { Component, NgZone, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { googlemaps } from 'googlemaps';


/**
 * Generated class for the AutocompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html',
})
export class AutocompletePage  implements OnInit{
  autocompleteItems: any;
  autocomplete: any;
  service: any;
  placesService: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private zone: NgZone){

  }

  ngOnInit(){
    this.service = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query:''
    };

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any){
    this.viewCtrl.dismiss(item);
  }

  updateSearch(){
    if(this.autocomplete.query == ''){
      this.autocompleteItems = [];
      return;
    }
    var me = this;
    var config = {
      types: ['geocode'],
      input: this.autocomplete.query,
      componentRestriction:{country:''}
    }
    this.service.getPlacePredictions(config, function(predictions,status){
      me.autocompleteItems = [];
      predictions.forEach(function (prediction) {
        me.autocompleteItems.push(prediction);
      });
    });

    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AutocompletePage');
  }

}

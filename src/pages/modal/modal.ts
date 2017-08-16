import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  content; title; mode;

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
      this.content = this.navParams.get('content');
      this.title = this.navParams.get('title');
      this.mode = this.navParams.get('mode');
      this.modeshow();
  }
  modeshow(){
    if(this.mode == 'schedule_trip'){ console.log(this.mode); return true; }else{ console.log(this.mode); return false; }
  }
  closemodal(){
    this.view.dismiss();
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModalPage');
    //console.log(this.navParams.get('content'));

  }

}

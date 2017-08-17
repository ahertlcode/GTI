import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';


import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RemoteServiceProvider {
  getApiUrl: string = "http://localhost/gti/server/gtidata.php";

  constructor(public http: Http){
  }

  getGtiData(){
    return this.http.get(this.getApiUrl)
      .do((res : Response) => console.log(res.json))
      .map((res : Response) => res.json());
  }
}

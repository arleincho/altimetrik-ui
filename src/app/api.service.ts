import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  zip:string = '';
  distance:string = '';
  year:string = '';
  degres:string = '';
  page:string = '';
  degress_split: string = '';

  params:string = '';

  private url: string = "http://localhost:8080/?";
  // private url: string = "http://localhost:8080/?per_page=30&";

  constructor(private http: HttpClient) { }


  getCollege(query:any){

    if (query != null){
      // this.degress_split = query['degrees'].join(',');
      // delete query['degrees'];
      query['degres'] = query['degres'].join(',');

      this.params = "";
      for (var key in query) {
          if (this.params != "") {
              this.params += "&";
          }
          this.params += key + "=" + query[key];
        }

      }else{
         this.params = "degres=3,4&year=2014&per_page=30&zip=32805&distance=50&page=0";
      }

      // this.url = this.url + JSON.stringify(query);



    console.log(this.url, this.params);
    return this.http.get(this.url + this.params);
  }

}

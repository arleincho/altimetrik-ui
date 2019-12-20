import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ApiService } from './api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapsAPILoader, MouseEvent } from '@agm/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'altimetrik-ui';
  table: any;
  dataSource: MatTableDataSource<Collage>;
  displayedColumns = ['id', 'name', 'size'];
  searchForm: FormGroup;
  degres:string[] = ['1', '2', '3', '4'];

  private geoCoder;

  latitude: number;
  longitude: number;
  zoom: number = 12;
  address: string;


  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
     private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
    ){

      this.searchForm = this.formBuilder.group({
        zip: '',
        distance: '',
        year: '',
        degres: '',
        page: 0,
        per_page: 20
      });
  }

  ngOnInit() {


    this.getCollegeTRable();

     this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });

  }

  getCollegeTRable(){
    this.api.getCollege(null)
    .subscribe((data => {
      this.table = data;
      this.dataSource = new MatTableDataSource(data['results']);
      this.getAddress("32805");
    }));
  }

  onClickSubmit(formData:any) {
    console.warn(formData.value);

    this.api.getCollege(formData.value)
    .subscribe((data => {
      this.table = data;
      this.dataSource = new MatTableDataSource(data['results']);
      console.log("formData.value.zip", typeof formData.value.zip);
      this.getAddress(formData.value.zip.toString());

    }));
  }


  getAddress(zipcode:string) {
    console.log("estamos mirando que ....", zipcode);
    this.geoCoder.geocode({ 'address': zipcode}, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;

          this.longitude = results[0].geometry.location.lng();
          this.latitude = results[0].geometry.location.lat();


        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

}


export interface Paginator{
  page: number;
  per_page: number;
  total: number;
  pages: number;
}


export interface Collage {
  id: number;
  name: string;
  size: number;
}


export interface Table{
  paginator: Paginator;
  collages: Collage[];
}

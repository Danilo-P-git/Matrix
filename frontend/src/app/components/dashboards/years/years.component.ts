import { Component, OnInit } from '@angular/core';
import { SharedModule } from "../../../shared/shared.module";
import { FlatpickrDefaults } from 'angularx-flatpickr';


@Component({
  selector: 'app-years',
    imports: [SharedModule],
  providers:[FlatpickrDefaults],
  templateUrl: './years.component.html',

  styleUrls: ['./years.component.scss'],
})
export class YearsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

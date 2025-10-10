import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css'],
  standalone: false

})
export class DashboardHeaderComponent implements OnInit {

  @Input() title = ''; // Card title, defaults to empty string
  constructor() { }

  ngOnInit() {
  }

}

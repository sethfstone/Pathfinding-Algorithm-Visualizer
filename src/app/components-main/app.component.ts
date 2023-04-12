import { Component } from '@angular/core';
import { DisplaygridComponent } from './displaygrid.component';

interface gridItem{
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'todoapp';
}

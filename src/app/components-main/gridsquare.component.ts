import { AppComponent } from './app.component';
import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { DisplaygridComponent } from './displaygrid.component';
import { CurrencyPipe } from '@angular/common';
import { timeInterval } from 'rxjs';

@Component({
  selector: 'app-gridsquare',
  templateUrl: './gridsquare.component.html',
  styleUrls: ['./gridsquare.component.css']
})
export class GridsquareComponent extends DisplaygridComponent {
  @Input() x: number;
  @Input() y: number;

  @Input() curr: number;
  @Input() mode: string;


  setMouseDownLoc(){
    this.curr = 1;
    //console.log("here");
  }

  setMouseUpLoc(){
    this.curr = 0;
    //console.log("here2");
  }


  //called every time mouse is over a grid square 
  markAction(){
    //console.log(this.curr);
    //console.log(this.mode);

    let itemInpQuery = "item" + this.x + "-" + this.y;
    let colItemQuery = this.x + "-" + this.y;
    let itemInp = document.getElementById(itemInpQuery);
    let colItemContainer = document.getElementById(colItemQuery.toString());


    //checks mode for determining mouse-grid functionality
    if(this.mode === "draw-wall"){
      //Check if users mouse is down 
      if(this.curr){
        //set values for css color change and grid item value
        itemInp.setAttribute("value", "wall");
        colItemContainer.setAttribute("class", "col-item-wall");

      }
    } else if(this.mode === "erase-wall"){
      if(this.curr){
        //similarly, will set values appropriately to erase walls
        itemInp.setAttribute("value", "notAssigned");
        colItemContainer.setAttribute("class", "col-item");
      }
    }


    
  }

  testing(){
    //console.log("b");
  }

  


}

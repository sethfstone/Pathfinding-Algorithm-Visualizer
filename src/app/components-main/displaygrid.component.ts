import { Component, Directive, Input, NgModule, QueryList, ViewChildren, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { AppComponent } from './app.component';


@Component({
  selector: 'app-displaygrid',
  templateUrl: './displaygrid.component.html',
  styleUrls: ['./displaygrid.component.css']
})
export class DisplaygridComponent implements OnInit{
  rows: Array<any>;
  cols: Array<any>;

  algMode: Number = 0;
 
  //used for detecting click
  currMouseState: number = 0;
  //used for controlling the mode of grid 
  currMode: string;
    
  //creates array of [0, 1, 2, .. n] for looping using directive for rows / cols
  buildRangeArr(n: number){
    const range = [];

    for(let i = 0; i < n; i++){
      range.push(i);
    }

    return range;
  }

  //needs to build row / col arrays to loop over
  constructor(){
    
  }

  ngOnInit(): void {
    this.rows = this.buildRangeArr(15);
    this.cols = this.buildRangeArr(24);
  }

  setMouseDown(){
    this.currMouseState = 1;
    console.log("down");
  }

  setMouseUp(){
    this.currMouseState = 0;
    console.log("up");

  }

  isStartPoint(item){
    console.log(item.getAttribute("value"));
    
  }

  randomNumber(min, max){
    return Math.floor(Math.random() * (max-min) + min);
  }

  setAlgModeDij(){
    this.algMode = 1;
  }

  setAlgModeA(){
    this.algMode = 2;
  }

  // Dijkstras 
  dijkstras(){
    /////// Implementation of Dijkstras algorithm on the array ////////

    //grabs grid and starting node
    let grid = document.getElementsByClassName("gridItem");
    let itemId = document.getElementById("startInfo").getAttribute("value");

    console.log("Starting node: ", itemId);   


    //tracking visited array / set of distances / predecessors
    let visited  = {};
    let distances = {};
    let predecessors = {};

    //queue / graph
    let queue = [];
    let graph;

    //start node /end node
    let startNode = "";
    let endNode = "";

    //initializes visited set with false values
    for(let nodeI = 0; nodeI < grid.length; nodeI++){
      //console.log(grid[nodeI].id);
      visited[grid[nodeI].id] = false;
      distances[grid[nodeI].id] = 99;
      predecessors[grid[nodeI].id] = -1;


        //make sure to note start node / end node
      if(grid[nodeI].getAttribute("value") === "start-point"){
        startNode = grid[nodeI].id;
        distances[grid[nodeI].id] = 0;
      }
      if(grid[nodeI].getAttribute("value") === "end-point") endNode = grid[nodeI].id;
    }


    /*
    console.log(visited);
    console.log(startNode);
    */


    //update start node as visited
    visited[startNode] = true;

    //console.log(visited);

    //push it to queue
    queue.push(startNode);

  
    
    //main driver loop 
    while(queue.length){
      if(this.runBFS(queue, visited, distances, predecessors) == false) break;
      //console.log("surrounding queue: ", queue)
    }
    
    
    //updates class of elements for visuals
      //shortest path
    this.printShortestPath(startNode, endNode, predecessors);
      //start node / end node
    document.getElementById(startNode.replace("item", "")).setAttribute("class", "col-item-start-point");
    document.getElementById(endNode.replace("item", "")).setAttribute("class", "col-item-end-point");

      //queue 
    for(let j = 0; j < queue.length; j++){
      let format = "";
      let itemInfo = queue[j].replace("item", "").split("-");
      document.getElementById(itemInfo[0] + "-" + itemInfo[1]).setAttribute("class", "col-item-queue-item"); //.setAttribute("class", "col-item-queue-item");
    }
  
    //console.log("final: ", visited);

  }

  //helper method
  isValid(node, visited){

    // check if node lies out of bounds
    if(document.getElementById(node) == null) return false;  
    
    //check if node is already visited
    if(visited[node] == true) return false;

    //lastly check if its a wall
    if(document.getElementById(node).getAttribute("value") === "wall") return false;

    return true;

  }


  //////////
  printShortestPath(startNode, endNode, predecessors){
    
    let path = new Array();
    let crawl = endNode;
    path.push(crawl);

    //console.log(predecessors, "\n", distances, "\n", path, "\n", crawl, "\n", endNode);

    
    while(predecessors[crawl] != -1){
      path.push(predecessors[crawl]);
      crawl = predecessors[crawl];
    }

    //console.log("Length of shortest path: ", distances[endNode]);

    //console.log("Path: \n");

    for(let i = path.length -1; i >= 0; i--){
      document.getElementById(path[i].replace("item", "")).setAttribute("class", "col-item-path");
    }

    console.log("path: ", path);

  }
  //////////

  //while loop function (analyzes surrounding first)
    runBFS(queue, visited, distances, predecessors){

      let curr = queue[0];

      let currentNode = queue.shift();
      //console.log("Visiting node: ", currentNode);

      //if end node break
      if(document.getElementById(currentNode).getAttribute("value") === "end-point"){
        console.log("Caught end: ", currentNode);
        return false;
      }

      //changes classname of square for color change
      document.getElementById(currentNode.replace("item", "")).setAttribute("class", "col-item-thinking");

      //disect current node element
      let x, y; 
      let coorValues = currentNode.replace("item", "").split("-");
      x = coorValues[0];
      y = coorValues[1];


      // grab surrounding nodes and validate
      let top, left, right, bottom, topright, topleft, bottomright, bottomleft;
      let surroundingNodes = [];
      let filteredSet = [];


      top = ("item" + x + "-" + (Number(y)+1)); surroundingNodes.push(top);
      left = ("item" + (Number(x)-1) + "-" + y); surroundingNodes.push(left);
      right = ("item" + (Number(x)+1) + "-" + y); surroundingNodes.push(right);
      bottom = ("item" + x + "-" + (Number(y)-1)); surroundingNodes.push(bottom);

      topright = ("item" + (Number(x)+1) + "-" + (Number(y)-1)); surroundingNodes.push(topright);
      topleft = ("item" + (Number(x)-1) + "-" + (Number(y)-1)); surroundingNodes.push(topleft);
      bottomright = ("item" + (Number(x)+1) + "-" + (Number(y)+1)); surroundingNodes.push(bottomright);
      bottomleft = ("item" + (Number(x)-1) + "-" + (Number(y)+1)); surroundingNodes.push(bottomleft);
      
      //filter 
      for(let item of surroundingNodes){
        if(this.isValid(item, visited)){
          filteredSet.push(item);
        }
      }

      //console.log("finished validating");
      //console.log("surrounding nodes at", currentNode, ":", filteredSet);


      //for each item in the queue update arrays
      for(let j = 0; j < filteredSet.length; j++){
        //console.log("current one: ", filteredSet[j]);
        //console.log("topright: ", topright);

        visited[filteredSet[j]] = true;
        if(filteredSet[j] === topright || filteredSet[j] === topleft || filteredSet[j] === bottomright || filteredSet[j] === bottomleft){
          distances[filteredSet[j]] = distances[curr] + Math.sqrt(2);
        }else{
          distances[filteredSet[j]] = distances[curr] + 1;
        }
        queue.push(filteredSet[j]);
        predecessors[filteredSet[j]] = curr;
    

      }
      
      //console.log("visited: ", visited, "\ndistances: ", distances, "\npred: ", predecessors);
    
      return true;
      
  }

  //A* algorithm implementation
  aStar(){
    //grabs grid and starting node and end node
    let grid = document.getElementsByClassName("gridItem");
    let startItemId = document.getElementById("startInfo").getAttribute("value");
    let endItemId = document.getElementById("endInfo").getAttribute("value");

   // console.log(startItemId, endItemId);

    //set initialization
    let openSet = [];
    let closedSet = [];
    let visited = [];
    let parents = {};

    //initialize parents
    for(let i = 0; i < grid.length; i++){
      parents[grid[i].id] = -1;
    }
    //console.log(parents);

    //push start node to open list
    openSet.push({[startItemId] : 0});


    //driver loop
    while(openSet.length != 0){

      //Get minimum item from open set
      let minF = 1000;
      let minItem = "";

      for(let key in openSet){
        if(Object.values(openSet[key])[0] < minF){
          minF = Number(Object.values(openSet[key])[0]);
          minItem = Object.keys(openSet[key])[0];
        }
      }

      //visited.push({[minItem]: true});

      //remove min item from open set
      openSet = this.remove(openSet, minItem, minF);
      

      //check if we have found the end node (and so also the path)
      if(document.getElementById(minItem).getAttribute("value") === "end-point"){console.log("caught end: ", minItem); break;}
      
      //gather surrounding
        //disect current node element
      let x, y; 
      let coorValues = minItem.replace("item", "").split("-");
      x = coorValues[0];
      y = coorValues[1];

        // grab surrounding nodes and validate
      let top, left, right, bottom, topright, topleft, bottomright, bottomleft;
      let surroundingNodes = [];
      let filteredSet = [];


      top = ("item" + x + "-" + (Number(y)+1)); surroundingNodes.push(top);
      left = ("item" + (Number(x)-1) + "-" + y); surroundingNodes.push(left);
      right = ("item" + (Number(x)+1) + "-" + y); surroundingNodes.push(right);
      bottom = ("item" + x + "-" + (Number(y)-1)); surroundingNodes.push(bottom);

      topright = ("item" + (Number(x)+1) + "-" + (Number(y)-1)); surroundingNodes.push(topright);
      topleft = ("item" + (Number(x)-1) + "-" + (Number(y)-1)); surroundingNodes.push(topleft);
      bottomright = ("item" + (Number(x)+1) + "-" + (Number(y)+1)); surroundingNodes.push(bottomright);
      bottomleft = ("item" + (Number(x)-1) + "-" + (Number(y)+1)); surroundingNodes.push(bottomleft);
      

     // console.log("surr: ", surroundingNodes);

        //regular filter 
      for(let item = 0; item < surroundingNodes.length; item++){
        if(this.isValid(surroundingNodes[item], visited)){
          filteredSet.push(surroundingNodes[item]);        
        }
      }

        //filter for closed set items
      let matches = [];
      //console.log("closed set: ", closedSet);
      for(let item of filteredSet){
       // console.log("item: ", item);
        for(let cur in closedSet){
        //  console.log("\n", item, Object.keys(closedSet[cur])[0], "\n");
          if(item === Object.keys(closedSet[cur])[0]){
            //console.log("caught match");
            matches.push(item);
          }
        }
      }

      for(let i = 0; i < matches.length; i++){
        filteredSet = filteredSet.filter(function(item) {return item !== matches[i]});
      }



      for(let neighbor of filteredSet){
        //console.log("neighbor:", neighbor);
        //calculate g + h (f)
        let g, h, f;
        let x, y, goalX, goalY, startX, startY;
        let dx, dy;

        x = Number(neighbor.replace("item", "").split("-")[0]);
        y = Number(neighbor.replace("item", "").split("-")[1]);

        goalX = Number(endItemId.replace("item", "").split("-")[0]);
        goalY = Number(endItemId.replace("item", "").split("-")[1]);

        dx = Math.abs(x - goalX);
        dy = Math.abs(y - goalY);

          
        if(dx > dy){
          h = (dx - dy) + (Math.sqrt(2) * dy);
        }else {
          h = (dy - dx) + (Math.sqrt(2) * dx);
        } 

        startX = Number(startItemId.replace("item", "").split("-")[0]);
        startY = Number(startItemId.replace("item", "").split("-")[1]);


        dx = Math.abs(x - startX);
        dy = Math.abs(y - startY);

        if(dx > dy){
          g = (dx - dy) + (Math.sqrt(2) * dy);
        }else {
          g = (dy - dx) + (Math.sqrt(2) * dx);
        } 
          

        f = g + h;
        f = Math.abs(f*10);
        //console.log(Math.abs(f*10));

        

        //styling stuff for visuals
        //document.getElementById(neighbor.replace("item", "")).setAttribute("class", "col-item-thinking");



        //finally add to open set if valid
        let isShorter = false;
        let isIn = false;
        for(let openItem in openSet){
          //if item is in openSet check if shorter
          if(neighbor === Object.keys(openSet[openItem])[0]){
            isIn = true;
            if(f < Object.values(openSet[openItem])[0]){
              isShorter = true;
            }
          }
        }

        

        if(isShorter || !isIn){
          parents[neighbor] = minItem;

          if(!isIn){
            openSet.push({[neighbor] : f});
          }
        }

      

      }


      closedSet.push({[minItem] : [minF]});
      

    }

    //visual stuff
    //console.log("openSet", openSet);
    for(let i = 0; i < openSet.length; i++){
      document.getElementById(Object.keys(openSet[i])[0].replace("item", "")).setAttribute("class", "col-item-queue-item");
    }
   // console.log("closedSet", closedSet);
    for(let i = 0; i < closedSet.length; i++){
      document.getElementById(Object.keys(closedSet[i])[0].replace("item", "")).setAttribute("class", "col-item-thinking");
    }

    this.printShortestPath(startItemId, endItemId, parents);



    document.getElementById(startItemId.replace("item", "")).setAttribute("class", "col-item-start-point");
    document.getElementById(endItemId.replace("item", "")).setAttribute("class", "col-item-end-point");

    //console.log("openset: ", openSet);
    //console.log("parents: ", parents);



    /*
    let visited = {};
    let predecessors = {};
 
    //push start node to open set / visited
    openSet.push({[startItemId] : 0});
    visited[startItemId] = true;

    console.log("current Set", openSet);


  // main driver loop
    while(openSet.length != 0){
      
      let minF = 100;
      let minItem = "";

      //Get minimum item from open set
      for(let key in openSet){
        if(Object.values(openSet[key])[0] < minF){
          minF = Number(Object.values(openSet[key])[0]);
          minItem = Object.keys(openSet[key])[0];
        }
      }

      //remove q (min item from openSet) from openSet
      openSet = this.remove(openSet, minItem, minF);

      //grab surrounding items 
      //disect current node element
      let x, y; 
      let coorValues = minItem.replace("item", "").split("-");
      x = coorValues[0];
      y = coorValues[1];


      // grab surrounding nodes and validate
      let top, left, right, bottom, topright, topleft, bottomright, bottomleft;
      let surroundingNodes = [];
      let filteredSet = [];


      top = ("item" + x + "-" + (Number(y)+1)); surroundingNodes.push(top);
      left = ("item" + (Number(x)-1) + "-" + y); surroundingNodes.push(left);
      right = ("item" + (Number(x)+1) + "-" + y); surroundingNodes.push(right);
      bottom = ("item" + x + "-" + (Number(y)-1)); surroundingNodes.push(bottom);

      topright = ("item" + (Number(x)+1) + "-" + (Number(y)-1)); surroundingNodes.push(topright);
      topleft = ("item" + (Number(x)-1) + "-" + (Number(y)-1)); surroundingNodes.push(topleft);
      bottomright = ("item" + (Number(x)+1) + "-" + (Number(y)+1)); surroundingNodes.push(bottomright);
      bottomleft = ("item" + (Number(x)-1) + "-" + (Number(y)+1)); surroundingNodes.push(bottomleft);
      
      //filter 
      for(let item of surroundingNodes){
        if(this.isValid(item, visited)){
          filteredSet.push(item);
          predecessors[item] = minItem;
        }
      }
      console.log(filteredSet);
      console.log(predecessors);
      //process queue
      for(let j = 0; j < filteredSet.length; j++){  
        let successor = filteredSet[j];

        //check for end node being found
        if(document.getElementById(filteredSet[j]).getAttribute("value") === "end-point"){
          console.log("Caught end: ", filteredSet[j]);
          break;
        }

        //else calculate g + h (f)
        let g, h, f;
        let x, y, goalX, goalY, startX, startY;
        let dx, dy;

        x = Number(filteredSet[j].replace("item", "").split("-")[0]);
        y = Number(filteredSet[j].replace("item", "").split("-")[1]);

        goalX = Number(endItemId.replace("item", "").split("-")[0]);
        goalY = Number(endItemId.replace("item", "").split("-")[1]);

        dx = Math.abs(x - goalX);
        dy = Math.abs(y - goalY);

        
        if(dx > dy){
          h = (dx - dy) + (Math.sqrt(2) * dy);
        }else {
          h = (dy - dx) + (Math.sqrt(2) * dx);
        } 

        startX = Number(startItemId.replace("item", "").split("-")[0]);
        startY = Number(startItemId.replace("item", "").split("-")[1]);


        dx = Math.abs(x - startX);
        dy = Math.abs(y - startY);

        if(dx > dy){
          g = (dx - dy) + (Math.sqrt(2) * dy);
        }else {
          g = (dy - dx) + (Math.sqrt(2) * dx);
        } 
        

        f = g + h;

       // if(){
       //   continue;
       // }else{ 
          openSet.push({[successor] : f}); 
       // }

      }

      let smallestItem = "";

      for(let i = 0; i < openSet.length; i++){

      }

      

      //skip if node in openSet w lower f value than one just generated
      
      console.log("open set: ", openSet);

      //skip if node node in closed list w lower f value 

      break;




    }
    */
    return true;
  }

/*
  isValidAStart(nodeI, closedSet){

    // check if node lies out of bounds
    if(document.getElementById(node) == null) return false;  
    
    //check if node is already visited
    if(closedSet[nodeI] == true) return false;

    //lastly check if its a wall
    if(document.getElementById(node).getAttribute("value") === "wall") return false;

    return true;

  }
*/
  //helper methods
  remove(array, key, value){
    let index = array.findIndex(obj => obj[key] === value);

    if(index !== -1){
      //console.log(index);
      array.splice(index, 1);
      return array;
    }
  }

  test(){
   // console.log("aaa");
  }

  


  startAlg(){
    
    if(this.algMode === 1){
      this.dijkstras();
    } else if(this.algMode === 2){
      this.aStar();
    }

    


  }

  changeGridMode(index){
    //console.log("worked");
    //console.log(document.getElementById("gridMode"));
    //console.log(index);
    this.currMode = index;
    
    //this.currMode = document.getElementById("mode[]").value;
  }
   


  //these functions set the currMode for determingin behavior
  //in markAction function and setting start point
  setEraseMode(){
    this.currMode = "erase-wall";
    //console.log("Updating mode: ", this.currMode);
  }
  
  setDrawMode(){
    this.currMode = "draw-wall";
    //console.log("Updating mode: ", this.currMode);
  }

  setStartPointMode(){
    this.currMode = "start-point";
    
  }

  setEndPointMode(){
    this.currMode = "end-point";
  }




  // where setting the start point/ throwing err if more than one occurs
  setStartPoint(i: number, j: number){
      // make sure correct mode before anything
    if(this.currMode === "start-point"){
      //grabs all grid input items for checking previous
      let grid = document.getElementsByClassName("gridItem");

      //grabs specificly clicked input value to change 
      let itemQuery ="item" + i + "-" + j;
      let itemToSet = document.getElementById(itemQuery);

      //grabs table column-item to change styling appropriately
      let colItemQuery = i + "-" + j;
      let colItemContainer = document.getElementById(colItemQuery.toString());

      //flag for prev
      let previouslyMarked = 0;

      // make sure there aren't any previously placed start points
      for(let item = 0; item < grid.length; item++){
        if(grid[item].getAttribute("value") === "start-point"){
          previouslyMarked = 1;
          console.log("There's already a start point\n--remove it to place another--\n");
        }
      }
      // otherwise place marker 
      if(!previouslyMarked){
        itemToSet.setAttribute("value", "start-point");
        colItemContainer.setAttribute("class", "col-item-start-point");
        document.getElementById("startInfo").setAttribute("value", ("item" + i + "-" + j));
      }
    }
  }

  setEndPoint(i: number, j: number){
    //make sure grid mode is set to be setting end point
    if(this.currMode === "end-point"){
      //grabs all grid input items for checking previous
      let grid = document.getElementsByClassName("gridItem");

      //grabs specificly clicked input value to change 
      let itemQuery ="item" + i + "-" + j;
      let itemToSet = document.getElementById(itemQuery);

      //grabs table column-item to change styling appropriately
      let colItemQuery = i + "-" + j;
      let colItemContainer = document.getElementById(colItemQuery.toString());

      //flag for prev
      let previouslyMarked = 0;

      // make sure there aren't any previously placed end points
      for(let item = 0; item < grid.length; item++){
        if(grid[item].getAttribute("value") === "end-point"){
          previouslyMarked = 1;
          console.log("There's already an end point\n--remove it to place another--\n");
        }
      }
      // otherwise place marker 
      if(!previouslyMarked){
        itemToSet.setAttribute("value", "end-point");
        colItemContainer.setAttribute("class", "col-item-end-point");
        document.getElementById("endInfo").setAttribute("value", ("item" + i + "-" + j));
      }
    }
  }

  
}

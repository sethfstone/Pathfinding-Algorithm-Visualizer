class Graph {
    constructor(){
        this.nodeList = [];
        this.adjacencyList = {};
    }

    addNode(node){
        this.nodeList.push(node);
        this.adjacencyList[node]= [];
    }

}

export default Graph;
export class FactoryMap {
 
    adjList: [factoryId: number, distance: number][][] = [];
    adjMatrix: number[][];

    constructor(factoryCount: number, links: [number, number, number][]) {
        this.adjList = Array(factoryCount);
        this.adjMatrix = Array(factoryCount);

        for(let i = 0; i < factoryCount; i++) {
            this.adjList[i] = [];
            this.adjMatrix[i] = Array(factoryCount).fill(0);
        }

        links.forEach(([a, b, distance]) => {
            this.adjList[a].push([b, distance]);
            this.adjList[b].push([a, distance]);
            this.adjMatrix[a][b] = distance;
            this.adjMatrix[b][a] = distance;
        });
    }

    addLink(a: number, b: number, distance: number) {

    }

    /**
     * Returns the distsance between the given factories, or
     * 0 if they are not connected
     */
    getDistance(a: number, b: number) {
        return this.adjMatrix[a][b];
    }
}
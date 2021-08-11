import { Entity } from "./Entity";

export class Troop extends Entity {
    constructor(
        public id: number, 
        public owner: number,
        public sourceId: number,
        public targetId: number,
        public numCyborgs: number,
        public remainingTurns: number) {
        super();
        this.id = id;
    }
}

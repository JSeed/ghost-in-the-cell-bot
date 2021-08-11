import { Entity } from './Entity';

export class Factory extends Entity {

    constructor(
        public id: number, 
        public owner: number,
        public numCyborgs: number,
        public production: number,
        public disabledTurns: number,
    ) {
        super();
    }

    cyborgsAfterTurns(turns: number): number {
        return this.numCyborgs + this.generatedAfterTurns(turns);
    }

    generatedAfterTurns(turns: number): number {
        turns -= this.disabledTurns;
        return turns <= 0 ? 0 : this.production * turns;
    }

}
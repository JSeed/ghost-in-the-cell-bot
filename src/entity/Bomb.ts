import { Entity } from './Entity';

export class Bomb extends Entity {
    constructor(
        public id: number,
        public owner: number,
        public sourceId: number,
        public targetId: number,
        public remainingTurns: number,
    ) {
        super();
    }
}
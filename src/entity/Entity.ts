
export enum EntityType {
    FACTORY='FACTORY',
    BOMB='BOMB',
    TROOP='TROOP',
}

export class Entity {
    public id: number = 0;
    public owner: number = 0;

    isEnemy(): boolean { return this.owner === -1; }
    isNeutral(): boolean { return this.owner === 0; }
    isFriendly(): boolean { return this.owner === 1; }
}
import { Entity, EntityType } from "../entity/Entity";
import { Factory } from '../entity/Factory';
import { Troop } from '../entity/Troop';
import { Bomb } from '../entity/Bomb';

type EntityMap = Record<keyof typeof EntityType, {[key: number]: Entity}>;

const initializeEntityMap = (): EntityMap => {
    const entities: Partial<EntityMap> = {};
        
    Object.values(EntityType).forEach((type) => {
        entities[type] = {};
    });

    return <EntityMap>entities;
}

export class EntityManager {

    entities: EntityMap;

    constructor() {
        this.entities = initializeEntityMap();
    }

    clearEntities() {
        this.entities = initializeEntityMap();
    }

    addEntity(type: EntityType, id: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number) {
        let entity;
        if (type === EntityType.FACTORY) {
            entity = new Factory(id, arg1, arg2, arg3, arg4);
        } else if (type === EntityType.TROOP) {
            entity = new Troop(id, arg1, arg2, arg3, arg4, arg5);
        } else {
            entity = new Bomb(id, arg1, arg2, arg3, arg4);
        }

        this.entities[type][id] = entity;
    }

    getEntities(type: EntityType) {
        return Object.values(this.entities[type]);
    }

    getFriendly(type: EntityType) {
        return this.getEntities(type)?.filter((e) => e.isFriendly());
    }

    getNeutral(type: EntityType) {
        return this.getEntities(type)?.filter((e) => e.isNeutral());
    }

    getEnemy(type: EntityType) {
        return this.getEntities(type)?.filter((e) => e.isEnemy());
    }

    getNonFriendly(type: EntityType) {
        return this.getEntities(type).filter((e) => !e.isFriendly());
    }

}
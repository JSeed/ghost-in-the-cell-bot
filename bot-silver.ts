/** CLASSES */

class Entity {
    id: number;
    owner: number;

    isEnemy(): boolean { return this.owner === -1; }
    isNeutral(): boolean { return this.owner === 0; }
    isFriendly(): boolean { return this.owner === 1; }
}

class Bomb extends Entity {
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

class Factory extends Entity {
    numCyborgs: number;
    production: number;
    disabledTurns: number;

    constructor(id) {
        super();
        this.id = id;
    }

    cyborgsAfterTurns(turns: number): number {
        return this.numCyborgs + this.generatedAfterTurns(turns);
    }

    generatedAfterTurns(turns: number): number {
        turns -= this.disabledTurns;
        return turns <= 0 ? 0 : this.production * turns;
    }

    update(owner: number, numCyborgs: number, production: number, disabledTurns: number) {
        this.owner = owner;
        this.numCyborgs = numCyborgs;
        this.production = production;
        this.disabledTurns = disabledTurns;
    }

    log(...args) {
        console.error(`[F${this.id}]`,...args);
    }
}

class Troop extends Entity {
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

/** HELPERS */
const getFriendly = (entities: Entity[]) => entities.filter(e=>e.isFriendly());
const getTargetable = (entities: Entity[]) => entities.filter(e=>!e.isFriendly());
const getEnemy = (entities: Entity[]) => entities.filter(e=>e.isEnemy());

const attackMove = (sId, tId, numCyborgs) => `MOVE ${sId} ${tId} ${numCyborgs}`;
const bombMove = (sId, tId) => `BOMB ${sId} ${tId}`
const incMove = (id) => `INC ${id}`;

/** HANDLE INPUT */
const factories: Factory[] = [];
const adjList = [];
const adjMatrix = [];

const factoryCount: number = parseInt(readline()); // the number of factories

for(let i = 0; i < factoryCount; i++) {
    factories.push(new Factory(i));
    adjList.push([]);
    adjMatrix.push('0'.repeat(factoryCount).split('').map(v=>parseInt(v)));

}


const linkCount: number = parseInt(readline()); // the number of links between factories
for (let i = 0; i < linkCount; i++) {
    var inputs: string[] = readline().split(' ');
    const factory1: number = parseInt(inputs[0]);
    const factory2: number = parseInt(inputs[1]);
    const distance: number = parseInt(inputs[2]);

    adjList[factory1].push([factory2, distance]);
    adjList[factory2].push([factory1, distance]);
    adjMatrix[factory1][factory2] = distance;
    adjMatrix[factory2][factory1] = distance;
}

/** GAME LOOP */
while (true) {
    const troops: Troop[] = [];
    const bombs: Bomb[] = [];
    const entityCount: number = parseInt(readline()); // the number of entities (e.g. factories and troops)
    for (let i = 0; i < entityCount; i++) {
        var inputs: string[] = readline().split(' ');
        const entityId: number = parseInt(inputs[0]);
        const entityType: string = inputs[1];
        const arg1: number = parseInt(inputs[2]);
        const arg2: number = parseInt(inputs[3]);
        const arg3: number = parseInt(inputs[4]);
        const arg4: number = parseInt(inputs[5]);
        const arg5: number = parseInt(inputs[6]);

        if (entityType === 'FACTORY') {
            factories[entityId].update(arg1, arg2, arg3, arg4);
        } else if (entityType === 'TROOP') {
            troops.push(new Troop(entityId, arg1, arg2, arg3, arg4, arg5));
        } else if (entityType === 'BOMB') {
            bombs.push(new Bomb(entityId, arg1, arg2, arg3, arg4));
        }
    }

    const moves = [];
    
    // Move logic

    // 1. If there are any incoming troops, decrease our factories available cyborgs by the troop size
    const enemyTroops = <Troop[]>getEnemy(troops);

    enemyTroops.forEach((troop) => {
        const targetFactory = factories[troop.targetId];

        if (!targetFactory.isFriendly()) return false;
        // Calculate how many cyborgs will be generated by the troops arrival
        const generatedCyborgs = targetFactory.generatedAfterTurns(troop.remainingTurns);

        targetFactory.log(`Incoming attack - T${troop.id},Size=${troop.targetId}`);
        
        if (generatedCyborgs < troop.numCyborgs) {
            // If we will not generate enough troops in time, reserve the necessary number of available troops
            const requiredTroops = troop.numCyborgs - generatedCyborgs;
            targetFactory.numCyborgs -= troop.numCyborgs - generatedCyborgs;
            if (targetFactory.numCyborgs < 0) {
                targetFactory.numCyborgs = 0;
            }
            targetFactory.log(`Reserving ${requiredTroops} troops`);
        }
    });

    // 2. For each friendly factory
    const friendlyFactories = <Factory[]>getFriendly(factories);
    const targetableFactories = <Factory[]>getTargetable(factories);
    const friendlyTroops = <Troop[]>getFriendly(troops);
    
    friendlyFactories.forEach(factory => {
        // 2A - Attempt to attack an opposing factory
        targetableFactories.forEach((target) => {
            // Remove factories that are already under attack
            if (friendlyTroops.find((troop) => troop.targetId === target.id)) return false;

            const distance = adjMatrix[factory.id][target.id];

            // Remove non-adjacent factories
            if (distance === 0) return false; 
            
            const requiredCyborgs = target.numCyborgs + target.production * distance + 1; // TODO - is +1 necessary? Can we control with an even match?
            
            // Remove factories that are too powerful
            if (requiredCyborgs > factory.numCyborgs) return false; 

            // Remove the number of required cyborgs from the factories available cyborgs
            factory.numCyborgs -= requiredCyborgs;

            // Add move
            moves.push(attackMove(factory.id, target.id, requiredCyborgs));
            
            // Add this troop to the troop list to be considered by other factories
            friendlyTroops.push(new Troop(-1, 1, factory.id, target.id, requiredCyborgs, distance));
        });

        // 2B - Attempt to upgrade production
        if (factory.production < 3 && factory.numCyborgs >=10) {
            moves.push(incMove(factory.id));
            factory.numCyborgs-=10;
        }
    })

    // Take turn
    console.log(moves.length?moves.join(';'):'WAIT');
}

/**
 * NOTES,
 * quick enhancement would be to sort our adjency matrix by distance, shorted attacks would be prefered
 * TODO
 * - use bombs
 * - consider enemy bombs
 *  - scatter troops from factories with high cyborg counts?
 * - use factory enhancement more carefully
 *  - consider vulnerability? 
* - send troops to help upgrade where production rate = 0?
 * - support friendlies that are under attack
 * - consider vulnerability when sending troops?
 */
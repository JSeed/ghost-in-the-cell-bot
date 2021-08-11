import { EntityType } from "../entity/Entity";

declare global {
    const readline: any;
}

export const readInitialInput = () => {
    const factoryCount = parseInt(readline());
    const linkCount = parseInt(readline());
    const links: [number,number,number][] = [];
    for(let i = 0; i < linkCount; i++) {
        var inputs: string[] = readline().split(' ');
        const factory1: number = parseInt(inputs[0]);
        const factory2: number = parseInt(inputs[1]);
        const distance: number = parseInt(inputs[2]);
    
        links.push([factory1, factory2, distance]);
    }

    return {
        factoryCount,
        links,
    };
}

export const readTurnInput = () => {
    const entityCount: number = parseInt(readline()); // the number of entities (e.g. factories and troops)
    const entityLines = [];
    for (let i = 0; i < entityCount; i++) {
        var inputs: string[] = readline().split(' ');
        
        entityLines.push({
            entityId: parseInt(inputs[0]),
            entityType: (<any>EntityType)[inputs[1]],
            arg1: parseInt(inputs[2]),
            arg2: parseInt(inputs[3]),
            arg3: parseInt(inputs[4]),
            arg4: parseInt(inputs[5]),
            arg5: parseInt(inputs[6]),
        });
    }

    return { entityCount, entityLines };
}
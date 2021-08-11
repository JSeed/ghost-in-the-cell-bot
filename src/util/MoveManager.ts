
export class MoveManager {

    moves: string[] = [];


    attack(sourceId: number, targetId: number, numCyborgs: number) {
        this.moves.push(`MOVE ${sourceId} ${targetId} ${numCyborgs}`);
    }

    bomb(sourceId: number, targetId: number) {
        this.moves.push(`BOMB ${sourceId} ${targetId}`);
    }

    inc(factoryId: number) {
        this.moves.push(`INC ${factoryId}`);
    }

    makeMoves() {
        console.log(this.moves.length?this.moves.join(';'):'WAIT');
        this.moves = [];
    }

}
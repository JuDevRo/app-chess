import { PieceType, TeamType, Piece, Position, samePosition } from "../Constants"

export default class Referee {
    tileIsEmptyOrOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType) {
        return !this.tileIsOccupied(position, boardState) || this.tileIsOccupiedByOpponent(position, boardState, team)
    }

    tileIsOccupied(position: Position, boardState: Piece[]): boolean {

        const piece = boardState.find((p) => samePosition(p.position, position))
        if(piece) {
            return true
        } else {
            return false
        }
    }

    tileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
        const piece = boardState.find((p) => samePosition(p.position, position) && p.team !== team)
        
        if(piece) {
            return true
        } else {
            return false
        }
    }

    isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {

        const pawnDirection = team === TeamType.OUR ? 1 : -1

        if(type === PieceType.PAWN) {
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
                const piece = boardState.find((p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y + pawnDirection && p.enPassant)
                if(piece){
                    return true
                }
            }
        }
       

        return false
    }

    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {

        if(type === PieceType.PAWN) {
            const specialRow = (team === TeamType.OUR) ? 1 : 6
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1


            //Movimiento
            if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2*pawnDirection) {
                if(!this.tileIsOccupied(desiredPosition, boardState) && !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)) {
                    return true
                }
            } else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection) {
                if(!this.tileIsOccupied(desiredPosition, boardState)) {
                    return true
                }
            }
            //Ataque
            else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
                //Ataque arriba o abajo corner izq
                if(this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
                    return true
                }
            } else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
                //Ataque arriba o abajo corner der
                if(this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
                    return true
                }
            }
        } else if(type === PieceType.KNIGHT) {
            //Logica de movimiento para el caballo
            // Top/Bottom left/right
            for(let i = -1; i < 2; i += 2) {
                for(let j = -1; j < 2; j += 2) {
                    //TOP AND BOTTOM SIDE MOVEMENT
                    if(desiredPosition.y - initialPosition.y === 2 * i) {
                        if(desiredPosition.x - initialPosition.x === j) {
                            if( this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                                return true
                            }
    
                        }
                    }
                    //RIGHT AND LEFT SIDE MOVEMENT
                    if(desiredPosition.x - initialPosition.x === 2 * i) {
                        if(desiredPosition.y - initialPosition.y === j) {
                            if( this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                                return true
                            }
                        }
                    } 
                }
            }
        } else if(type === PieceType.BISHOP) {
            for(let i = 1; i < 8; i++) {
                

                //Up right movement
                if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i}

                    if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true
                        }
                    } else {
                        if(this.tileIsOccupied(passedPosition, boardState)) {
                            break
                        }
                    }                    
                }
    
                //Bottom right movement
                if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y - i}
                    
                    if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true
                        }
                    } else {
                        if(this.tileIsOccupied(passedPosition, boardState)) {
                            break
                        }
                    }          
                }

                //Bottom left movement
                if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y - i}
                    
                    if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true
                        }
                    } else {
                        if(this.tileIsOccupied(passedPosition, boardState)) {
                            break
                        }
                    }
                }          


                //Top left movement
                if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
                    let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y + i}
                    
                    if(passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y){
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                            return true
                        }
                    } else {
                        if(this.tileIsOccupied(passedPosition, boardState)) {
                            break
                        }
                    }          
                }

                
            }
        }

        return false
    }
}
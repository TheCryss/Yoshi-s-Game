import { cordinate, cordinates } from "../Interfaces/interfaces";
import { Nodo } from "./classes";

export function posibleMoviento(pos: cordinate): cordinates{

    let movimientos: cordinates = [];
    let auxCordinatesI: number[][] = [[2, -2], [1, -1]];

    //Posibles movimientos de pos
    let mov1:cordinates = [[pos[0] + auxCordinatesI[0][0], pos[1] + auxCordinatesI[1][0]] , [pos[0] + auxCordinatesI[0][0], pos[1] + auxCordinatesI[1][1]]]; //Cuadrante 1 
    let mov2:cordinates = [[pos[0] + auxCordinatesI[0][1], pos[1] + auxCordinatesI[1][0]] , [pos[0] + auxCordinatesI[0][1], pos[1] + auxCordinatesI[1][1]]]; //Cuadrante 2 
    let mov3:cordinates = [[pos[0] + auxCordinatesI[1][1], pos[1] + auxCordinatesI[0][0]] , [pos[0] + auxCordinatesI[1][1], pos[1] + auxCordinatesI[0][1]]]; //Cuadrante 3 
    let mov4:cordinates = [[pos[0] + auxCordinatesI[1][0], pos[1] + auxCordinatesI[0][0]] , [pos[0] + auxCordinatesI[1][0], pos[1] + auxCordinatesI[0][1]]]; //Cuadrante 4 

    let mov:cordinates = [];
    mov.push(...mov1,...mov2,...mov3,...mov4)
    // mov.push(...mov1)
    mov = mov.filter(pos => {
        return pos[0] >= 0 && pos[0] <= 7 && pos[1] >= 0 && pos[1] <= 7
    })
//  Show matrix of posible movements
/*     let matrix = Array(8).fill(0).map(() => Array(8).fill(0));
    matrix[pos[0]][pos[1]] = 3;
    for (let i = 0; i < mov.length; i++) {
        matrix[mov[i][0]][mov[i][1]] = 2;
    }
    console.log(matrix); */
    
    return mov
} 
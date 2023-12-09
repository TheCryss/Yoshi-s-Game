import { Nodo } from "./classes";
import * as Collections from 'typescript-collections';
import { coordinate, coordinates, matrix } from "../Interfaces/interfaces";

export function posiblesMovientos(pos: coordinate, matriz: matrix): coordinates {
    let auxCoordinatesI: number[][] = [[2, -2], [1, -1]];

    //Posibles movimientos de pos
    let mov1: coordinates = [[pos[0] + auxCoordinatesI[0][0], pos[1] + auxCoordinatesI[1][0]], [pos[0] + auxCoordinatesI[0][0], pos[1] + auxCoordinatesI[1][1]]]; //Cuadrante 1 
    let mov2: coordinates = [[pos[0] + auxCoordinatesI[0][1], pos[1] + auxCoordinatesI[1][0]], [pos[0] + auxCoordinatesI[0][1], pos[1] + auxCoordinatesI[1][1]]]; //Cuadrante 2 
    let mov3: coordinates = [[pos[0] + auxCoordinatesI[1][1], pos[1] + auxCoordinatesI[0][0]], [pos[0] + auxCoordinatesI[1][1], pos[1] + auxCoordinatesI[0][1]]]; //Cuadrante 3 
    let mov4: coordinates = [[pos[0] + auxCoordinatesI[1][0], pos[1] + auxCoordinatesI[0][0]], [pos[0] + auxCoordinatesI[1][0], pos[1] + auxCoordinatesI[0][1]]]; //Cuadrante 4 

    let mov: coordinates = [];
    mov.push(...mov1, ...mov2, ...mov3, ...mov4)
    mov = mov.filter(pos => {
        if (pos[0] >= 0 && pos[0] <= 7 && pos[1] >= 0 && pos[1] <= 7) {
            return (matriz[pos[0]][pos[1]] == 1 || matriz[pos[0]][pos[1]] == 0 || matriz[pos[0]][pos[1]] == 2)
        }
    })

    return mov
}

export function puntuacionMovimiento(movimiento: coordinate, p_monedas: coordinates, p_monedas_especiales: coordinates): number {
    for (let i = 0; i < p_monedas_especiales.length; i++) {
        if (movimiento[0] === p_monedas_especiales[i][0] && movimiento[1] === p_monedas_especiales[i][1]) {
            return 3;
        }
    }

    for (let i = 0; i < p_monedas.length; i++) {
        if (movimiento[0] === p_monedas[i][0] && movimiento[1] === p_monedas[i][1]) {
            return 1;
        }
    }

    return 0;
}

export function heuristica(n_puntosIA: number, n_puntosJugador: number, movimientos: coordinates, p_monedas_especiales: coordinates, p_monedas: coordinates): number {
    let posiblesMonedas = 0

    for (let j = 0; j < movimientos.length; j++) {
        for (let i = 0; i < p_monedas_especiales.length; i++) {
            if (movimientos[j][0] === p_monedas_especiales[i][0] && movimientos[j][1] === p_monedas_especiales[i][1]) {
                posiblesMonedas++;
            }
        }
    }

    for (let j = 0; j < movimientos.length; j++) {
        for (let i = 0; i < p_monedas.length; i++) {
            if (movimientos[j][0] === p_monedas[i][0] && movimientos[j][1] === p_monedas[i][1]) {
                posiblesMonedas++;
            }
        }
    }

    return n_puntosIA - n_puntosJugador ;
}

function juego_terminado(p_monedas_normales: coordinates, p_monedas_especiales: coordinates) {
    return (p_monedas_especiales.length === 0 && p_monedas_normales.length === 0);
}

export function ganador(n_puntosIA: number, n_puntosJugador: number): number {
    return (n_puntosIA > n_puntosJugador) ? 3 : 4;
}

export function obtenerDificultad(dificultad: string): number {
    switch (dificultad) {
        case "Facil":
            return 2;
        case "Intermedio":
            return 4;
        case "Dificil":
            return 6;
    }
    return 0;
}

function eliminarMoneda(pos: coordinate, p_monedas: coordinates): coordinates {
    return p_monedas.filter((moneda) => {
        return !(moneda[0] === pos[0] && moneda[1] === pos[1]);
    })
}

export function minimax(matrix: matrix, p_monedas: coordinates, p_monedas_especiales: coordinates, p_jugadores: coordinates, dificultad_juego: string = "Facil") {

    function crearArbol() {
        let NodoRaiz = new Nodo(null, p_jugadores[1], p_jugadores[0], 0, 0, p_monedas, p_monedas_especiales, "MAX", -Infinity, 0);
        let pila = new Collections.Stack<Nodo>();
        let cola = new Collections.Queue<Nodo>();
        let profundidad = 0;
        pila.push(NodoRaiz);
        let dificultad = obtenerDificultad(dificultad_juego);
        while (profundidad < dificultad) {
            // if (juego_terminado(p_monedas, p_monedas_especiales)) {
            //     let utilidad;
            //     if (ganador(NodoRaiz.p_IA, NodoRaiz.p_Jugador) == 3) {
            //         utilidad = 1000;
            //     } else {
            //         utilidad = -1000;
            //     }

            //     NodoRaiz.setUtilidad(utilidad);
            //     break;
            // }
            profundidad++
            while (!pila.isEmpty()) {
                let nodoActual = pila.pop()
                if (nodoActual) {
                    let pos_monedas = nodoActual.getPosicionesMonedas();
                    let pos_monedas_especiales = nodoActual.getPosicionesMonedasEspeciales();
                    let movs = posiblesMovientos(nodoActual.getPosicion(nodoActual.getTipo()), matrix)
                    for (let mov of movs) {
                        let p_mov = puntuacionMovimiento(mov, pos_monedas, pos_monedas_especiales)
                        let new_p_monedas: coordinates
                        let new_p_monedas_esp: coordinates
                        switch (p_mov) {
                            case 1:
                                new_p_monedas = eliminarMoneda(mov, pos_monedas)
                                new_p_monedas_esp = pos_monedas_especiales
                                break;
                            case 3:
                                new_p_monedas_esp = eliminarMoneda(mov, pos_monedas_especiales)
                                new_p_monedas = pos_monedas
                                break;
                            default:
                                new_p_monedas = pos_monedas
                                new_p_monedas_esp = pos_monedas_especiales
                                break;
                        }
                        let puntuacion = p_mov + (nodoActual.padre?.getPuntuacion(nodoActual.getTipo()) ?? 0)
                        if (profundidad == dificultad) {
                            switch (nodoActual.getTipo()) {

                                case "MIN":
                                    let utilidad2 = heuristica(nodoActual.p_IA, nodoActual.p_Jugador + puntuacion, posiblesMovientos(mov, matrix), new_p_monedas_esp, new_p_monedas)
                                    cola.enqueue(new Nodo(nodoActual, nodoActual.pos_IA,mov, profundidad, utilidad2, new_p_monedas, new_p_monedas_esp, nodoActual.getTipoContrario(), utilidad2, puntuacion, nodoActual.p_IA))
                                    break;
                            }
                        }
                        else {
                            switch (nodoActual.getTipo()) {
                                case "MAX":
                                    cola.enqueue(new Nodo(nodoActual, mov, nodoActual.pos_PJ, profundidad, 0, new_p_monedas, new_p_monedas_esp, nodoActual.getTipoContrario(), Infinity, nodoActual.p_Jugador, puntuacion))
                                    break;
                                case "MIN":
                                    cola.enqueue(new Nodo(nodoActual, nodoActual.pos_IA, mov, profundidad, 0, new_p_monedas, new_p_monedas_esp, nodoActual.getTipoContrario(), -Infinity, puntuacion, nodoActual.p_IA))
                                    break;
                            }
                        }
                    }




                }

            }
            // console.log("-------------------");

            while (!cola.isEmpty()) {
                let nodo = cola.dequeue()
                if (nodo) {
                    pila.push(nodo);
                    // console.log(nodo);

                }
            }

        }


        function calcularUtilidad() {
            // let maxUtilidad = -Infinity;
            while (!pila.isEmpty()) {
                let nodo = pila.pop();
                if (nodo) {
                    // console.log(nodo);
                    let nodoPadre = nodo?.getPadre();
                    if (nodoPadre) {
                        switch (nodoPadre.getTipo()) {
                            case "MAX":

                                if (nodoPadre.getUtilidad() < nodo.getUtilidad()) {
                                    // console.log("MAX")

                                    nodoPadre.setUtilidad(nodo.getUtilidad());
                                    nodoPadre.setMejorMov(nodo.getPosicion("MAX"));
                                    // console.log(nodoPadre);

                                }
                                break;
                            case "MIN":
                                if (nodoPadre.getUtilidad() > nodo.getUtilidad()) {
                                    nodoPadre.setUtilidad(nodo.getUtilidad());
                                    nodoPadre.setMejorMov(nodo.getPosicion("MIN"));
                                    // console.log(nodoPadre);

                                }
                                break;
                        }
                        pila.add(nodoPadre);
                    } 

                }
                // if (nodo) {
                //     maxUtilidad = Math.max(maxUtilidad, nodo.getUtilidad());
                //     // console.log(nodo);

                // }
                // if (nodoPadre && nodo) {
                //     if (nodoPadre?.getTipo() == "MAX") {
                //         if (nodoPadre.getUtilidad() < nodo.getUtilidad()) {
                //             if (nodoPadre.getProfundidad() == 0) {
                //                 nodoPadre.setMejorMov(nodo.getPosicion("MAX"));
                //             }
                //             nodoPadre.setUtilidad(nodo.getUtilidad());

                //         } else if (nodoPadre.getUtilidad() == nodo.getUtilidad()) {
                //             // If utilities are equal, choose randomly
                //             if (Math.random() < 0.5) {
                //                 if (nodoPadre.getProfundidad() == 0) {
                //                     nodoPadre.setMejorMov(nodo.getPosicion("MAX"));
                //                 }
                //                 nodoPadre.setUtilidad(nodo.getUtilidad());
                //             }
                //         }

                //     } else {
                //         if (nodoPadre.getUtilidad() > nodo.getUtilidad()) {
                //             nodoPadre.setUtilidad(nodo.getUtilidad());
                //         }
                //     }
                // }
            }
            console.log("-------------------");
            // console.log(NodoRaiz);

            // console.log(maxUtilidad);

        }
        calcularUtilidad();

        return NodoRaiz.mejor_mov;
    }
    let best_mov = crearArbol();
    return best_mov;
}

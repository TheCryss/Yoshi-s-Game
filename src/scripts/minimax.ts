import { Nodo } from "./classes";
import * as Collections from 'typescript-collections';
import { coordinate, coordinates, matrix } from "../Interfaces/interfaces";

export function posibleMoviento(pos: coordinate): coordinates {
    let auxCoordinatesI: number[][] = [[2, -2], [1, -1]];

    //Posibles movimientos de pos
    let mov1: coordinates = [[pos[0] + auxCoordinatesI[0][0], pos[1] + auxCoordinatesI[1][0]], [pos[0] + auxCoordinatesI[0][0], pos[1] + auxCoordinatesI[1][1]]]; //Cuadrante 1 
    let mov2: coordinates = [[pos[0] + auxCoordinatesI[0][1], pos[1] + auxCoordinatesI[1][0]], [pos[0] + auxCoordinatesI[0][1], pos[1] + auxCoordinatesI[1][1]]]; //Cuadrante 2 
    let mov3: coordinates = [[pos[0] + auxCoordinatesI[1][1], pos[1] + auxCoordinatesI[0][0]], [pos[0] + auxCoordinatesI[1][1], pos[1] + auxCoordinatesI[0][1]]]; //Cuadrante 3 
    let mov4: coordinates = [[pos[0] + auxCoordinatesI[1][0], pos[1] + auxCoordinatesI[0][0]], [pos[0] + auxCoordinatesI[1][0], pos[1] + auxCoordinatesI[0][1]]]; //Cuadrante 4 

    let mov: coordinates = [];
    mov.push(...mov1, ...mov2, ...mov3, ...mov4)
    mov = mov.filter(pos => {
        return pos[0] >= 0 && pos[0] <= 7 && pos[1] >= 0 && pos[1] <= 7
    })

    return mov
}

export function utilidadMovimiento(movimiento: coordinate, p_monedas: coordinates, p_monedas_especiales: coordinates): number {
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

export function heuristica(n_puntosIA: number, n_puntosJugador: number): number {
    return n_puntosIA - n_puntosJugador;
}

export function terminar(n_puntosIA: number, n_puntosJugador: number): boolean {
    return ((n_puntosIA + n_puntosJugador) == 24)
}

export function ganador(n_puntosIA: number, n_puntosJugador: number): number {
    return (n_puntosIA > n_puntosJugador) ? 3 : 4;
}

export function obtenerDificultad(dificultad:string): number {
    switch(dificultad) {
        case "Facil":
            return 2;
        case "Intermedio":
            return 4;
        case "hard":
            return 6;
    }
    return 0;
}

export function minimax(matrix: matrix, p_monedas: coordinates, p_monedas_especiales: coordinates, p_disponibles: coordinates, p_jugadores: coordinates, dificultad_juego: string = "Facil") {

    function crearArbol() {
        let NodoRaiz = new Nodo(null, p_jugadores, 0, 0, p_monedas, p_monedas_especiales, "MAX", -Infinity, 0);
        let pila = new Collections.Stack<Nodo>();
        let cola = new Collections.Queue<Nodo>();
        let profundidad = 0;
        pila.push(NodoRaiz);
        let dificultad = obtenerDificultad(dificultad_juego); //Cambiar esto para cambiar la dificultad/profundidad del arbol
        while (profundidad < dificultad) {
            profundidad++
            while (!pila.isEmpty()) {
                let nodoActual = pila.pop()
                if (nodoActual?.tipo == "MAX") {
                    let movimientos = posibleMoviento(nodoActual.getPosicion("MAX"))
                    for (let movimiento of movimientos) {
                        let puntuacion = utilidadMovimiento(movimiento, p_monedas, p_monedas_especiales) + (nodoActual.padre?.p_IA ?? 0)
                        if (profundidad == dificultad) {
                            let utilidad = heuristica(nodoActual.p_IA + puntuacion, nodoActual.p_Jugador)
                            cola.enqueue(new Nodo(nodoActual, [nodoActual.getPosicion("MIN"), movimiento], profundidad, 0, p_monedas, p_monedas_especiales, "MIN", utilidad, nodoActual.p_Jugador, puntuacion))
                        } else {
                            cola.enqueue(new Nodo(nodoActual, [nodoActual.getPosicion("MIN"), movimiento], profundidad, 0, p_monedas, p_monedas_especiales, "MIN", Infinity, nodoActual.p_Jugador, puntuacion))
                        }
                    }
                } else if (nodoActual?.tipo == "MIN") {
                    let movimientos = posibleMoviento(nodoActual?.getPosicion("MIN"))
                    for (let movimiento of movimientos) {
                        let puntuacion = utilidadMovimiento(movimiento, p_monedas, p_monedas_especiales) + (nodoActual.padre?.p_Jugador ?? 0)
                        if (profundidad == dificultad) {
                            let utilidad = heuristica(nodoActual.p_IA, nodoActual.p_Jugador + puntuacion)
                            cola.enqueue(new Nodo(nodoActual, [movimiento, nodoActual.getPosicion("MAX")], profundidad, 0, p_monedas, p_monedas_especiales, "MAX", utilidad, puntuacion, nodoActual.p_IA))
                        } else {
                            cola.enqueue(new Nodo(nodoActual, [movimiento, nodoActual.getPosicion("MAX")], profundidad, 0, p_monedas, p_monedas_especiales, "MAX", -Infinity, puntuacion, nodoActual.p_IA))
                        }
                    }
                }
            }
            while (!cola.isEmpty()) {
                let nodo = cola.dequeue()
                pila.push(nodo as Nodo)
            }
        }

        function calcularUtilidad() {
            while (!pila.isEmpty()) {
                let nodo = pila.pop();
                let nodoPadre = nodo?.getPadre();
                pila.add(nodoPadre as Nodo);

                if (nodoPadre && nodo) {
                    if (nodoPadre?.getTipo() == "MAX") {
                        if (nodoPadre.getUtilidad() < nodo.getUtilidad()) {
                            if (nodoPadre.getProfundidad() == 0) {
                                nodoPadre.setMejorMov(nodo.getPosicion("MAX"));
                            }
                            nodoPadre.setUtilidad(nodo.getUtilidad());

                        }
                    } else {
                        if (nodoPadre.getUtilidad() > nodo.getUtilidad()) {
                            nodoPadre.setUtilidad(nodo.getUtilidad());
                        }
                    }
                }

            }
        }
        calcularUtilidad();
        return NodoRaiz.mejor_mov;
    }
    let best_mov = crearArbol();
    console.log(best_mov);
    return best_mov;

}

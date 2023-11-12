interface Nodo{
    padre: Nodo;
    posicion: Array<{x_pos: number, y_pos: number}>
    profundidad: number;
    heuristica: number;
    posiciones_monedas: Array<{x_pos: number, y_pos: number}>;
}
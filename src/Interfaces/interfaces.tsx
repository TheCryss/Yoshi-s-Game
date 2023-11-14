export interface Nodo{
    padre: Nodo | null;
    posicion: cordinates;
    profundidad: number;
    heuristica: number;
    posiciones_monedas: cordinates;
    tipo: string;
    utilidad: number;

    // getPosicion(): cordinates;
    // getProfundidad(): number;
    // getHeuristica(): number;
    // getPosicionesMonedas(): cordinates;
    // getTipo(): string;
    // getPadre(): Nodo | null;
    // getUtilidad(): number;

    // setUtilidad(utilidad: number): void;
}
export type cordinate_exp = {x_pos: number, y_pos: number};
export type cordinate = [number, number];
export type cordinates = cordinate[]
export type matrix = number[][];
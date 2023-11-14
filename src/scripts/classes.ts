import { Nodo as NodoInterface , cordinate_exp, matrix, cordinate,cordinates} from "../Interfaces/interfaces";

export class Nodo implements NodoInterface {
    padre: Nodo | null;
    posicion: cordinates;
    profundidad: number;
    heuristica: number;
    posiciones_monedas: cordinates;
    tipo: string;
    utilidad: number;   

    constructor(padre:Nodo | null, posicion:cordinates, profundidad:number, heuristica:number, posiciones_monedas:cordinates, tipo:string, utilidad:number) {
        this.padre = padre;
        this.posicion = posicion;
        this.profundidad = profundidad;
        this.heuristica = heuristica;
        this.posiciones_monedas = posiciones_monedas;
        this.tipo = tipo;
        this.utilidad = utilidad;
    }

    getPadre(): Nodo | null {
        return this.padre;
    }

    getPosicion(): cordinates {
        return this.posicion;
    }

    getProfundidad(): number {
        return this.profundidad;
    }

    getHeuristica(): number {
        return this.heuristica;
    }

    getPosicionesMonedas(): cordinates {
        return this.posiciones_monedas;
    }

    getTipo(): string {
        return this.tipo;
    }

    getUtilidad(): number {
        return this.utilidad;
    }

    setUtilidad(utilidad: number): void {
        this.utilidad = utilidad;
    }

    getPosicionIA(): cordinate {
        return this.posicion[1];
    }
    
    getPosicionPJ(): cordinate {
        return this.posicion[0];
    }
}
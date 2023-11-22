import { Nodo as NodoInterface , cordinate_exp, matrix, cordinate,cordinates} from "../Interfaces/interfaces";

export class Nodo implements NodoInterface {
    padre: Nodo | null;
    posicion: cordinates;
    profundidad: number;
    heuristica: number;
    posiciones_monedas: cordinates;
    posiciones_monedas_especiales: cordinates;
    tipo: string;
    utilidad: number;   
    p_Jugador:number;
    p_IA:number;
    mejor_mov: cordinate | null;

    constructor(padre:Nodo | null, posicion:cordinates, profundidad:number, heuristica:number, posiciones_monedas:cordinates,posiciones_monedas_especiales:cordinates, tipo:string, utilidad:number,p_Jugador:number = 0,p_IA:number =0) {
        this.padre = padre;
        this.posicion = posicion;
        this.profundidad = profundidad;
        this.heuristica = heuristica;
        this.posiciones_monedas = posiciones_monedas;
        this.posiciones_monedas_especiales = posiciones_monedas_especiales;
        this.tipo = tipo;
        this.utilidad = utilidad;
        this.p_Jugador = p_Jugador;
        this.p_IA = p_IA;
        this.mejor_mov = null;
    }

    getPadre(): Nodo | null {
        return this.padre;
    }

    setMejorMov(movimiento: cordinate): void {
        this.mejor_mov = movimiento;
    }

    getPosicion(tipo:String): cordinate {
        if(tipo == "MAX"){
            return this.posicion[1];
        }else{
            return this.posicion[0];

        }
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

    getPosicionesMonedasEspeciales(): cordinates {
        return this.posiciones_monedas_especiales;
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



}
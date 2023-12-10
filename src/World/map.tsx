import { useEffect, useState } from 'react';
import { coordinate, matrix, coordinates } from '../Interfaces/interfaces';
import { minimax, posiblesMovientos } from '../scripts/minimax';

interface MapaProps {
  difficulty: 'Facil' | 'Intermedio' | 'Dificil' | undefined;
}

let puntos_verde = 0;
let puntos_rojo = 0;
const divsConListeners: { div: HTMLElement; eventHandler: any; }[] = [];

// Función que retorna el índice de un vector en una matriz (array de arrays)
// Ej. matriz = [[1,2],[3,4]] vector = [3,4] retorna 1
function indiceSubArray(matriz: coordinates, vector: coordinate) {
  return matriz.findIndex((e) => e[0] === vector[0] && e[1] === vector[1]);
}

// Función que retorna true si un vector está en una matriz (array de arrays)
// Ej. matriz = [[1,2],[3,4]] vector = [3,4] retorna true
function existeSubArray(matriz: coordinates, vector: coordinate) {
  return matriz.some((e) => e[0] === vector[0] && e[1] === vector[1]);
}

// Funcion que retorna true si existe un vector en una matriz cuyo primer elemento es igual al primer elemento del vector parámetro
// Ej. matriz = [[1,2],[3,4]] vector = [3,4] retorna true
function existeSubArrayConPrimerElementoIgual(matriz: coordinates, vector: coordinate) {
  return matriz.some((e) => e[0] === vector[0]);
}

function juego_terminado(p_monedas_normales: coordinates, p_monedas_especiales: coordinates) {
  return (p_monedas_especiales.length === 0 && p_monedas_normales.length === 0);
}

function animar_movimiento(posicion_inicial: coordinate, posicion_final: coordinate, matriz: matrix, p_jugadores: coordinates, tipo_moneda: string) {
  const posicion_inicial_x = posicion_inicial[0];
  const posicion_inicial_y = posicion_inicial[1];
  const posicion_final_x = posicion_final[0];
  const posicion_final_y = posicion_final[1];
  const posicion_inicial_div = document.getElementById(`cell ${posicion_inicial_x}-${posicion_inicial_y}`);
  const posicion_final_div = document.getElementById(`cell ${posicion_final_x}-${posicion_final_y}`);
  const posicion_inicial_div_child = posicion_inicial_div?.firstChild;
  const posicion_final_div_child = posicion_final_div?.firstChild;
  if (posicion_inicial_div_child && posicion_final_div_child) {
      posicion_inicial_div.removeChild(posicion_inicial_div_child);
      posicion_final_div.removeChild(posicion_final_div_child);  
      const image = document.createElement('img');
      image.setAttribute('src', '../src/assets/elementos_juego/monedas/invisible.png');
      image.setAttribute('width', '60%');
      posicion_inicial_div.appendChild(image);
      posicion_final_div.appendChild(posicion_inicial_div_child);
  } 
  //console.log(`fue de ${posicion_inicial_x}-${posicion_inicial_y} a ${posicion_final_x}-${posicion_final_y}`);
  //console.log(matriz)
}

function actualizar_matriz(matriz: matrix, p_jugadores: coordinates, p_monedas_normales: coordinates, p_monedas_especiales: coordinates, mejor_jugada: coordinate, jugador: number) {
  const indiceMoneda = indiceSubArray(p_monedas_normales, mejor_jugada);
  const indiceMonedaEspecial = indiceSubArray(p_monedas_especiales, mejor_jugada);
  const p_jugador = jugador === 3 ? 1 : 0;
  animar_movimiento(p_jugadores[p_jugador], mejor_jugada, matriz, p_jugadores, 'normal');
  matriz[mejor_jugada[0]][mejor_jugada[1]] = jugador;
  if (indiceMoneda !== -1) {
    jugador === 3 ? puntos_verde++ : puntos_rojo++;
    p_monedas_normales.splice(indiceMoneda, 1);
    matriz[mejor_jugada[0]][mejor_jugada[1]] = 5;
  } else if (indiceMonedaEspecial !== -1) {
    jugador === 3 ? puntos_verde += 3 : puntos_rojo += 3;
    p_monedas_especiales.splice(indiceMonedaEspecial, 1);
    matriz[mejor_jugada[0]][mejor_jugada[1]] = 5; 
  }
  if(matriz[p_jugadores[p_jugador][0]][p_jugadores[p_jugador][1]] !== 5){
    matriz[p_jugadores[p_jugador][0]][p_jugadores[p_jugador][1]] = 0;
  }  
  p_jugadores[p_jugador] = mejor_jugada;  
  const h3_puntaje_jugador = document.getElementById(jugador === 3 ? 'verde' : 'rojo');
  if(h3_puntaje_jugador){
    h3_puntaje_jugador.innerHTML = jugador === 3 ? `verde: ${puntos_verde}` : `rojo: ${puntos_rojo}`;
  }
}

function turnoIA(matriz: matrix, p_monedas_normales: coordinates, p_monedas_especiales: coordinates, p_jugadores: coordinates, dificultad: 'Facil' | 'Intermedio' | 'Dificil' | undefined) {
  if (juego_terminado(p_monedas_normales, p_monedas_especiales)) {
    if(puntos_verde > puntos_rojo){
      console.log('Gano VERDE');
    } else if(puntos_verde < puntos_rojo){
      console.log('Gano ROJO');
    }
    return;
  } else {
    const mejor_jugada = minimax(matriz, p_monedas_normales, p_monedas_especiales, p_jugadores,puntos_rojo, puntos_verde,dificultad);
    if(mejor_jugada === null){ return; }
    actualizar_matriz(matriz, p_jugadores, p_monedas_normales, p_monedas_especiales, mejor_jugada, 3);
    turnoHumano(matriz, p_monedas_normales, p_monedas_especiales, p_jugadores, dificultad);
  } 
}

function turnoHumano(matriz: matrix, p_monedas_normales: coordinates, p_monedas_especiales: coordinates,  p_jugadores: coordinates, dificultad: 'Facil' | 'Intermedio' | 'Dificil' | undefined){
  if (juego_terminado(p_monedas_normales, p_monedas_especiales)) {
    if(puntos_verde > puntos_rojo){
      console.log('Gano VERDE');
    } else if(puntos_verde < puntos_rojo){
      console.log('Gano ROJO');
    }
    return;
  } else {
    const movimientos = posiblesMovientos(p_jugadores[0], matriz);
    console.log(movimientos);
    for (let i = 0; i < movimientos.length; i++) {
      agregarClickListenerADivs(`cell ${movimientos[i][0]}-${movimientos[i][1]}`, matriz, p_monedas_normales, p_monedas_especiales, p_jugadores, dificultad);
    }
  }
}

function agregarClickListenerADivs(divId: string, matriz: matrix, p_monedas_normales: coordinates, p_monedas_especiales: coordinates, p_jugadores: coordinates, dificultad: 'Facil' | 'Intermedio' | 'Dificil' | undefined) {
  const div = document.getElementById(divId);
  if (div) {
    div.className = 'clickable';
    function handleClick() {
      console.log('click')
      div ? div.removeEventListener('click', handleClick) : null;
      div ? div.className = '' : null;
      eliminarEventListenersDeDivs();
      const jugada = divId.split(' ')[1].split('-').map(e => parseInt(e));
      actualizar_matriz(matriz, p_jugadores, p_monedas_normales, p_monedas_especiales, (jugada as coordinate), 4);      
      setTimeout(() => {
        turnoIA(matriz, p_monedas_normales, p_monedas_especiales, p_jugadores, dificultad);
      }, 2000);
    }
    div.addEventListener('click', handleClick);
    divsConListeners.push({ div, eventHandler: handleClick });
  }
}

function eliminarEventListenersDeDivs() {
  divsConListeners.forEach(({ div, eventHandler }) => {
    div.removeEventListener('click', eventHandler);
    div.className = '';
  });

  // Limpiar la lista de divs con event listeners
  divsConListeners.length = 0;
}

const Map: React.FC<MapaProps> = ({ difficulty }) => {
  let matrizYaFueCreada = false;
  let matrizYaFueDibujada = false;
  let matriz_juego: matrix = Array(8).fill(0).map(() => Array(8).fill(0));
  let posicionMonedasNormales: coordinates = [[0, 0], [0, 7], [7, 0], [7, 7], [1, 0], [0, 1], [1, 7], [7, 1], [6, 0], [0, 6], [6, 7], [7, 6]];
  let posicionMonedasEspeciales: coordinates = [[3, 3], [3, 4], [4, 3], [4, 4]];
  let posicionesDisponibles: coordinates = [];
  let posicionJugadores: coordinates = [];
  function generarMatriz() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (existeSubArray(posicionMonedasNormales, [i, j])) {
          matriz_juego[i][j] = 1;
        } else if (existeSubArray(posicionMonedasEspeciales, [i, j])) {
          matriz_juego[i][j] = 2;
        } else {
          posicionesDisponibles.push([i, j]);
        }
      }
    }
    let posicionesAleatorias = 0;
     while (posicionesAleatorias < 2) {
       // posicionJugadores = [[posicion yoshi rojo], [posicion yoshi verde]]]
       const randomIndex = Math.floor(Math.random() * posicionesDisponibles.length);
       const randomPosition = posicionesDisponibles[randomIndex];
       posicionesAleatorias == 1 ? matriz_juego[randomPosition[0]][randomPosition[1]] = 3 : matriz_juego[randomPosition[0]][randomPosition[1]] = 4;
       posicionesAleatorias++;
       posicionJugadores.push(randomPosition);
       posicionesDisponibles.splice(randomIndex, 1);
    }
    matrizYaFueCreada = true;
  }


  useEffect(() => {
    if (!matrizYaFueCreada) {
      generarMatriz();
    }
    const container = document.getElementById('seccion-medio');
    if (container && document.getElementById('cell 0-0') === null) {
      for (let i = 0; i < 8; i++) {
        const row = document.createElement('div');
        row.setAttribute('id', 'row');
        row.style.display = 'table-row';
        container.appendChild(row);
        for (let j = 0; j < 8; j++) {
          const div = document.createElement('div');
          div.style.border = '1px dashed #9e9c9c';
          div.style.display = 'table-cell';
          div.style.textAlign = 'center';
          div.style.position = 'relative';
          div.style.width = '12.5%';
          if (matriz_juego[i][j] === 0) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/invisible.png');
            image.setAttribute('width', '55%');
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 1) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/normal.gif');
            image.setAttribute('width', '40%');
            image.setAttribute('top', '50%');
            existeSubArrayConPrimerElementoIgual(posicionJugadores, [i, j]) ? image.style.transform = 'translateY(-40%)' : image.style.transform = 'translateY(-20%)'
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 2) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/especial.gif');
            image.setAttribute('width', '50%');
            image.setAttribute('top', '50%');
            image.style.alignItems = 'center';
            existeSubArrayConPrimerElementoIgual(posicionJugadores, [i, j]) ? image.style.transform = 'translateY(-10%)' : image.style.transform = 'translateY(5%)'
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 3) {
            const image = document.createElement('img');
            if (j < 4) {
              image.setAttribute('src', '../src/assets/elementos_juego/green/idle/1.png');
            } else {
              image.setAttribute('src', '../src/assets/elementos_juego/green/idle/2.png');
            }
            image.setAttribute('width', '60%');
            image.setAttribute('height', 'auto');
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 4) {
            const image = document.createElement('img');
            if (j < 4) {
              image.setAttribute('src', '../src/assets/elementos_juego/red/idle/1.png');
            } else {
              image.setAttribute('src', '../src/assets/elementos_juego/red/idle/2.png');
            }
            image.setAttribute('width', '60%');
            image.setAttribute('height', 'auto');
            div.appendChild(image);
          }
          div.setAttribute('id', `cell ${i}-${j}`);
          row.appendChild(div);
        }
      }
      if(!matrizYaFueDibujada){
        matrizYaFueDibujada = true;
        setTimeout(() => {
          turnoIA(matriz_juego, posicionMonedasNormales, posicionMonedasEspeciales, posicionJugadores, difficulty);
        }, 2000);
      }
    }
  }, []);

  return (
    <>
      <div id="contenedor">
        <div id="mapa">
          <div id="seccion-izquierda"></div>
          <div id="seccion-centro">
            <div id="seccion-medio"></div>
          </div>
          <div id="seccion-derecha"></div>
        </div>
        <div id="puntuacion" className=''>
          <h3 id='dificultad'>{difficulty?.toUpperCase()}</h3>
          <br></br>
          <br></br>
          <h3 id='turno'>turno de: verde</h3>
          <br></br>
          <h3 id='rojo'>rojo: {puntos_rojo}</h3>
          <h3 id='verde'>verde: {puntos_verde}</h3>
          <button id='exit' onClick={() => window.location.reload()}>salir</button>   
        </div>
      </div>
    </>
  );
}

export default Map;

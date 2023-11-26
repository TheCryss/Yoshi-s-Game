import { useEffect } from 'react';
import { coordinate, matrix, coordinates } from '../Interfaces/interfaces';
import { minimax } from '../scripts/minimax';

interface MapaProps {
  difficulty: 'Facil' | 'Intermedio' | 'Dificil' | undefined;
}

const Map: React.FC<MapaProps> = ({ difficulty }) => {
  let matrizYaFueCreada = false;

  function buscarEnLista(lista: coordinates, elemento: coordinate) {
    return lista.some((e) => e[0] === elemento[0] && e[1] === elemento[1]);
  }

  function buscarEnFila(lista: coordinates, elemento: coordinate) {
    return lista.some((e) => e[0] === elemento[0]);
  }

  let matriz_juego: matrix = Array(8).fill(0).map(() => Array(8).fill(0));
  let posicionMonedasNormales: coordinates = [[0, 0], [0, 7], [7, 0], [7, 7], [1, 0], [0, 1], [1, 7], [7, 1], [6, 0], [0, 6], [6, 7], [7, 6]];
  let posicionMonedasEspeciales: coordinates = [[3, 3], [3, 4], [4, 3], [4, 4]];
  let posicionesDisponibles: coordinates = [];
  let posicionJugadores: coordinates = [];
  function generarMatriz() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (buscarEnLista(posicionMonedasNormales, [i, j])) {
          matriz_juego[i][j] = 1;
        } else if (buscarEnLista(posicionMonedasEspeciales, [i, j])) {
          matriz_juego[i][j] = 2;
        } else {
          posicionesDisponibles.push([i, j]);
        }
      }
    }
    let posicionesAleatorias = 0;
    while (posicionesAleatorias < 2) {
      //Primera posicion Jugador Rojo y segunda posicion Jugador Verde IA
      const randomIndex = Math.floor(Math.random() * posicionesDisponibles.length);
      const randomPosition = posicionesDisponibles[randomIndex];
      posicionesAleatorias == 1 ? matriz_juego[randomPosition[0]][randomPosition[1]] = 3 : matriz_juego[randomPosition[0]][randomPosition[1]] = 4;
      posicionesAleatorias++;
      posicionJugadores.push(randomPosition);
      posicionesDisponibles.splice(randomIndex, 1);
    }
    matrizYaFueCreada = true;
    //------------------------Prueba Minimax------------------------
    minimax(matriz_juego, posicionMonedasNormales, posicionMonedasEspeciales, posicionesDisponibles, posicionJugadores, difficulty)
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
          // div.style.border = '1px dashed #9e9c9c';
          div.style.display = 'table-cell';
          div.style.textAlign = 'center';
          div.style.position = 'relative';
          div.style.width = '12.5%';
          matriz_juego[i][j] === 0 ? div.style.paddingTop = '10.5%' : div.style.paddingTop = '0%';
          if (matriz_juego[i][j] === 1) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/normal.gif');
            image.setAttribute('width', '40%');
            buscarEnFila(posicionJugadores, [i, j]) ? div.style.transform = 'translateY(-10%)' : div.style.transform = 'translateY(10%)'
            div.appendChild(image);
          } else if (matriz_juego[i][j] === 2) {
            const image = document.createElement('img');
            image.setAttribute('src', '../src/assets/elementos_juego/monedas/especial.gif');
            image.setAttribute('width', '50%');
            image.setAttribute('height', 'auto');
            image.style.alignItems = 'center';
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
          <h3 id='rojo'>rojo: 0</h3>
          <h3 id='verde'>verde: 0</h3>
          <button id='exit' onClick={() => window.location.reload()}>salir</button>   
        </div>
      </div>
    </>
  );
}

export default Map;

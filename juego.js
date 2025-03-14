// =====================================
// VARIABLES GLOBALES DEL JUEGO DE DUELO
// =====================================
let juegoActivo = false;
let jugadorActual = 1; // 1 = Jugador 1, 2 = Jugador 2
let puntuacionJ1 = 0;
let puntuacionJ2 = 0;
let posicionJ1 = { x: 0, y: 0 };
let posicionJ2 = { x: 0, y: 0 };
let radioJugador = 10; // Radio para detectar impactos
let turnosRestantes = 6; // Cada jugador tiene 3 turnos
let impactoLogrado = false;

// =====================================
// ELEMENTOS DEL DOM PARA EL JUEGO
// =====================================

// Creación de botones de juego
const botonIniciarJuego = document.createElement('button');
botonIniciarJuego.id = 'boton_iniciar_juego';
botonIniciarJuego.className = 'btn btn-info me-2';
botonIniciarJuego.textContent = 'Iniciar Duelo';

const botonSalirJuego = document.createElement('button');
botonSalirJuego.id = 'boton_salir_juego';
botonSalirJuego.className = 'btn btn-dark d-none';
botonSalirJuego.textContent = 'Salir del Duelo';

// Añadir botones a la interfaz existente
document.querySelector('.mb-3:has(#boton_inicio)').appendChild(botonIniciarJuego);
document.querySelector('.mb-3:has(#boton_inicio)').appendChild(botonSalirJuego);

// Creación del panel de juego
const contenedorJuego = document.createElement('div');
contenedorJuego.className = 'mb-3';
contenedorJuego.innerHTML = `
  <hr>
  <h5>Duelo de Proyectiles</h5>
  <div id="panelJuego" style="display: none;">
    <div class="alert alert-info" id="infoTurno">Turno del Jugador 1</div>
    <div class="row mb-2">
      <div class="col">
        <span class="badge bg-primary fs-6">Jugador 1: <span id="puntosJ1">0</span></span>
      </div>
      <div class="col">
        <span class="badge bg-danger fs-6">Jugador 2: <span id="puntosJ2">0</span></span>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <span class="badge bg-secondary fs-6">Turnos restantes: <span id="turnosRestantes">6</span></span>
      </div>
    </div>
  </div>
`;

// Insertar el panel de juego en la columna izquierda
document.querySelector('.col-md-2').appendChild(contenedorJuego);

// Referenciar elementos del DOM
const panelJuego = document.getElementById('panelJuego');
const infoTurno = document.getElementById('infoTurno');
const puntosJ1 = document.getElementById('puntosJ1');
const puntosJ2 = document.getElementById('puntosJ2');
const spanTurnosRestantes = document.getElementById('turnosRestantes');

// =====================================
// FUNCIONES PRINCIPALES DEL JUEGO
// =====================================

// Función para iniciar el duelo
function iniciarDuelo() {
  juegoActivo = true;
  jugadorActual = 1;
  puntuacionJ1 = 0;
  puntuacionJ2 = 0;
  turnosRestantes = 6;
  impactoLogrado = false;
  
  // Configurar posición inicial de los jugadores
  posicionJ1 = { 
    x: distancia_x_inicio - 250, 
    y: height - distancia_piso - radioJugador 
  };
  posicionJ2 = { 
    x: distancia_x_inicio + 250, 
    y: height - distancia_piso - radioJugador 
  };
  
  // Actualizar interfaz
  botonIniciarJuego.classList.add('d-none');
  botonSalirJuego.classList.remove('d-none');
  boton_reset.classList.add('d-none'); // Ocultar el botón de reiniciar durante el juego
  boton_inicio.classList.remove('d-none');
  panelJuego.style.display = 'block';
  infoTurno.textContent = `Turno del Jugador ${jugadorActual}`;
  puntosJ1.textContent = puntuacionJ1;
  puntosJ2.textContent = puntuacionJ2;
  spanTurnosRestantes.textContent = turnosRestantes;
  
  // Reiniciar la simulación
  reiniciar_simulacion();
  
  // Dibujar el estado inicial
  draw();
}

// Función para salir del juego
function salirDelJuego() {
  juegoActivo = false;
  
  // Restaurar interfaz original
  botonIniciarJuego.classList.remove('d-none');
  botonSalirJuego.classList.add('d-none');
  boton_reset.classList.remove('d-none'); // Mostrar el botón de reiniciar
  panelJuego.style.display = 'none';
  
  // Eliminar cualquier botón de continuar que pudiera existir
  const botonContinuar = panelJuego.querySelector('button');
  if (botonContinuar) botonContinuar.remove();
  
  // Restaurar posición original
  distancia_x_inicio = width / 2;
  distancia_y_inicio = height - distancia_piso - radio;
  
  // Reiniciar la simulación para volver al estado normal
  reiniciar_simulacion();
}

// Función para verificar si ha habido un impacto
function verificarImpacto() {
  if (impactoLogrado) return;
  
  // Comprobar impacto en el jugador opuesto
  let jugadorObjetivo = jugadorActual === 1 ? posicionJ2 : posicionJ1;
  
  // Calcular distancia entre proyectil y objetivo
  let distancia = Math.sqrt(Math.pow(x - jugadorObjetivo.x, 2) + Math.pow(y - jugadorObjetivo.y, 2));
  
  // Si hay impacto
  if (distancia < (radioJugador + radio)) {
    impactoLogrado = true;
    
    // Sumar punto al jugador actual
    if (jugadorActual === 1) {
      puntuacionJ1++;
      puntosJ1.textContent = puntuacionJ1;
    } else {
      puntuacionJ2++;
      puntosJ2.textContent = puntuacionJ2;
    }
    
    // Mostrar mensaje de impacto
    infoTurno.textContent = `¡Impacto! Punto para Jugador ${jugadorActual}`;
    infoTurno.className = 'alert alert-success';
    
    // Detener la simulación
    isRunning = false;
    noLoop();
    
    // Añadir botón para continuar
    const botonContinuar = document.createElement('button');
    botonContinuar.textContent = 'Siguiente Turno';
    botonContinuar.className = 'btn btn-primary mt-2';
    botonContinuar.onclick = function() {
      this.remove();
      siguienteTurno();
    };
    panelJuego.appendChild(botonContinuar);
  }
}

// Función para pasar al siguiente turno
function siguienteTurno() {
  // Reducir contador de turnos
  turnosRestantes--;
  spanTurnosRestantes.textContent = turnosRestantes;
  
  // Cambiar de jugador
  jugadorActual = jugadorActual === 1 ? 2 : 1;
  
  // Reiniciar variables
  impactoLogrado = false;
  isFinished = false;
  
  // Verificar si el juego ha terminado
  if (turnosRestantes <= 0) {
    finalizarJuego();
    return;
  }
  
  // Actualizar mensaje de turno
  infoTurno.textContent = `Turno del Jugador ${jugadorActual}`;
  infoTurno.className = 'alert alert-info';
  
  // Reiniciar la simulación
  reiniciar_simulacion();
}

// Función para finalizar el juego
function finalizarJuego() {
  juegoActivo = false;
  
  // Determinar ganador
  let mensaje = '';
  if (puntuacionJ1 > puntuacionJ2) {
    mensaje = `¡Jugador 1 gana! (${puntuacionJ1} - ${puntuacionJ2})`;
    infoTurno.className = 'alert alert-primary';
  } else if (puntuacionJ2 > puntuacionJ1) {
    mensaje = `¡Jugador 2 gana! (${puntuacionJ2} - ${puntuacionJ1})`;
    infoTurno.className = 'alert alert-danger';
  } else {
    mensaje = `¡Empate! (${puntuacionJ1} - ${puntuacionJ2})`;
    infoTurno.className = 'alert alert-warning';
  }
  infoTurno.textContent = mensaje;
  
  // Restaurar botones
  botonIniciarJuego.classList.remove('d-none');
  botonIniciarJuego.textContent = 'Jugar de nuevo';
  botonSalirJuego.classList.add('d-none');
  boton_reset.classList.remove('d-none');
}

// =====================================
// SOBREESCRITURA DE FUNCIONES ORIGINALES
// =====================================

// Modificar la función empezar_simulacion para integrar el juego
const empezar_simulacion_original = empezar_simulacion;
empezar_simulacion = function() {
  if (juegoActivo) {
    // Definir la posición inicial según el jugador actual
    if (jugadorActual === 1) {
      distancia_x_inicio = posicionJ1.x;
      distancia_y_inicio = posicionJ1.y - radio;
    } else {
      distancia_x_inicio = posicionJ2.x;
      distancia_y_inicio = posicionJ2.y - radio;
    }
    
    // Reiniciar posición del proyectil
    x = distancia_x_inicio;
    y = distancia_y_inicio;
    
    // Limpiar trayectoria anterior
    trayectoria = [];
  }
  
  // Llamar a la función original
  empezar_simulacion_original();
};

// Modificar la función draw para integrar el juego
const draw_original = draw;
draw = function() {
  // Llamar a la función original
  draw_original();
  
  if (juegoActivo) {
    // Dibujar jugadores
    fill(0, 0, 255); // Azul para jugador 1
    ellipse(posicionJ1.x, posicionJ1.y, radioJugador * 2, radioJugador * 2);
    
    fill(255, 0, 0); // Rojo para jugador 2
    ellipse(posicionJ2.x, posicionJ2.y, radioJugador * 2, radioJugador * 2);
    
    // Verificar impacto si la simulación está en marcha
    if (isRunning) {
      verificarImpacto();
    }
    
    // Verificar si el turno ha terminado
    if (isFinished && !impactoLogrado) {
      siguienteTurno();
    }
  }
};

// Modificar la función reiniciar_simulación para respetar el modo de juego
const reiniciar_simulacion_original = reiniciar_simulacion;
reiniciar_simulacion = function() {
  // Si está en modo juego, configurar las posiciones base
  if (juegoActivo) {
    if (jugadorActual === 1) {
      distancia_x_inicio = posicionJ1.x;
      distancia_y_inicio = posicionJ1.y - radio;
    } else {
      distancia_x_inicio = posicionJ2.x;
      distancia_y_inicio = posicionJ2.y - radio;
    }
  }
  
  // Llamar a la función original
  reiniciar_simulacion_original();
  
  // Restablecer posición del proyectil
  x = distancia_x_inicio;
  y = distancia_y_inicio;
};

// =====================================
// EVENTOS
// =====================================

// Añadir eventos a los botones
botonIniciarJuego.addEventListener('click', iniciarDuelo);
botonSalirJuego.addEventListener('click', salirDelJuego);
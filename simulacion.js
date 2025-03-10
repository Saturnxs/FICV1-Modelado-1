// Constantes simulación
const g = 9.81; // Aceleración de la gravedad en m/s^2
const tiempo_preview = 1.5; // Tiempo de previsualización (1.5 segundos)
const distancia_piso = 50; // Distancia del suelo en píxeles

// Parámetros cinemáticos
let v_inicial = 25; // Velocidad inicial en m/s
let angulo = 45; // Ángulo de lanzamiento en grados

// Parámetros de simulación
let escala = 5; // Escala de conversión de metros a píxeles
let diametro = 15; // Diámetro del proyectil en píxeles
let radio = diametro / 2; // Radio del proyectil en píxeles
let isRunning = false; // Bandera para controlar si la simulación está corriendo
let isFinished = false; // Bandera para controlar si la simulación ha terminado
let trayectoria = []; // Trayectoria del proyectil

// Variables del proyectil
let t = 0; // Tiempo transcurrido en segundos
let x = 0; // Posición horizontal en píxeles
let y = 0; // Posición vertical en píxeles
let vx = 0; // Velocidad horizontal en píxeles/segundo
let vy = 0; // Velocidad vertical en píxeles/segundo
let distancia_x_inicio, distancia_y_inicio; // Posición inicial

// Elementos del DOM
const input_v_inicial = document.getElementById('input_v_inicial')
const input_angulo = document.getElementById('input_angulo');
const slider_angulo = document.getElementById('slider_angulo');
const input_escala = document.getElementById('input_escala');
const boton_inicio = document.getElementById('boton_inicio');
const boton_pausar = document.getElementById('boton_pausar');
const boton_continuar = document.getElementById('boton_continuar');
const boton_reset = document.getElementById('boton_reset');

const span_tiempo = document.getElementById('span_tiempo');
const span_posicion_x = document.getElementById('span_posicion_x');
const span_posicion_y = document.getElementById('span_posicion_y');
const span_velocidad_x = document.getElementById('span_velocidad_x');
const span_velocidad_y = document.getElementById('span_velocidad_y');

// Eventos de cambio en los inputs
input_v_inicial.addEventListener('input', function() {
  if (!isRunning) {
    v_inicial = parseFloat(this.value);
    reiniciar_simulacion();
  }
});

input_angulo.addEventListener('input', function() {
  if (!isRunning) {
    angulo = parseFloat(this.value);
    reiniciar_simulacion();
  }
});

slider_angulo.addEventListener('input', function() {
  if (!isRunning) {
    angulo = parseFloat(this.value);
    input_angulo.value = angulo;
    reiniciar_simulacion();
  }
});

input_escala.addEventListener('input', function() {
  if (!isRunning) {
    escala = parseFloat(this.value);
    reiniciar_simulacion();
  }
});

// Eventos de los botones
boton_inicio.addEventListener('click', empezar_simulacion);
boton_reset.addEventListener('click', reiniciar_simulacion);
boton_pausar.addEventListener('click', pausar_simulacion);
boton_continuar.addEventListener('click', continuar_simulacion);

// ***** FUNCIONES DE CONVERSIÓN Y CÁLCULO *****

// Función para invertir el eje Y de canvas porque en p5.js Y+ es hacia abajo
function canvas_invertir(y) {
  return -y;
}

// ***** FUNCIONES PARA CONTROLAR LA SIMULACIÓN *****

// Iniciar la simulación
function empezar_simulacion() {
  if (!isRunning) {
    if (isNaN(v_inicial) || v_inicial <= 0) {
      alert("La velocidad inicial debe ser un número mayor que cero.");
      return;
    }

    if (isNaN(angulo) || angulo < 0 || angulo > 180) {
      alert("El ángulo debe ser un número entre 0 y 180 grados.");
      return;
    }

    if (isNaN(escala) || escala <= 0) {
      alert("La escala debe ser un número mayor que cero.");
      return;
    }

    // Bloquear los inputs mientras la simulación está corriendo
    input_v_inicial.disabled = true;
    input_angulo.disabled = true;
    slider_angulo.disabled = true;
    input_escala.disabled = true;
    boton_inicio.classList.add('d-none');
    boton_pausar.classList.remove('d-none');

    // Calcular componentes de velocidad inicial
    const componentes = calcular_componentes_velocidad_proyectil(v_inicial, angulo);
    vx = componentes.vx * escala;
    vy = canvas_invertir(componentes.vy) * escala; // Invertir para que altura positiva sea hacia arriba por canvas

    isRunning = true;
    isFinished = false;
    loop();
  }
}

// Reiniciar la simulación
function reiniciar_simulacion() {
  noLoop();
  isRunning = false;
  isFinished = false;
  trayectoria = [];

  // Desbloquear los inputs
  input_v_inicial.disabled = false;
  input_angulo.disabled = false;
  slider_angulo.disabled = false;
  input_escala.disabled = false;
  boton_inicio.classList.remove('d-none');
  boton_pausar.classList.add('d-none');
  boton_continuar.classList.add('d-none');

  // Reiniciar valores
  t = 0;
  x = distancia_x_inicio;
  y = distancia_y_inicio;
  vx = 0;
  vy = 0;

  draw(); // Dibujar el frame inicial de nuevo
}

// Pausar la simulación
function pausar_simulacion() {
  boton_pausar.classList.add('d-none');
  boton_continuar.classList.remove('d-none');
  noLoop();
  isRunning = false;
}

// Continuar la simulación
function continuar_simulacion() {
  boton_pausar.classList.remove('d-none');
  boton_continuar.classList.add('d-none');
  loop();
  isRunning = true;
}

// ***** FUNCIONES DE DIBUJOS *****

// Dibujar la trayectoria predicha
function dibujar_preview_trayectoria() {
  // Dibuja la trayectoria predicha como línea punteada
  push();
  stroke(100, 100, 100);
  strokeWeight(1);
  noFill();
  drawingContext.setLineDash([5, 5]);
  beginShape();

  const piso_y = height - distancia_piso; // Posición Y del suelo
  
  for (let tiempo_simulado = 0; tiempo_simulado <= tiempo_preview; tiempo_simulado += 0.1) {

    let componentes_preview = calcular_componentes_velocidad_proyectil(v_inicial, angulo);
    let vx_preview = componentes_preview.vx;
    let vy_preview = componentes_preview.vy;

    let preview_x = posicion_x_proyectil('x', distancia_x_inicio, (vx_preview * escala), tiempo_simulado);
    let preview_y = posicion_y_proyectil('y', distancia_y_inicio, canvas_invertir(vy_preview * escala), tiempo_simulado, g * escala);
    
    // Si toca el suelo o lo sobrepasa se corta la trayectoria
    if (preview_y >= piso_y) {
      vertex(preview_x, piso_y);
      break;
    }
    vertex(preview_x, preview_y);
  }

  endShape();
  pop();
}

function dibujar_trayectoria() {
  push();
  stroke(75, 0, 130);
  strokeWeight(2);
  noFill();
  beginShape();

  for (let i = 0; i < trayectoria.length; i++) {
    vertex(trayectoria[i].x, trayectoria[i].y);
  }

  endShape();
  pop();
}

function dibujar_recta_numérica() {
  let piso_y = height - distancia_piso;
  let margen_horizontal = 20; // Margen en píxeles para los bordes laterales
  
  // Dibujar la línea del suelo
  stroke(0); // Color negro para el suelo
  strokeWeight(3);    // Línea más gruesa para el suelo
  line(margen_horizontal, piso_y, width - margen_horizontal, piso_y);

  // Calcular el rango de la recta numérica en metros, considerando la posición inicial y los márgenes
  let metros_inicio = canvas_invertir(Math.floor((distancia_x_inicio - margen_horizontal) / escala));
  let metros_finales = Math.floor((width - distancia_x_inicio - margen_horizontal) / escala);
  
  // Determinar el intervalo de marcas basado en la escala
  let interval;
  if (escala < 2) {
    interval = 100; // Marcas cada 100m para escala extremadamente pequeña
  } else if (escala < 5) {
    interval = 50;  // Marcas cada 50m para escala muy pequeña
  } else if (escala < 10) {
    interval = 20;  // Marcas cada 20m para escala pequeña
  } else if (escala < 20) {
    interval = 10;  // Marcas cada 10m para escala media-pequeña
  } else if (escala < 50) {
    interval = 5;   // Marcas cada 5m para escala media
  } else if (escala < 100) {
    interval = 2;   // Marcas cada 2m para escala grande
  } else {
    interval = 1;   // Marcas cada 1m para escala muy grande
  }
  
  // Ajustar para mostrar marcas en múltiplos del intervalo
  metros_inicio = Math.ceil(metros_inicio / interval) * interval;
  
  // Dibujar las marcas y etiquetas según el intervalo calculado
  for (let i = metros_inicio; i <= metros_finales; i += interval) {
    let posicion_recta = distancia_x_inicio + i * escala;
    
    // Solo dibujar si la marca está dentro de los márgenes
    if (posicion_recta >= margen_horizontal && posicion_recta <= width - margen_horizontal) {
      stroke(0);
      line(posicion_recta, piso_y - 5, posicion_recta, piso_y + 5);
      noStroke();
      fill(0);
      textSize(10);
      textAlign(CENTER, TOP);
      text(i + " m", posicion_recta, piso_y + 10);
    }
  }
}

// Mostrar los valores físicos
function display_valores(v_x_actual, v_y_actual) {
  span_tiempo.innerText = t.toFixed(2);
  
  // Convertir las posiciones y velocidades a metros
  let x_metros = (x - distancia_x_inicio) / escala;
  let y_metros = canvas_invertir(y - distancia_y_inicio) / escala; // Invertir porque en canvas Y+ es hacia abajo
  span_posicion_x.innerText = x_metros.toFixed(2);
  span_posicion_y.innerText = y_metros.toFixed(2);
  
  // Convertir las velocidades a metros/segundo
  let v_x_metros = v_x_actual / escala;
  let v_y_metros = canvas_invertir(v_y_actual) / escala; // Invertir porque en canvas Y+ es hacia abajo
  span_velocidad_x.innerText = v_x_metros.toFixed(2);
  span_velocidad_y.innerText = v_y_metros.toFixed(2);
}

// Función principal de dibujo (p5.js)
function draw() {
  background(255);
  
  // Si la simulación está corriendo, actualizar la posición
  if (isRunning) {
    // Calcular la posición usando ecuaciones de movimiento parabólico
    x = posicion_x_proyectil('x', distancia_x_inicio, vx, t);
    // la gravedad es positiva porque en canvas Y+ es hacia abajo, además tengo en cuenta la escala
    y = posicion_y_proyectil('y', distancia_y_inicio, vy, t, g * escala); 

    // Aumentar la trayectoria del proyectil
    trayectoria.push({ x: x, y: y });
    
    // Aumentar el tiempo en cada frame (60 fps)
    t += 1 / 60;
  }

  console.log("X: " + x + " Y: " + y);
  
  // Calcular velocidades actuales
  let vx_actual = vx;
  let vy_actual = vy + g * escala * t;

  dibujar_preview_trayectoria();
  dibujar_trayectoria();
  dibujar_recta_numérica();
  display_valores(vx_actual, vy_actual);

  // Dibujar proyectil
  fill(255, 0, 0);
  ellipse(x, y, diametro, diametro);
  
  // Detener la simulación cuando el proyectil toca el suelo, el techo o se sale del canvas
  if (y > (height - distancia_piso - radio) || y < radio || x < radio || x > width - radio) {
    isRunning = false;
    isFinished = true;
    boton_pausar.classList.add('d-none');
    boton_continuar.classList.add('d-none');
    span_posicion_y.innerText = "0.00";
    noLoop();
  }
}

// Configuración inicial de p5.js
function setup() {
  // Crear canvas
  let container = document.getElementById("canvasContainer");
  canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent("canvasContainer");

  angleMode(DEGREES); // Usar grados en lugar de radianes
  
  // Posición inicial
  distancia_x_inicio = width / 2;
  distancia_y_inicio = height - distancia_piso - radio;
  x = distancia_x_inicio;
  y = distancia_y_inicio;
  
  // Inicializar valores
  escala = parseFloat(input_escala.value);
  v_inicial = parseFloat(input_v_inicial.value);
  angulo = parseFloat(input_angulo.value);
  
  // Dibujar frame inicial
  noLoop(); // Inicialmente no hay animación
  draw();
}
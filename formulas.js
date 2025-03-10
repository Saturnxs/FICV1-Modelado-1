// **************************** MOVIEMIENTO RECTILINEO UNIFORME (MRU) ****************************

/**
 * Calcula la velocidad, distancia o tiempo según la variable solicitada despejando la formula (v = d/t)
 * @param {string} variable_retorno - Variable a calcular ('v', 'd', 't')
 * @param {number} distancia - Distancia en metros
 * @param {number} tiempo - Tiempo en segundos
 * @param {number} velocidad - Velocidad en m/s
 * @returns {number} El valor calculado
 */
function formula_velocidad_MRU(variable_retorno = 'v', distancia = 0, tiempo = 0, velocidad = 0) {
    switch (variable_retorno) {
        case 'v':
            return distancia / tiempo; // v = d/t
        case 'd':
            return velocidad * tiempo; // d = v*t
        case 't':
            return distancia / velocidad; // t = d/v
        default:
            throw new Error("Variable de retorno no válida. Use 'v', 'd' o 't'");
    }
}

// **************************** MOVIEMIENTO RECTILINEO UNIFORMEMENTE ACELERADO (MRUA) ****************************

/**
 * Calcula la distancia, velocidad inicial o aceleración según la variable solicitada despejando la formula (d = vi·t + 0.5·a·t^2)
 * @param {string} variable_retorno - Variable a calcular ('d', 'vi', 'a')
 * @param {number} velocidad_inicial - Velocidad inicial en m/s
 * @param {number} tiempo - Tiempo en segundos
 * @param {number} aceleracion - Aceleración en m/s^2
 * @param {number} distancia - Distancia en metros
 * @returns {number} El valor calculado
 */
function formula_distancia_MRUA(variable_retorno = 'd', velocidad_inicial = 0, tiempo = 1, aceleracion = 0, distancia = 0) {
    switch (variable_retorno) {
        case 'd':
            return velocidad_inicial * tiempo + (0.5 * aceleracion * Math.pow(tiempo, 2)); // d = vi·t + 0.5·a·t^2
        case 'vi':
            return (distancia - (0.5 * aceleracion * Math.pow(tiempo, 2))) / tiempo; // vi = (d - 0.5·a·t^2) / t
        case 'a':
            return (2 * (distancia - velocidad_inicial * tiempo)) / Math.pow(tiempo, 2); // a = 2·(d - vi·t) / t^2
        default:
            throw new Error("Variable de retorno no válida. Use 'd', 'vi' o 'a'");
    }
}

/**
 * Calcula la velocidad final, aceleración, tiempo o velocidad inicial según la variable solicitada despejando la formula (vf = vi + a·t)
 * @param {string} variable_retorno - Variable a calcular ('vf', 'a', 't', 'vi')
 * @param {number} velocidad_inicial - Velocidad inicial en m/s
 * @param {number} aceleracion - Aceleración en m/s^2
 * @param {number} tiempo - Tiempo en segundos
 * @param {number} velocidad_final - Velocidad final en m/s
 * @returns {number} El valor calculado
 */
function formula_velocidad_final_MRUA(variable_retorno = 'vf', velocidad_inicial = 0, aceleracion = 0, tiempo = 1, velocidad_final = 0) {
    switch (variable_retorno) {
        case 'vf':
            return velocidad_inicial + aceleracion * tiempo; // vf = vi + a·t
        case 'a':
            return (velocidad_final - velocidad_inicial) / tiempo; // a = (vf - vi) / t
        case 't':
            return (velocidad_final - velocidad_inicial) / aceleracion; // t = (vf - vi) / a
        case 'vi':
            return velocidad_final - aceleracion * tiempo; // vi = vf - a·t
        default:
            throw new Error("Variable de retorno no válida. Use 'vf', 'a', 't' o 'vi'");
    }
}

// **************************** MOVIMIENTO PARABÓLICO ****************************

/**
 * Calcula las componentes de la velocidad según el ángulo de lanzamiento de un proyectil usando vx = v0·cos(O) y vy = v0·sen(O)
 * @param {number} velocidad_inicial - Velocidad inicial en m/s
 * @param {number} angulo - Ángulo en grados
 * @returns {Object} Objeto con las componentes vx y vy en m/s
 */
function calcular_componentes_velocidad_proyectil(velocidad_inicial, angulo) {
    // Convertir ángulo de grados a radianes para las funciones trig
    const anguloRad = angulo * Math.PI / 180;
    return {
        vx: velocidad_inicial * Math.cos(anguloRad), // v0·cos(O)
        vy: velocidad_inicial * Math.sin(anguloRad) // v0·sen(O)
    };
}

/**
 * Calcula la posición y de un proyectil en el tiempo t usando la fórmula y = y0 + v0y·t - (1/2)·g·t^2
 * @param {string} variable_retorno - Variable a calcular ('y', 'y0', 'v0y', 't', 'g')
 * @param {number} distancia_inicial_y - Posición y inicial en metros
 * @param {number} velocidad_inicial_y - Componente y de la velocidad inicial en m/s
 * @param {number} tiempo - Tiempo en segundos
 * @param {number} gravedad - Aceleración de la gravedad en m/s^2 (positiva hacia abajo)
 * @param {number} distancia_y - Posición y del proyectil en metros
 * @returns {number} El valor calculado
 */
function posicion_y_proyectil(variable_retorno = 'y', distancia_inicial_y = 0, velocidad_inicial_y = 0, tiempo = 0, gravedad = 9.81, distancia_y = 0) {
    switch (variable_retorno) {
        case 'y':
            return distancia_inicial_y + velocidad_inicial_y * tiempo + 0.5 * gravedad * Math.pow(tiempo, 2); // y = y0 + v0y·t + (1/2)·g·t^2
        case 'y0':
            return distancia_y + velocidad_inicial_y * tiempo + 0.5 * gravedad * Math.pow(tiempo, 2); // y0 = y - v0y·t + (1/2)·g·t^2
        case 'v0y':
            return (distancia_y + distancia_inicial_y + 0.5 * gravedad * Math.pow(tiempo, 2)) / tiempo; // v0y = (y - y0 + (1/2)·g·t^2) / t
        case 't':
            // #TODO: es que ish con esa formula cuadratica
            throw new Error("Falta implementar la fórmula cuadrática para tiempo");
        case 'g':
            return 2 * (distancia_inicial_y + velocidad_inicial_y * tiempo - distancia_y) / Math.pow(tiempo, 2); // g = 2·(y0 + v0y·t - y) / t^2
        default:
            throw new Error("Variable de retorno no válida. Use 'y', 'y0', 'v0y', 't' o 'g'");
    }
}

/**
 * Calcula la posición x de un proyectil en el tiempo t usando la fórmula (x = x0 + v0x·t)
 * @param {string} variable_retorno - Variable a calcular ('x', 'x0', 'v0x', 't')
 * @param {number} distancia_inicial_x - Posición x inicial en metros
 * @param {number} velocidad_inicial_x - Componente x de la velocidad inicial en m/s
 * @param {number} tiempo - Tiempo en segundos
 * @param {number} distancia_x - Posición x del proyectil en metros
 * @returns {number} El valor calculado
 */
function posicion_x_proyectil(variable_retorno = 'x', distancia_inicial_x = 0, velocidad_inicial_x = 0, tiempo = 0, distancia_x = 0) {
    switch (variable_retorno) {
        case 'x':
            return distancia_inicial_x + velocidad_inicial_x * tiempo; // x = x0 + v0x·t
        case 'x0':
            return distancia_x - velocidad_inicial_x * tiempo; // x0 = x - v0x·t
        case 'v0x':
            return (distancia_x - distancia_inicial_x) / tiempo; // v0x = (x - x0) / t
        case 't':
            return (distancia_x - distancia_inicial_x) / velocidad_inicial_x; // t = (x - x0) / v0x
        default:
            throw new Error("Variable de retorno no válida. Use 'x', 'x0', 'v0x' o 't'");
    }
}
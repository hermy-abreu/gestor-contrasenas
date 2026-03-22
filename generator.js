/**
 * Lógica Core del Back-end (generador.js)
 * Separamos la lógica de la manipulación del DOM.
 */

const KEYS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

/**
 * Genera una contraseña aleatoria basándose en las opciones
 * @param {number} length 
 * @param {Object} options 
 * @returns {string} 
 */
export function generatePassword(length, options) {
    let charset = '';
    let password = '';
    let guaranteedCharacters = [];

    if (options.uppercase) {
        charset += KEYS.uppercase;
        guaranteedCharacters.push(getRandomChar(KEYS.uppercase));
    }
    if (options.lowercase) {
        charset += KEYS.lowercase;
        guaranteedCharacters.push(getRandomChar(KEYS.lowercase));
    }
    if (options.numbers) {
        charset += KEYS.numbers;
        guaranteedCharacters.push(getRandomChar(KEYS.numbers));
    }
    if (options.symbols) {
        charset += KEYS.symbols;
        guaranteedCharacters.push(getRandomChar(KEYS.symbols));
    }

    if (charset === '') return '';

    // Añadir caracteres aleatorios del charset disponible
    for (let i = 0; i < length - guaranteedCharacters.length; i++) {
        password += getRandomChar(charset);
    }

    // Mezclar la contraseña con los caracteres garantizados
    password += guaranteedCharacters.join('');
    
    // Mezclamos (shuffle) la cadena final para mayor aleatoriedad
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}

function getRandomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
}

/**
 * Calcula la fortaleza de la contraseña
 * @param {number} length 
 * @param {Object} options 
 * @returns {Object} Un objeto con el nivel (1-4) y el texto correspondiente
 */
export function calculateStrength(length, options) {
    // Si no hay nada seleccionado
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
        return { level: 0, text: 'N/A' };
    }

    let score = 0;

    // Puntos por longitud
    if (length > 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;

    // Puntos por variedad de caracteres
    let typesCount = Object.values(options).filter(Boolean).length;
    score += (typesCount - 1); 

    // Mapeo de puntaje a un nivel de fortaleza (1-4)
    let level = 1;
    let text = 'Débil';

    if (score >= 2 && score <= 3) {
        level = 2;
        text = 'Regular';
    } else if (score >= 4 && score <= 4) {
        level = 3;
        text = 'Buena';
    } else if (score >= 5) {
        level = 4;
        text = 'Excelente';
    }

    // Casos excepcionales (muy carta, penalización)
    if (length < 8) {
        level = 1;
        text = 'Muy Débil';
    }

    return { level, text };
}

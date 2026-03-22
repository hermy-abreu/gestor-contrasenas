import { generatePassword, calculateStrength } from './generator.js';

/**
 * DOM Elements
 */
const elements = {
    result: document.getElementById('password-result'),
    lengthInput: document.getElementById('password-length'),
    lengthValue: document.getElementById('length-value'),
    uppercase: document.getElementById('include-uppercase'),
    lowercase: document.getElementById('include-lowercase'),
    numbers: document.getElementById('include-numbers'),
    symbols: document.getElementById('include-symbols'),
    generateBtn: document.getElementById('generate-btn'),
    copyBtn: document.getElementById('copy-btn'),
    toggleBtn: document.getElementById('toggle-visibility'),
    iconEye: document.getElementById('icon-eye'),
    iconEyeOff: document.getElementById('icon-eye-off'),
    strengthGroup: document.querySelector('.strength-group'),
    strengthText: document.getElementById('strength-text'),
    copyFeedback: document.getElementById('copy-feedback')
};

/**
 * Estado Inicial
 */
let currentPassword = '';

/**
 * Event Listeners
 */
function init() {
    // Actualizar valor de longitud en tiempo real
    elements.lengthInput.addEventListener('input', (e) => {
        elements.lengthValue.textContent = e.target.value;
        updateSliderBackground(e.target);
    });

    // Generar contraseña
    elements.generateBtn.addEventListener('click', handleGenerate);

    // Copiar al portapapeles
    elements.copyBtn.addEventListener('click', handleCopy);

    // Mostrar/Ocultar contraseña
    elements.toggleBtn.addEventListener('click', handleToggleVisibility);

    // Opcional: Generar una al cargar la página
    handleGenerate();
    updateSliderBackground(elements.lengthInput);
}

/**
 * Handlers
 */
function handleGenerate() {
    const length = parseInt(elements.lengthInput.value, 10);
    const options = {
        uppercase: elements.uppercase.checked,
        lowercase: elements.lowercase.checked,
        numbers: elements.numbers.checked,
        symbols: elements.symbols.checked
    };

    // Validar que al menos haya una opción
    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
        showFeedback('Selecciona al menos 1 opción', true);
        elements.result.value = '';
        currentPassword = '';
        updateStrengthUI({ level: 0, text: 'N/A' });
        return;
    }

    // Usar la lógica de backend (generator.js)
    currentPassword = generatePassword(length, options);
    elements.result.value = currentPassword;

    // Calcular y mostrar fortaleza
    const strength = calculateStrength(length, options);
    updateStrengthUI(strength);
}

function handleCopy() {
    if (!currentPassword) return;

    // Uso de API del portapapeles moderna (navigator.clipboard)
    navigator.clipboard.writeText(currentPassword).then(() => {
        showFeedback('¡Copiado al portapapeles!');
    }).catch(() => {
        // Fallback genérico si la API falla
        elements.result.select();
        document.execCommand('copy');
        showFeedback('¡Copiado al portapapeles!');
    });
}

function handleToggleVisibility() {
    if (elements.result.type === 'password') {
        elements.result.type = 'text';
        elements.iconEye.classList.add('hidden');
        elements.iconEyeOff.classList.remove('hidden');
    } else {
        elements.result.type = 'password';
        elements.iconEye.classList.remove('hidden');
        elements.iconEyeOff.classList.add('hidden');
    }
}

/**
 * UI Updates
 */
function updateStrengthUI(strength) {
    // Limpiar clases de fortaleza previas
    elements.strengthGroup.className = 'control-group strength-group';
    
    if (strength.level > 0) {
        elements.strengthGroup.classList.add(`strength-${strength.level}`);
    }
    
    elements.strengthText.textContent = strength.text;
}

function showFeedback(message, isError = false) {
    elements.copyFeedback.textContent = message;
    
    if (isError) {
        elements.copyFeedback.style.backgroundColor = 'var(--strength-weak)';
    } else {
        elements.copyFeedback.style.backgroundColor = 'var(--primary)';
    }

    elements.copyFeedback.classList.add('show');
    
    setTimeout(() => {
        elements.copyFeedback.classList.remove('show');
    }, 2500);
}

// Actualiza el porcentaje del slider para darle estilo si es necesario
function updateSliderBackground(slider) {
    const min = slider.min || 0;
    const max = slider.max || 100;
    const val = slider.value;
    const percentage = ((val - min) / (max - min)) * 100;
    
    // Si queremos darle un gradiente al track del slider (opcional)
    // slider.style.background = `linear-gradient(to right, var(--primary) ${percentage}%, var(--input-bg) ${percentage}%)`;
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración Inicial y Carga de Datos ---
    let userExp = parseInt(localStorage.getItem('userExp')) || 0;
    let userLevel = parseInt(localStorage.getItem('userLevel')) || 1;
    const userAvatar = localStorage.getItem('userAvatar') || 'imagenes/default-avatar.png';
    const EXP_PER_LEVEL = 2000; 
    let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // Referencias de elementos que existen en todas las páginas
    const userAvatarImg = document.getElementById('user-avatar');
    const navLevelSpan = document.getElementById('nav-level');
    const fileInput = document.getElementById('file-input');

    // --- Funciones de Utilidad ---
    function saveProgress() {
        localStorage.setItem('userExp', userExp);
        localStorage.setItem('userLevel', userLevel);
    }

    function updateNavLevel() {
        if (navLevelSpan) {
            navLevelSpan.textContent = userLevel;
            // Aplicar animación al nivel
            navLevelSpan.classList.add('animate__tada');
            setTimeout(() => {
                navLevelSpan.classList.remove('animate__tada');
            }, 1000);
        }
        if (userAvatarImg) userAvatarImg.src = userAvatar; // Asegura que la foto esté en todas las nav
    }

    // Inicializa el nivel y la foto en todas las barras de navegación
    updateNavLevel(); 

    // --- 1. Lógica de Autenticación (Modal) ---
    const authModalElement = document.getElementById('authModal');
    if (authModalElement) {
        const authModal = new bootstrap.Modal(authModalElement);
        const authForm = document.getElementById('auth-form');

        // Mostrar el modal si no está autenticado y estamos en la página de inicio
        if (!isAuthenticated && window.location.pathname.endsWith('index.html')) {
            authModal.show();
        }

        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            // Lógica simple: Iniciar sesión o registrarse si no existe
            isAuthenticated = true;
            localStorage.setItem('isAuthenticated', 'true');
            alert(`¡Bienvenido a GREENUP, ${username}!`);
            authModal.hide();
        });
    }

    // --- 2. Foto de Perfil Modificable ---
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newAvatar = e.target.result;
                    // Actualiza todas las instancias de la imagen de perfil
                    document.querySelectorAll('#user-avatar').forEach(img => {
                        img.src = newAvatar;
                    });
                    localStorage.setItem('userAvatar', newAvatar);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 3. Texto Curvo Modificable (Solo en index.html) ---
    window.modificarTextoCurvo = function() {
        const curvedTextElement = document.getElementById('curved-text');
        if (curvedTextElement) {
            const newText = prompt("Introduce el nuevo texto para el planeta (máx. 40 caracteres):", curvedTextElement.textContent);
            if (newText !== null && newText.length <= 40) {
                curvedTextElement.textContent = newText.toUpperCase();
                // Opcional: Agregar animación al cambiar
                curvedTextElement.classList.add('animate__animated', 'animate__flash');
                setTimeout(() => {
                    curvedTextElement.classList.remove('animate__animated', 'animate__flash');
                }, 1000);
            } else if (newText && newText.length > 40) {
                alert("El texto es demasiado largo. Debe ser de 40 caracteres o menos.");
            }
        }
    }

    // --- 4. Lógica de Experiencia y Nivel (Solo en misiones.html) ---
    const progressBar = document.getElementById('progressBar');
    if (progressBar) { // Si estamos en misiones.html
        const progressText = document.getElementById('progressText');
        const currentExpSpan = document.getElementById('currentExp');
        const currentLevelSpan = document.getElementById('currentLevel');
        const expToNextLevelSpan = document.getElementById('expToNextLevel');
        const completeButtons = document.querySelectorAll('.complete-mission');
        
        if (expToNextLevelSpan) expToNextLevelSpan.textContent = EXP_PER_LEVEL;

        function updateProgress() {
            // Lógica de Subida de Nivel
            if (userExp >= EXP_PER_LEVEL) {
                userLevel++;
                userExp -= EXP_PER_LEVEL; 
                alert(`¡Felicidades! ¡Has subido al Nivel ${userLevel}!`);
                saveProgress();
                updateProgress(); // Llama recursivamente para recalcular si subió más de un nivel
                updateNavLevel(); // Actualizar el nivel en la barra
                return;
            }

            // Actualizar el DOM
            currentExpSpan.textContent = userExp;
            currentLevelSpan.textContent = userLevel;
            updateNavLevel(); // Asegura que la barra de navegación tenga el nivel correcto

            let progress = (userExp / EXP_PER_LEVEL) * 100;
            if (progress > 100) progress = 100; 

            progressBar.style.width = progress.toFixed(2) + '%';
            progressText.textContent = `${progress.toFixed(0)}%`;
            
            saveProgress();
        }

        // Manejador de botones de misión
        const completedMissions = JSON.parse(localStorage.getItem('completedMissions')) || {};

        completeButtons.forEach(button => {
            const expGained = parseInt(button.getAttribute('data-exp'));
            // Usar un identificador único basado en el contenido del card o un ID fijo
            const missionId = button.closest('.card').id || button.closest('.card').querySelector('h3').textContent.trim();
            
            // Cargar estado de la misión
            if (completedMissions[missionId]) {
                button.disabled = true;
                button.textContent = 'Completada';
                button.classList.remove('btn-success', 'btn-primary');
                button.classList.add('btn-secondary');
            }

            button.addEventListener('click', function() {
                if (!isAuthenticated) {
                    alert('Debes iniciar sesión para completar misiones.');
                    return;
                }

                userExp += expGained;
                updateProgress();

                // Guardar estado de la misión como completada
                completedMissions[missionId] = true;
                localStorage.setItem('completedMissions', JSON.stringify(completedMissions));

                // Deshabilitar y cambiar apariencia
                this.disabled = true;
                this.textContent = 'Completada';
                this.classList.remove('btn-success', 'btn-primary');
                this.classList.add('btn-secondary');
                // Agregar animación de éxito a la misión
                this.closest('.card').classList.add('animate__animated', 'animate__flipOutY');
            });
        });

        updateProgress();
    }
    
    // --- Lógica de la Calculadora de Huella de Carbono (Solo en index.html) ---
    const form = document.getElementById('carbon-footprint-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Lógica de cálculo (sin cambios importantes)
            const consumoEnergia = document.getElementById('consumo-energia').value;
            const usoCoche = document.getElementById('uso-coche').value;
            const viajesAvion = document.getElementById('viajes-avion').value;
            const recicla = document.querySelector('input[name="reciclaje"]:checked').value;
            
            let huellaAnualKg = 0; // Usaremos Kg para el cálculo intermedio

            // Ponderaciones (ejemplo simplificado, puedes ajustarlas)
            const ponderacionEnergia = { 'bajo': 500, 'medio': 1000, 'alto': 2000 };
            const ponderacionCoche = { 'casi-nunca': 100, 'algunas-veces': 1500, 'todos-dias': 3500 };
            const ponderacionAvion = { 'ninguno': 0, 'varios': 4000 };
            const ponderacionReciclaje = { 'si': -500, 'no': 0 };

            huellaAnualKg += ponderacionEnergia[consumoEnergia] || 0;
            huellaAnualKg += ponderacionCoche[usoCoche] || 0;
            huellaAnualKg += ponderacionAvion[viajesAvion] || 0;
            huellaAnualKg += ponderacionReciclaje[recicla] || 0;

            const huellaAnualToneladas = (huellaAnualKg / 1000).toFixed(2);

            document.getElementById('huella-anual').textContent = huellaAnualToneladas;
            
            let evaluacion = '';
            let clase = '';

            // Criterios de evaluación (toneladas de CO2)
            if (huellaAnualToneladas < 2) {
                evaluacion = '¡Fantástico! Tu huella es muy baja. Eres un gran ejemplo de sostenibilidad. 🌿';
                clase = 'bueno';
            } else if (huellaAnualToneladas < 6) {
                evaluacion = '¡Muy bien! Tu huella es moderada. Con algunos ajustes, podrías reducirla aún más. 🌳';
                clase = 'regular';
            } else if (huellaAnualToneladas < 10) {
                evaluacion = 'Tu huella está por encima del promedio. Considera formas de reducir tu consumo energético y de transporte. ⚠️';
                clase = 'malo';
            } else {
                evaluacion = 'Tu huella es muy alta. Hay una gran oportunidad para hacer cambios significativos. 🚨';
                clase = 'malo';
            }

            const evaluacionElement = document.getElementById('evaluacion');
            evaluacionElement.textContent = evaluacion;
            // Se usa DOM para modificar la clase dinámicamente
            evaluacionElement.className = 'mt-2 p-2 rounded ' + clase; 
            document.getElementById('resultado').style.display = 'block';
            
            // Agregar animación de "resultado"
            document.getElementById('resultado').classList.add('animate__animated', 'animate__fadeIn');
        });
    }

});
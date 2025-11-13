$(document).ready(function () {
 $("toast").toast("show")
})
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Inicialización de Estado ---
    let currentExp = parseInt(localStorage.getItem('currentExp')) || 0;
    let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    let expToNextLevel = calculateExpToNextLevel(currentLevel);

    // Guardamos la instancia del modal para reutilizarla
    const levelUpModalElement = document.getElementById('levelUpModal');
    const levelUpModal = new bootstrap.Modal(levelUpModalElement);

    // Cargar el avatar si existe
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        document.getElementById('user-avatar').src = savedAvatar;
    }

    // --- 2. Funciones de Ayuda ---

    // Función para calcular la EXP necesaria para el siguiente nivel
    function calculateExpToNextLevel(level) {
        // Fórmula de ejemplo: 2000 * nivel (hace que sea progresivo)
        return 2000 * level; 
    }

    // Función principal para actualizar la interfaz del usuario
    function updateUI() {
        const progressPercentage = (currentExp / expToNextLevel) * 100;
        const progressBarElement = document.getElementById('progressBar');
        const progressTextElement = document.getElementById('progressText');

        document.getElementById('currentLevel').textContent = currentLevel;
        document.getElementById('nav-level').textContent = currentLevel;
        document.getElementById('currentExp').textContent = currentExp;
        document.getElementById('expToNextLevel').textContent = expToNextLevel;

        progressBarElement.style.width = `${progressPercentage}%`;
        progressTextElement.textContent = `${Math.round(progressPercentage)}%`;
    }

    // --- 3. Lógica Principal de Experiencia y Nivel ---

    // Función para añadir experiencia y comprobar la subida de nivel
    function addExp(expAmount) {
        currentExp += expAmount;
        localStorage.setItem('currentExp', currentExp);

        let levelUp = false; // Bandera para saber si se subió de nivel
        
        // Bucle de subida de nivel (por si el usuario sube varios niveles de golpe)
        while (currentExp >= expToNextLevel) {
            levelUp = true;
            currentExp -= expToNextLevel; // Resta la EXP necesaria
            currentLevel++;              // Incrementa el nivel
            expToNextLevel = calculateExpToNextLevel(currentLevel); // Calcula la nueva EXP
        }

        // Guardar el nuevo estado
        localStorage.setItem('currentLevel', currentLevel);
        localStorage.setItem('currentExp', currentExp); // Guardamos el excedente de EXP

        // Actualizar la UI
        updateUI();

        // 
        // **ESTE ES EL CÓDIGO NUEVO (ELIMINA CUALQUIER "alert(...)")**
        // Si la bandera levelUp es 'true', mostramos el modal.
        //
        if (levelUp) {
            document.getElementById('newLevelDisplay').textContent = currentLevel;
            levelUpModal.show(); // <-- Esta línea llama a la ventanita
        }
    }

    // --- 4. Event Listeners ---

    // Event listener para el cambio de avatar
    document.getElementById('file-input').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newAvatarUrl = e.target.result;
                document.getElementById('user-avatar').src = newAvatarUrl;
                localStorage.setItem('userAvatar', newAvatarUrl);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Event listeners para los botones de misión
    document.querySelectorAll('.complete-mission').forEach(button => {
        button.addEventListener('click', function() {
            // Lee la experiencia del atributo data-exp
            const exp = parseInt(this.getAttribute('data-exp'));
            
            // Añade la experiencia (y llama al modal si se sube de nivel)
            addExp(exp);

            // Deshabilita el botón (para evitar re-completar)
            this.textContent = '¡Completada!';
            this.disabled = true;
            this.classList.remove('btn-success', 'btn-primary');
            this.classList.add('btn-secondary');
        });
    });

    // Carga inicial de la UI al cargar la página
    updateUI();
});
$(document).ready(function () {
 $("toast").toast("show")
})
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización del estado del usuario
    let currentExp = parseInt(localStorage.getItem('currentExp')) || 0;
    let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    let expToNextLevel = calculateExpToNextLevel(currentLevel);

    // Cargar el avatar si existe
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        document.getElementById('user-avatar').src = savedAvatar;
    }

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

    // Función para calcular la EXP necesaria para el siguiente nivel
    function calculateExpToNextLevel(level) {
        // Fórmula de ejemplo: 2000 * nivel (Esto hace que subir de nivel sea progresivamente más difícil)
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

    // Función para añadir experiencia y comprobar la subida de nivel
    function addExp(expAmount) {
        currentExp += expAmount;
        localStorage.setItem('currentExp', currentExp);

        // Bucle de subida de nivel (por si el usuario sube varios niveles de golpe)
        let levelUp = false;
        while (currentExp >= expToNextLevel) {
            levelUp = true;
            currentExp -= expToNextLevel; // Resta la EXP necesaria
            currentLevel++;              // Incrementa el nivel
            expToNextLevel = calculateExpToNextLevel(currentLevel); // Calcula la nueva EXP
        }

        localStorage.setItem('currentLevel', currentLevel);
        localStorage.setItem('expToNextLevel', expToNextLevel);

        updateUI();

        // **NUEVO: Mostrar el modal si hubo una subida de nivel**
        if (levelUp) {
            document.getElementById('newLevelDisplay').textContent = currentLevel;
            const levelUpModal = new bootstrap.Modal(document.getElementById('levelUpModal'));
            levelUpModal.show();
        }
    }

    // Event listeners para los botones de misión
    document.querySelectorAll('.complete-mission').forEach(button => {
        button.addEventListener('click', function() {
            const exp = parseInt(this.getAttribute('data-exp'));
            addExp(exp);

            // Deshabilita el botón (opcional, para evitar re-completar)
            this.textContent = '¡Completada!';
            this.disabled = true;
            this.classList.remove('btn-success', 'btn-primary');
            this.classList.add('btn-secondary');
        });
    });

    // Carga inicial de la UI
    updateUI();
});
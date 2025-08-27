document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('carbon-footprint-form');
    const resultadoDiv = document.getElementById('resultado');
    const huellaValor = document.getElementById('huella-valor');
    const mensajeP = document.getElementById('mensaje');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const energia = document.getElementById('energia').value;
        const transporte = document.getElementById('transporte').value;
        const reciclaje = document.querySelector('input[name="reciclaje"]:checked').value;

        let huellaAnual = 0;

        // --- Lógica del Cálculo Simplificado ---

        // 1. Consumo de energía (traducir la opción a un valor numérico)
        switch (energia) {
            case 'alto':
                huellaAnual += 2000; // Valor alto en kg de CO2
                break;
            case 'medio':
                huellaAnual += 1000; // Valor medio
                break;
            case 'bajo':
                huellaAnual += 500; // Valor bajo
                break;
        }

        // 2. Uso de transporte (traducir la opción a un valor numérico)
        switch (transporte) {
            case 'coche_diario':
                huellaAnual += 3500; // Mucho uso de coche
                break;
            case 'transporte_publico':
                huellaAnual += 500; // Uso de transporte público
                break;
            case 'bicicleta':
                huellaAnual += 100; // Uso de bicicleta/a pie
                break;
        }

        // 3. Hábito de reciclaje (ajusta la huella final)
        if (reciclaje === 'si') {
            huellaAnual -= 300; // Resta kg de CO2 por reciclar
        }

        // Mostrar el resultado
        const huellaKg = huellaAnual.toFixed(2);
        huellaValor.textContent = `${huellaKg} kg de CO2`;

        // Determinar si la huella es "buena" o "mala"
        let mensaje = "";
        let clase = "";

        const umbralBuena = 3000;
        const umbralMala = 6000;

        if (huellaAnual < umbralBuena) {
            mensaje = "¡Tu huella de carbono es **buena**! Sigue con tus hábitos sostenibles. ✨";
            clase = "buena";
        } else if (huellaAnual < umbralMala) {
            mensaje = "Tu huella de carbono es **promedio**. Considera pequeños cambios para reducirla. 😉";
            clase = "promedio";
        } else {
            mensaje = "Tu huella de carbono es **alta**. Hay mucho potencial para mejorarla. 🌿";
            clase = "mala";
        }

        mensajeP.innerHTML = mensaje;
        mensajeP.classList.remove("buena", "promedio", "mala");
        mensajeP.classList.add(clase);

        resultadoDiv.classList.remove('hidden');
    });
});
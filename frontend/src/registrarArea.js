const form = document.getElementById('areaForm');
const contenedorMensaje = document.getElementById('mensajeError');

form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Extraemos los datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value
        };

        try {
            // Llamada a tu API de Node.js
            const response = await fetch('http://localhost:3000/area/registrar-area', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                mostrarMensaje('¡Área guardada con éxito!', 'green');
                form.reset();
            } else {
                mostrarMensaje((result.detalles), 'red');
            }
        } catch (error) {
            mostrarMensaje('Error de conexión con el servidor', 'red');
        }
    });

function mostrarMensaje(texto, color) {
    contenedorMensaje.textContent = texto;
    contenedorMensaje.style.display = 'block';
    contenedorMensaje.style.backgroundColor = color === 'green' ? '#d4edda' : '#f8d7da';
    contenedorMensaje.style.color = color === 'green' ? '#155724' : '#721c24';
}
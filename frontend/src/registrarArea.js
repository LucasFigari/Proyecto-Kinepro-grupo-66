const form = document.getElementById('areaForm');
const contenedorMensaje = document.getElementById('mensajeError');

//const rol = sessionStorage.getItem('rol');
//if (!rol || rol !== 'Admin') window.location.href = '/';

form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Extraemos los datos del formulario
        const formData = new FormData();
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('descripcion', document.getElementById('descripcion').value);
        
        const inputImagen = document.getElementById('imagen'); // Asegúrate de tener este ID en tu HTML
        if (inputImagen.files[0]) {
            formData.append('imagen', inputImagen.files[0]);
        }

        try {
            const response = await fetch('http://localhost:3000/area/registrar-area', {
                method: 'POST',
                body: formData // No ponemos Headers de Content-Type, el navegador lo hace solo con FormData
            });

            const result = await response.json();

            if (response.ok) {
                mostrarMensaje('¡Área guardada con éxito!', 'green');
                form.reset();
            } else {
                mostrarMensaje((result.detalles), 'red');
            } 
        } catch (error) {
            mostrarMensaje('el archivo elegido no es una imagen', 'red');
        }
    });

function mostrarMensaje(texto, color) {
    contenedorMensaje.textContent = texto;
    contenedorMensaje.style.display = 'block';
    contenedorMensaje.style.backgroundColor = color === 'green' ? '#d4edda' : '#f8d7da';
    contenedorMensaje.style.color = color === 'green' ? '#155724' : '#721c24';
}
const API_URL = 'http://localhost:3000/area';

async function cargarAreas() {
    try {
        const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error('Error al obtener las áreas');
                
        const areas = await respuesta.json(); 
                
        const container = document.getElementById('areas-container');
        container.innerHTML = ''; 

        areas.forEach(area => {
            const itemHTML = `
                <li class="area-item" data-id="${area.id}">
                    <div class="area-info">
                        <span class="area-name">${area.nombre}</span>
                        <span class="area-details">${area.descripcion || 'Sin descripción'}</span>
                    </div>
                    <button class="btn-delete" title="Eliminar Área" onclick="eliminarAreaDeBD(${area.id}, this)">
                        <span class="material-icons-round">delete</span>
                    </button>
                </li>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });

        actualizarContadorYVistas();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('area-count').textContent = "Error";
    }
}

async function eliminarAreaDeBD(id, boton) {
    if (!confirm('¿Estás seguro de eliminar esta área?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            const filaArea = boton.closest('.area-item');
            filaArea.classList.add('fade-out');

            setTimeout(() => {
                filaArea.remove();
                actualizarContadorYVistas();
            }, 300);
            alert("Se elimino el área exitosamente");
        } else {
            alert('No se pudo eliminar el área del servidor.');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Hubo un problema de conexión.');
    }
}

function actualizarContadorYVistas() {
    const container = document.getElementById('areas-container');
    const contador = document.getElementById('area-count');
    const mensajeVacio = document.getElementById('empty-message');
            
    const totalAreas = container.children.length;
    contador.textContent = totalAreas === 1 ? '1 Área' : `${totalAreas} Áreas`;

    if (totalAreas === 0) {
        contador.style.display = 'none';
        mensajeVacio.style.display = 'block';
    } else {
        contador.style.display = 'block';
        mensajeVacio.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', cargarAreas);
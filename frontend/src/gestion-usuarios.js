const API_URL = 'http://localhost:3000/usuarios';   
const tablaCuerpo = document.getElementById('tabla-pacientes-cuerpo');

const cargarListaUsuarios = async () => {
    try {
        const respuesta = await fetch(API_URL);
        const usuarios = await respuesta.json();

        if (!usuarios || usuarios.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No hay clientes registrados.</td></tr>';
            return;
        }

        tablaCuerpo.innerHTML = usuarios.map(user => `
            <tr>
                <td class="align-middle">${user.nombre}</td>
                <td class="align-middle">${user.apellido || '-'}</td>
                <td class="align-middle">${user.dni}</td>
                <td class="align-middle">${user.email}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-danger fw-bold" onclick="confirmarBaja(${user.id}, '${user.nombre}')">
                        <i class="ti ti-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Error de conexión con el servidor.</td></tr>';
    }
};


cargarListaUsuarios();


function confirmarBaja(idUsuario, nombreUsuario) {
    const deBaja = confirm(`¿Estás seguro de que querés eliminar a ${nombreUsuario}?`);
    
    if (deBaja) {
        fetch(`${API_URL}/${idUsuario}`, {
            method: 'DELETE'
        })
        .then(respuesta => {
            return respuesta.json().then(data => {
                if (respuesta.ok && data.ok) { 
                    alert("Usuario eliminado correctamente.");
                    cargarListaUsuarios();
                } else {
                    alert(data.mensaje || "No se pudo eliminar al usuario de la base de datos.");
                }
            });
        })
        .catch(err => {
            console.error("Error en el fetch:", err);
            alert("Error de conexión con el servidor.");
        });
    }
}


const btnVolver = document.getElementById('btnVolver');

if (btnVolver) {
    const paginaAnterior = document.referrer; 
    
    
    let colorHover = '#6c757d'; 

    
    if (paginaAnterior.includes('index-admin.html')) {
        colorHover = '#00b4d8'; 
    } else if (paginaAnterior.includes('index-secretaria.html')) {
        colorHover = '#2d6a4f'; 
    }

    btnVolver.addEventListener('click', () => {
        window.history.back();
    });

    btnVolver.addEventListener('mouseover', () => {
        btnVolver.style.backgroundColor = colorHover;
        btnVolver.style.borderColor = colorHover;
        btnVolver.style.color = '#ffffff'; // Texto siempre blanco en hover
    });

    btnVolver.addEventListener('mouseout', () => {
        btnVolver.style.backgroundColor = 'transparent';
        btnVolver.style.borderColor = '#6c757d'; // Vuelve al gris original
        btnVolver.style.color = '#6c757d';
    });
}
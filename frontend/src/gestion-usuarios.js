const contenedor = document.querySelector('.main-content');
const btnSidebarGestion = document.getElementById('btnSidebarGestion');

const API_URL = 'http://localhost:3000/usuarios';   

// Guardamos el HTML original apenas arranca la página
let htmlInicioOriginal = contenedor.innerHTML;

// Función principal que arma la pantalla y maneja los datos
const cargarListaUsuarios = async () => {
    
    // estructura de la tabla en el contenedor (sin importar el back)
    contenedor.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <p class="welcome mb-0">Gestión de Usuarios</p>
                <p class="subtitle mb-0">Listado completo de usuarios registrados en KinePro.</p>
            </div>
            <button id="btnVolverAlInicio" class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                <i class="ti ti-arrow-back-up"></i> Volver
            </button>
        </div>
        
        <div class="card p-3 shadow-sm border-0" style="background: white; border-radius: 12px; padding: 1.5rem;">
            <table class="table table-hover mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-pacientes-cuerpo">
                    <tr>
                        <td colspan="5" class="text-center text-muted py-3">
                            <div class="spinner-border spinner-border-sm text-success" role="status"></div> Conectando con el servidor...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    // Vinculo inmediatamente el botón Volver para que no se rompa la navegación
    document.getElementById('btnVolverAlInicio').addEventListener('click', () => {
        contenedor.innerHTML = htmlInicioOriginal;
        reconectarEventos();
    });

    try {
        const respuesta = await fetch(API_URL);
        const tablaCuerpo = document.getElementById('tabla-pacientes-cuerpo');

        if (!respuesta.ok) {
            tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No hay clientes registrados actualmente.</td></tr>';
            return;
        }
        
        const usuarios = await respuesta.json();

        if (!usuarios || usuarios.length === 0) {
            tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No hay clientes registrados actualmente.</td></tr>';
            return;
        }

        // Si hay usuarios válidos, limpiamos la tabla e inyectamos
        tablaCuerpo.innerHTML = '';
        usuarios.forEach(user => {
            const filaHTML = `
                <tr>
                    <td class="align-middle">${user.nombre}</td>
                    <td class="align-middle">${user.apellido || '-'}</td>
                    <td class="align-middle">${user.dni}</td>
                    <td class="align-middle">${user.email}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-danger fw-bold btn-eliminar-dinamico"
                                data-id="${user.id}" data-nombre="${user.nombre}">
                            <i class="ti ti-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            tablaCuerpo.insertAdjacentHTML('beforeend', filaHTML);
        });

        
        document.querySelectorAll('.btn-eliminar-dinamico').forEach(boton => {
            boton.addEventListener('click', () => {
                const idUsuario = boton.getAttribute('data-id');
                const nombreUsuario = boton.getAttribute('data-nombre');
                confirmarBaja(idUsuario, nombreUsuario);
            });
        });

    } catch (error) {
        console.warn("Servidor desconectado, mostrando estado vacío.");
        const tablaCuerpo = document.getElementById('tabla-pacientes-cuerpo');
        if (tablaCuerpo) {
            tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No hay clientes registrados actualmente (Servidor local apagado).</td></tr>';
        }
    }
};

function confirmarBaja(idUsuario, nombreUsuario) {
    const deBaja = confirm(`¿Estás seguro de que querés eliminar a ${nombreUsuario}?`);
    
    if (deBaja) {
        fetch(`${API_URL}/${idUsuario}`, {
            method: 'DELETE'
        })
        .then(respuesta => {
            if (respuesta.ok) {
                alert("Usuario eliminado correctamente.");
                cargarListaUsuarios(); 
            } else {
                alert("No se pudo eliminar al usuario de la base de datos.");
            }
        })
        .catch(err => console.error("Error en el fetch:", err));
    }
}

const reconectarEventos = () => {
    const tarjetaGestion = document.getElementById('tarjetaGestion');
    if (tarjetaGestion) {
        tarjetaGestion.addEventListener('click', cargarListaUsuarios);
    }
};

if (btnSidebarGestion) {
    btnSidebarGestion.addEventListener('click', cargarListaUsuarios);
}
reconectarEventos();
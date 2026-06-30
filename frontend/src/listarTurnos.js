const API_URL = 'http://localhost:3000/turnos';

const container = document.getElementById("turnos-container");
const modal = document.getElementById('modal-paciente');
const modalTurnoId = document.getElementById('modal-turno-id');
const formReserva = document.getElementById('form-reserva');
const btnCancelar = document.getElementById('btn-cancelar');

const inputDni = document.getElementById('paciente-dni');
const btnBuscarPaciente = document.getElementById('btn-buscar-paciente');
const infoPacienteContainer = document.getElementById('info-paciente-container');
const btnConfirmarReserva = document.getElementById('btn-confirmar-reserva');

async function cargarTurnos() {
    const emptyMessage = document.getElementById("empty-message");
    const badgeCount = document.getElementById("turno-count");

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error: el servidor no está disponible');

        const turnos = await respuesta.json();
        container.innerHTML = ''; 

        turnos.forEach(turno => {
            const nombreArea = turno.area?.nombre || "Sin área asignada";

            const itemHTML = `
                <li class="turno-item" data-id="${turno.id}">
                    <div class="turno-info">
                        <span class="turno-area">${nombreArea}</span>
                        <div class="turno-details">
                            <div class="detail-group">
                                <span class="material-icons-round">calendar_today</span>
                                <span>${turno.fecha_turno}</span>
                            </div>
                            <div class="detail-group">
                                <span class="material-icons-round">schedule</span>
                                <span>${turno.hora_comienzo} hs</span>
                            </div>
                            <div class="detail-group">
                                <span class="material-icons-round">attach_money</span>
                                <span>Precio: $${turno.precio}</span>
                            </div>
                            <div class="detail-group">
                                <span class="material-icons-round">people</span>
                                <span>cupos: ${turno.cupo_maximo - turno.cupos_ocupados}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-reservar" title="Reservar para paciente">
                        <span class="btn-text">Reservar para paciente</span>
                    </button>
                </li>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });

    } catch (error) {
        console.error(error.message);
        if (badgeCount) badgeCount.textContent = "!";
        container.innerHTML = "";
        if (emptyMessage) emptyMessage.style.display = "block"; 
    }
}

container.addEventListener('click', (e) => {
    const botonReservar = e.target.closest('.btn-reservar');
    if (botonReservar) {
        const turnoItem = botonReservar.closest('.turno-item');
        const turnoId = turnoItem.dataset.id;
        reservarTurno(turnoId);
    }
});

function reservarTurno(id) {
    modalTurnoId.value = id;
    
    inputDni.value = '';
    infoPacienteContainer.style.display = 'none';
    infoPacienteContainer.innerHTML = ''; 
    
    deshabilitarConfirmacion();
    
    modal.showModal(); 
}

function habilitarConfirmacion() {
    btnConfirmarReserva.disabled = false;
    btnConfirmarReserva.style.opacity = "1";
    btnConfirmarReserva.style.cursor = "pointer";
}

function deshabilitarConfirmacion() {
    btnConfirmarReserva.disabled = true;
    btnConfirmarReserva.style.opacity = "0.5";
    btnConfirmarReserva.style.cursor = "not-allowed";
}

async function buscarPaciente() {
    const dni = inputDni.value.trim();
    if (!dni) return;

    try {
        const respuesta = await fetch(`http://localhost:3000/usuarios/dni/${dni}`); 
        
        if (respuesta.ok) {
            const paciente = await respuesta.json(); 
            
            if (paciente && paciente.id) {
                infoPacienteContainer.style.transition = "none";
                infoPacienteContainer.style.animation = "none";
                infoPacienteContainer.style.backgroundColor = "#e8f5e9";
                infoPacienteContainer.style.borderColor = "#c8e6c9";
                infoPacienteContainer.style.display = 'block';

                infoPacienteContainer.innerHTML = `
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #2e7d32;">Paciente:</p>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #1b5e20; display: flex; flex-direction: column; gap: 4px;">
                        <li><strong>Nombre:</strong> ${paciente.nombre}</li>
                        <li><strong>Apellido:</strong> ${paciente.apellido}</li>
                        <li><strong>DNI:</strong> ${paciente.dni}</li>
                        <li><strong>Email:</strong> ${paciente.email}</li>
                        <li><strong>Teléfono:</strong> ${paciente.telefono}</li>
                    </ul>
                `;

                habilitarConfirmacion();
            } else {
                throw new Error('Paciente no encontrado');
            }
        } else {
            const datosError = await respuesta.json().catch(() => ({}));
            throw new Error(datosError.mensaje || 'Error en el servidor al buscar el paciente');
        }
    } catch (error) {
        infoPacienteContainer.style.transition = "none";
        infoPacienteContainer.style.animation = "none";
        infoPacienteContainer.style.backgroundColor = "#ffebee";
        infoPacienteContainer.style.borderColor = "#ffcdd2";
        infoPacienteContainer.style.display = 'block';
        
        let mensajeError = error.message;
        
        infoPacienteContainer.innerHTML = `
            <p style="margin: 0; font-size: 14px; color: #c62828; font-weight: 600;">
                ${mensajeError}
            </p>
        `;

        deshabilitarConfirmacion();
    }
}

btnBuscarPaciente.addEventListener('click', buscarPaciente);

inputDni.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        buscarPaciente();
    }
});

inputDni.addEventListener('input', () => {
    infoPacienteContainer.style.display = 'none';
    infoPacienteContainer.innerHTML = '';
    deshabilitarConfirmacion();
});

btnCancelar.addEventListener('click', () => {
    modal.close(); 
});

formReserva.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const idTurno = modalTurnoId.value;
    const dniPaciente = inputDni.value;

    try {
        const response = await fetch(`http://localhost:3000/turnos/reservar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                dniUsuario: dniPaciente,
                idTurno: idTurno
            })
        });

        if (response.ok) {
            const datosExito = await response.json();
            
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: datosExito.mensaje || 'Reserva confirmada con éxito',
                confirmButtonColor: '#00a896' 
            });
            
            modal.close(); 
        } else {
            const datosError = await response.json();
            
            infoPacienteContainer.style.transition = "none";
            infoPacienteContainer.style.animation = "none";
            infoPacienteContainer.style.backgroundColor = "#ffebee";
            infoPacienteContainer.style.borderColor = "#ffcdd2";
            infoPacienteContainer.style.display = 'block';

            infoPacienteContainer.innerHTML = `
                <p style="margin: 0; font-size: 14px; color: #c62828; font-weight: 600;">
                    ${datosError.error || 'No se pudo procesar la reserva.'}
                </p>
            `;

            deshabilitarConfirmacion();
        }
        
        cargarTurnos(); 

    } catch (error) {
        alert('Hubo un error al procesar la reserva');
    }
});

document.addEventListener('DOMContentLoaded', cargarTurnos);
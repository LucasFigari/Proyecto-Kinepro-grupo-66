const API_URL = 'http://localhost:3000/turnos';

async function cargarTurnos() {
    const container = document.getElementById("turnos-container");
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
                                <span>cupos: $${turno.cupo_maximo - turno.cupos_ocupados}</span>
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
        badgeCount.textContent = "!";
        container.innerHTML = "";
        emptyMessage.style.display = "block"; 
    }
}

const container = document.getElementById("turnos-container");

container.addEventListener('click', (e) => {
    const botonReservar = e.target.closest('.btn-reservar');
    if (botonReservar) {
        const turnoItem = botonReservar.closest('.turno-item');
        const turnoId = turnoItem.dataset.id;
        
        reservarTurno(turnoId);
    }
});


const modal = document.getElementById('modal-paciente');
const modalTurnoId = document.getElementById('modal-turno-id');
const formReserva = document.getElementById('form-reserva');
const btnCancelar = document.getElementById('btn-cancelar');

function reservarTurno(id) {
    modalTurnoId.value = id;
    
    document.getElementById('paciente-dni').value = '';
    
    modal.showModal(); 
}

btnCancelar.addEventListener('click', () => {
    modal.close(); 
});

formReserva.addEventListener('submit', async (e) => {
    
    const idTurno = modalTurnoId.value;
    const dniPaciente = document.getElementById('paciente-dni').value;

    console.log(`Enviando reserva: Turno ID ${idTurno} para el Paciente DNI ${dniPaciente}`);

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
            
            //localStorage.setItem('turnoIdSeleccionado', modalTurnoId.value);

            //window.location.href = 'seleccion-de-pago.html';
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: datosExito.mensaje || 'Reserva confirmada con éxito',
                confirmButtonColor: '#00a896' 
            });
            
            modal.close(); 
            cargarTurnos();
        } else {
            const datosError = await response.json();
            
            Swal.fire({
                icon: 'error',
                title: 'Atención',
                text: datosError.error || 'No se pudo procesar la reserva',
                confirmButtonColor: '#e63946' 
            });
        }
        
        cargarTurnos(); 

    } catch (error) {
        alert('Hubo un error al procesar la reserva');
    }
});

document.addEventListener('DOMContentLoaded', cargarTurnos);
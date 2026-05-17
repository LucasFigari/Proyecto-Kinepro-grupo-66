import './style.css';

// 1. Tus datos simulados (mientras esperás al grupo)
const areasSimuladas = [
    {
        id: 1,
        nombre: 'Tren Superior',
        descripcion: 'Rehabilitación y fortalecimiento de hombros, brazos y zona cervical.',
        imagen_url: './src/imagenes/TrenSuperior.png'
    },
    {
        id: 2,
        nombre: 'Tren Intermedio',
        descripcion: 'Núcleo de estabilidad del cuerpo, zona lumbar y abdominal.',
        imagen_url: './src/imagenes/TrenMedio.png'
    },
    {
        id: 3,
        nombre: 'Tren Inferior',
        descripcion: 'Recuperación de la marcha y estabilidad de cadera a pies.',
        imagen_url: './src/imagenes/TrenInferior.png'
    }
];

// 2. Función principal
function mostrarHome() {
    const app = document.querySelector('#app');
    
    app.innerHTML = `
        <header id="barra-superior" class="shadow-sm">
            <div class="container d-flex align-items-center">
                <img id="logo-kinepro" src="./src/imagenes/logo.png.png" alt="Logo KinePro">
                <button id="iniciarSesion">Iniciar Sesion</button>
            </div>
        </header>

        <main class="container py-5 text-center">
    <h1 class="fw-light mt-4">Bienvenido a KinePro</h1>
    <p class="lead text-secondary mb-0">Centro de kinesiología.</p>
    
    <hr class="linea-separadora">
    
    <div class="row g-4 mt-5"> ${areasSimuladas.map(area => `
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <img src="${area.imagen_url}" class="card-img-top" alt="${area.nombre}" 
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" style="color: #107391; font-weight: bold;">${area.nombre}</h5>
                        <p class="card-text text-muted small">${area.descripcion}</p>
                        <button id="detalles" class="btn mt-auto" style="background-color: #D1E9F0; color: #107391; font-weight: bold;">
                            Ver tratamientos
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
</main>
        <!-- Modal de login -->
        <div id="modalLogin" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
            <div style="background:white; padding:2rem; border-radius:12px; width:100%; max-width:400px;">
                <h4 style="color:#107391; margin-bottom:1.5rem;">Iniciar Sesión</h4>
                <div style="margin-bottom:1rem;">
                    <label>DNI</label>
                    <input id="inputDni" type="text" placeholder="Ingresá tu DNI" 
                           style="width:100%; padding:0.5rem; margin-top:0.3rem; border:1px solid #ccc; border-radius:6px;">
                </div>
                <div style="margin-bottom:1rem;">
                    <label>Contraseña</label>
                    <input id="inputPassword" type="password" placeholder="Ingresá tu contraseña"
                           style="width:100%; padding:0.5rem; margin-top:0.3rem; border:1px solid #ccc; border-radius:6px;">
                </div>
                <p id="errorLogin" style="color:red; display:none; font-size:0.9rem;"></p>
                <div style="display:flex; gap:1rem; margin-top:1.5rem;">
                    <button id="btnConfirmar" style="flex:1; padding:0.6rem; background:#107391; color:white; border:none; border-radius:6px; cursor:pointer;">
                        Confirmar
                    </button>
                    <button id="btnCancelar" style="flex:1; padding:0.6rem; background:#eee; border:none; border-radius:6px; cursor:pointer;">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;


    const modal = document.getElementById('modalLogin');

    //Abro el modal de iniciar sesion
    document.getElementById('iniciarSesion').addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    //Cierro el modal de iniciar sesion
    document.getElementById('btnCancelar').addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('errorLogin').style.display = 'none';
        document.getElementById('inputDni').value = '';
        document.getElementById('inputPassword').value = '';
    });

    //Confirmar el login
    document.getElementById('btnConfirmar').addEventListener('click', async () => {
        const dni = document.getElementById('inputDni').value.trim();
        const password = document.getElementById('inputPassword').value.trim();
        const errorEl = document.getElementById('errorLogin');

        if(!dni || !password){
            errorEl.textContent = "Deben rellenarse todos los campos";
            errorEl.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni, password })
            });
            const data = await response.json();

            if(data.ok){
                modal.style.display = 'none';
                alert(`¡Bienvenido ${data.datos.nombre}!`);
                // SI HACE FALTA, ACA SE PUEDE REDIRIGIR A OTRA PAGINA SEGUN EL ROL (data.rol)
                if(data.rol === 'Secretaria'){
                    window.location.href = 'index-secretaria.html';
                }else if(data.rol === 'Kinesiologo'){
                    window.location.href = 'index-kinesiologo.html';
                }else if(data.rol === 'Admin'){
                    window.location.href = 'index-admin.html';
                }else {
                    window.location.href = 'usuario.html';
                }
            }else {
                errorEl.textContent = data.mensaje;
                errorEl.style.display = 'block';
            }

        } catch (error) {
            errorEl.textContent = "Error al conectar con el servidor.";
            errorEl.style.display = 'block';
        }
    });
}

    


document.addEventListener('DOMContentLoaded', mostrarHome);

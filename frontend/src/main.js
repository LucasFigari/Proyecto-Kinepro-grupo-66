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
    `;
}

// 3. Ejecución
document.addEventListener('DOMContentLoaded', mostrarHome);
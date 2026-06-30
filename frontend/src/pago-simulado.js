const urlParams = new URLSearchParams(window.location.search)
const idTurno = urlParams.get("idTurno")
const idUsuario = urlParams.get("idUsuario")
const precioBruto = parseFloat(urlParams.get("precio"))

const hoy = new Date()
const dia = hoy.getDate()
const tieneDescuento = dia >= 14 && dia <= 16
const montoFinal = tieneDescuento ? precioBruto * 0.8 : precioBruto

// mostrar monto
document.getElementById("montoMostrar").textContent = `$ ${montoFinal.toFixed(2)}`
if(tieneDescuento){
    document.getElementById("mensajeDescuento").style.display = "block"
}

// formatear número de tarjeta
document.getElementById("numeroTarjeta").addEventListener("input", function(){
    let valor = this.value.replace(/\D/g, "").substring(0, 16)
    this.value = valor.replace(/(.{4})/g, "$1 ").trim()
})

// formatear vencimiento
document.getElementById("vencimiento").addEventListener("input", function(){
    let valor = this.value.replace(/\D/g, "").substring(0, 4)
    if(valor.length >= 2) valor = valor.substring(0, 2) + "/" + valor.substring(2)
    this.value = valor
})

document.getElementById("btnPagar").addEventListener("click", async () => {
    const numeroTarjeta = document.getElementById("numeroTarjeta").value.replace(/\s/g, "")
    const titular = document.getElementById("titular").value.trim()
    const vencimiento = document.getElementById("vencimiento").value.trim()
    const cvv = document.getElementById("cvv").value.trim()
    const mensaje = document.getElementById("mensaje")

    // validaciones básicas
    if(!numeroTarjeta || !titular || !vencimiento || !cvv){
        mensaje.textContent = "❌ Completá todos los campos."
        mensaje.className = "mensaje error"
        return
    }

    if(numeroTarjeta.length < 16){
        mensaje.textContent = "❌ El número de tarjeta debe tener 16 dígitos."
        mensaje.className = "mensaje error"
        return
    }

    try {
        const res = await fetch("http://localhost:3000/pago-simulado/pagar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ numeroTarjeta, titular, vencimiento, cvv, idTurno, idUsuario })
        })

        const data = await res.json()

        if(data.ok){
            mensaje.textContent = `✅ ${data.mensaje} Monto abonado: $${data.montoAbonado.toFixed(2)}`
            mensaje.className = "mensaje exito"
            setTimeout(() => {
                window.location.href = "./index-usuario.html"
            }, 2000)
        } else {
            mensaje.textContent = `❌ ${data.mensaje}`
            mensaje.className = "mensaje error"
        }

    } catch(error) {
        mensaje.textContent = "❌ Error de conexión con el servidor."
        mensaje.className = "mensaje error"
    }
})
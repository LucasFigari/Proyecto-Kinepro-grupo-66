const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombreRegistro"))
const apellido = /** @type {HTMLInputElement} */ ( document.getElementById("apellidoRegistro"))
const fechaNacimiento = /** @type {HTMLInputElement} */ (document.getElementById("fechaNacimiento"))
const dni = /** @type {HTMLInputElement} */ ( document.getElementById("dniRegistro"))
const email = /** @type {HTMLInputElement} */ ( document.getElementById("emailRegistro"))
const telefono = /** @type {HTMLInputElement} */ ( document.getElementById("telefonoRegistro"))
const contraseña = /** @type {HTMLInputElement} */ (document.getElementById("contraseñaRegistro"))
const puestoTrabajo = /** @type {HTMLSelectElement} */ (document.getElementById("puestoTrabajo"))


function validarCampoNombre(nom){
    
    let esValido = false

    if((nom != "")){

        if(nom.length >= 3 && nom.length <= 30){

            if(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(nom)){
                esValido = true;
            }

            else{
                //avisar en pantalla formato invalido
            }
        }

        else{
            //avisar en pantalla limite de caracteres
        }
    }

    else{
        //avisar en pantalla campo vacio
    }
        
    
    
    return esValido
}

function validarCampoApellido(ape){
    
    let esValido = false

    if((ape != "")){

        if(ape.length >= 3 && ape.length <= 30){

            if(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(ape)){
                esValido = true;
            }

            else{
                //avisar en pantalla formato invalido
            }
        }

        else{
            //avisar en pantalla limite de caracteres
        }
    }

    else{
        //avisar en pantalla campo vacio
    }
        
    
    
    return esValido
}

function validarCampoFechaNacimiento(fechaNac){
    
    let esValido = false

    if(fechaNac != ""){
        let fechaAuxiliar = new Date(fechaNac)    //comprueba que fecha no sea vacío y que no sea una fecha futura a la actual
        let fechaHoy = new Date()
        if(fechaAuxiliar <= fechaHoy){
            esValido = true
        }
        else{
            //avisar que la fecha debe ser menor a la de hoy
        }
    }
    else{
        //avisar que falta completar la fecha
    }

    return esValido

}

async function validarCampoDni(dniParametro){
    let esValido = false;

    if(dniParametro != ""){

        if(/^\d{7,8}$/.test(dniParametro)){ //testeo que el dni cumpla el formato

            const res = await fetch(`http://localhost:3000/personal/verificar-dni/${dniParametro}`)
            const data = await res.json()

            if(!(data.existe)){

                esValido = true

            }
            else{
                //avisar que dni ya existe en la bd del personal
            }

        }
        
        else{
            //avisar dni invalido
        }

    }

    else{
        //avisar campo vacio
    }

    return esValido
}

async function validarCampoEmail(correo){

    let esValido = false;

    if(correo != ""){

        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){ //testeo que el correo cumpla el formato

            const res = await fetch(`http://localhost:3000/personal/verificar-email/${correo}`)
            const data = await res.json()

            if(!(data.existe)){
                esValido = true
            }
            else{
                //avisar que ya existe el email en la bd del personal
            }

        }
        
        else{
            //avisar correo invalido
        }

    }

    else{
        //avisar campo vacio
    }

    return esValido
}


function validarCampoTelefono(tel){
    
    let esValido = false

    if(tel != ""){ //verifico que no sea vacio el campo

        if(/^\d{8,15}$/.test(tel)){ //testeo que el numero de telefono no tenga caracteres, cantidad digitos etc.
            
            esValido = true
        }

        else{
            //avisar que telefono debe ser entre 8 y 15 digitos numericos
        }

    }

    else{
        //avisar campo vacio
    }

    return esValido

}


function validarCampoContraseña(cont){

    let esValido = false

    if(cont != ""){  //verifica que no sea vacio el campo

        if(cont.length >= 8 && cont.length <= 12){

            esValido = true

        }

        else{
            //avisar que contraseña debe tener entre 8 y 12 caracteres
        }

    }

    else{
        //informar campo vacio
    }

    return esValido

}

function validarCampoPuestoTrabajo(pt){
    
    let esValido = false

    if(pt != ""){       //verifica que no sea vacio el campo
        esValido=true
    }
    else{
        //avisar que se seleccione una opcion
    }

    return esValido

}


async function formularioValido(){  

    return (
            validarCampoNombre(nombre.value.trim()) 
            && validarCampoApellido(apellido.value.trim()) 
            && validarCampoFechaNacimiento(fechaNacimiento.value)
            && await validarCampoDni(dni.value.trim())              //nota: puse && en lugar de & para hacer cortocircuito (apenas una este mal no sigue evaluando)
            && await validarCampoEmail(email.value.trim())         //si se quiere cambiar y que se evalue todo, hay que usar &
            && validarCampoTelefono(telefono.value.trim())
            && validarCampoContraseña(contraseña.value.trim())
            && validarCampoPuestoTrabajo(puestoTrabajo.value)
        )
}



const formulario = document.getElementById("formRegistroPersonal")

formulario.addEventListener("submit", async e =>{
    e.preventDefault()
    
    if(await formularioValido()){  //se llama al metodo formularioValido() y si todos los campos están "Ok" se devuelve true
        
        const personalTrabajo = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            fechaNac: fechaNacimiento.value,
            dni: dni.value.trim(),
            email: email.value.trim(),                            //Creo el objeto que contiene los datos del personal
            telefono: telefono.value.trim(),
            password: contraseña.value,
            rol: puestoTrabajo.value
        }

        fetch("http://localhost:3000/personal/registrar", {   
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(personalTrabajo)                  //convierto el objeto a archivo json
        })

        .then(res => res.json())
        .then(data => {
            if(data.ok){     //verifico que se subió
                alert("Personal registrado correctamente")
               // window.location.href = "link de la pestaña en la que esté la lista de trabajadores"  IMPORTANTE: MODIFICAR ESTA LINEA 
            }
        })
        .catch(error => {
            console.error("Error al registrar:", error)  //caso de error
            alert("Hubo un error al registrar el Personal")
        })

    }
})
    
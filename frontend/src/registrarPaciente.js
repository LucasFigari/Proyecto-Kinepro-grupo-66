const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombreRegistro"))
const apellido = /** @type {HTMLInputElement} */ ( document.getElementById("apellidoRegistro"))
const dni = /** @type {HTMLInputElement} */ ( document.getElementById("dniRegistro"))
const email = /** @type {HTMLInputElement} */ ( document.getElementById("emailRegistro"))
const telefono = /** @type {HTMLInputElement} */ ( document.getElementById("telefonoRegistro"))
const contraseña = /** @type {HTMLInputElement} */ (document.getElementById("contraseñaRegistro"))


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

async function validarCampoDni(dniParametro){
    let esValido = false;

    if(dniParametro != ""){

        if(/^\d{7,8}$/.test(dniParametro)){

            const res = await fetch(`http://localhost:3000/usuarios/verificar-dni/${dniParametro}`) //envio el mensaje para verificar el dni enviado como parametro

            const data = await res.json()  //recibo la respuesta

            if(!(data.existe)){  //si no existe en la bd, se puede crear

                esValido = true
            }
            else{
                //avisar dni ya se encuentra registrado en el sistema
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

        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){

            const res = await fetch(`http://localhost:3000/usuarios/verificar-email/${correo}`)
            const data = await res.json()

            if(!(data.existe)){

                esValido = true

            }
            else{
                //avisar email ya se encuentra registrado en el sistema
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

    if(tel != ""){

        if(/^\d{8,15}$/.test(tel)){
            
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

    if(cont != ""){

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



async function formularioValido(){  

    return (
            validarCampoNombre(nombre.value.trim()) 
            && validarCampoApellido(apellido.value.trim()) 
            && await validarCampoDni(dni.value.trim())              //nota: puse && en lugar de & para hacer cortocircuito (apenas una este mal no sigue evaluando)
            && await validarCampoEmail(email.value.trim())         //si se quiere cambiar y que se evalue todo, hay que usar &
            && validarCampoTelefono(telefono.value.trim())
            && validarCampoContraseña(contraseña.value.trim())
        )
}



const formulario = document.getElementById("formRegistroPaciente")

formulario.addEventListener("submit", async e =>{
    e.preventDefault()
    
    if(await formularioValido()){  //se llama al metodo formularioValido() y si todos los campos están "Ok" se devuelve true
        
        const paciente = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            dni: dni.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim(),
            password: contraseña.value
        }

        fetch("http://localhost:3000/usuarios/registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paciente)
        })

        .then(res => res.json())
        .then(data => {
            if(data.ok){     //verifico que se subió
                alert("Usuario registrado correctamente")
                window.location.href = "../menuPrincipal.html"// redirige al menu principal (si el archivo tiene otro nombre/ruta hay que cambiar esta ruta)
            }
        })
        .catch(error => {
            console.error("Error al registrar:", error)
            alert("Hubo un error al registrar el usuario")
        })

    }
})
    

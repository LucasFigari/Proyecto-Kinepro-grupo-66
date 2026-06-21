export function validarCamposVacios(campos){
    for(const valor of Object.values(campos)){
        if(!valor) return false;
    }
    return true;
}

export function validarLongitud(texto, min, max){
    return texto.length >= min && texto.length <= max;
}

export function validarTelefono(telefono){
    const telefonoRegex = /^\d{7,8}$/
    return telefonoRegex.test(telefono)
}

export function validarDni(dni) {
    const dniRegex = /^\d{7,8}$/
    return dniRegex.test(dni)
}

export function validarPassword(password) {
    return password.length >= 6 && password.length <= 12
}
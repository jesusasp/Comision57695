

document.addEventListener("DOMContentLoaded", function() {
    const iniciarButton = document.getElementById("iniciarButton");
    const consultaSaldoButton = document.getElementById("consultaSaldo");
    const pagoDeudasButton = document.getElementById("pagoDeudas");
    const agregarAmigosButton = document.getElementById("agregarAmigosButton");
    const editarAmigosButton = document.getElementById("editarAmigos");
    const cerrarSesionButton = document.getElementById("cerrarSesion");
    const formularioAgregarAmigos = document.getElementById("agregarAmigos");
    const finalizarAgregarAmigosButton = document.getElementById("finalizarAgregarAmigos");
    const saldoElement = document.getElementById("saldo");
    const verAmigosButton = document.getElementById("verAmigos");
    const cuerpoTablaAmigos = document.getElementById("cuerpoTablaAmigos");
    const depositoSection = document.getElementById("depositoSection"); 
    const cantidadDepositoInput = document.getElementById("cantidadDeposito");
    const realizarDepositoButton = document.getElementById("realizarDeposito");
    const mensajeDeposito = document.getElementById("mensajeDeposito");

    let saldo = 1000;
    let amigos = [];

    iniciarButton.addEventListener("click", function() {
        const passwordInput = document.getElementById("passwordInput").value;
        const claveGuardada = "123"; // Contraseña almacenada

        if (passwordInput === claveGuardada) {
            console.log("Contraseña correcta");
            document.getElementById("funcionalidades").style.display = "block";
            document.getElementById("cierreSesion").style.display = "block";
            document.getElementById("inicioSesion").style.display = "none";
        } else {
            alert("Contraseña incorrecta. Intenta nuevamente.");
        }
    });

        function Amigo(nombre, deuda) {
            this.nombre = nombre;
            this.deuda = deuda;

            this.decirDeuda = function() {
            return "Tu deuda con " + this.nombre + " es de " + this.deuda;
            }
        }

        function pagarDeuda(amigos, saldo) {
        let amigoAPagar = prompt("Ingrese el nombre del amigo al que desea pagarle la deuda:");

        let amigoEncontrado = amigos.find(amigo => {
        return amigo.nombre.toLowerCase() === amigoAPagar.toLowerCase();
        });

        if (amigoEncontrado) { 
        let cantidadAPagar = parseFloat(prompt("Ingrese la cantidad que desea pagar a " + amigoAPagar + ". Tu saldo actual es: " + saldo));

        while (isNaN(cantidadAPagar) || cantidadAPagar <= 0 || cantidadAPagar > saldo || cantidadAPagar > amigoEncontrado.deuda) {
            if (isNaN(cantidadAPagar) || cantidadAPagar <= 0) {
            alert("La cantidad a pagar debe ser un número mayor que 0.");
            } else if (cantidadAPagar > saldo) {
            alert("No tienes suficiente saldo para realizar esta operación.");
            } else {
            alert("La cantidad a pagar no puede ser mayor que la deuda actual de " + amigoAPagar + ".");
            }
            cantidadAPagar = parseFloat(prompt("Ingrese la cantidad que desea pagar a " + amigoAPagar));
        }

        amigoEncontrado.deuda -= cantidadAPagar;
        saldo -= cantidadAPagar;
        console.log("Has pagado " + cantidadAPagar + " a " + amigoAPagar + ". La nueva deuda es de " + amigoEncontrado.deuda);
        console.log("Tu nuevo saldo es: " + saldo);
        } else {
        alert("El amigo ingresado no corresponde a ningún contacto.");
        }
        return saldo;
        }

        function actualizarSaldo() {
            saldoElement.textContent = "Tu saldo es: " + saldo;
            saldoElement.style.display = "block"; 
        }

    consultaSaldoButton.addEventListener("click", function() {
        actualizarSaldo();
        consultaSaldoButton.textContent = "Actualizar";
    });

    depositoSection.addEventListener("click", function() { 
        depositoSection.style.display = "block";
    });
    
    realizarDepositoButton.addEventListener("click", function() {
        const cantidadDeposito = parseFloat(cantidadDepositoInput.value);
    
        if (!isNaN(cantidadDeposito) && cantidadDeposito > 0) {
            saldo += cantidadDeposito;
            mensajeDeposito.textContent = "Se ha depositado $" + cantidadDeposito + ". Tu nuevo saldo es: $" + saldo;
            mensajeDeposito.style.display = "block";
    
            depositoSection.style.display = "none";
    
            actualizarSaldo();
        } else {
            mensajeDeposito.textContent = "Por favor, ingresa una cantidad válida para depositar.";
            mensajeDeposito.style.display = "block";
        }
    });

    pagoDeudasButton.addEventListener("click", function() {
            saldo = pagarDeuda(amigos, saldo);
    });


    function mostrarAmigos() {
        cuerpoTablaAmigos.innerHTML = "";

        amigos.forEach(function(amigo) {
            const fila = document.createElement("tr");
            const celdaNombre = document.createElement("td");
            const celdaDeuda = document.createElement("td");

            celdaNombre.textContent = amigo.nombre;
            celdaDeuda.textContent = amigo.deuda;

            fila.appendChild(celdaNombre);
            fila.appendChild(celdaDeuda);

            cuerpoTablaAmigos.appendChild(fila);
        });
    }

    verAmigosButton.addEventListener("click", function() {
        tablaAmigos.style.display = "block"; 
        mostrarAmigos();
        verAmigosButton.textContent = "Actualizar lista de amigos"
    });

    agregarAmigosButton.addEventListener("click", function() {
        agregarAmigosButton.style.display = "none";
        formularioAgregarAmigos.style.display = "block";
        finalizarAgregarAmigosButton.style.display = "inline-block";
    });
    
        formularioAgregarAmigos.addEventListener("submit", function(event) {
            event.preventDefault();
        
            const nombre = document.getElementById("nombreAmigo").value;
            const deuda = parseFloat(document.getElementById("deudaAmigo").value);
        
            if (isNaN(deuda) || deuda < 0) {
                alert("La deuda debe ser un número positivo.");
                return;
            }
        
            amigos.push(new Amigo(nombre, deuda));
        
            document.getElementById("nombreAmigo").value = "";
            document.getElementById("deudaAmigo").value = "";
        
            formularioAgregarAmigos.style.display = "none";
            finalizarAgregarAmigosButton.style.display = "inline-block";
            agregarAmigosButton.style.display = "block";
        });
        
        finalizarAgregarAmigosButton.addEventListener("click", function() {
            formularioAgregarAmigos.style.display = "none";
            finalizarAgregarAmigosButton.style.display = "none";
            agregarAmigosButton.style.display = "block";
        });  
    
    editarAmigosButton.addEventListener("click", function() {
        let opcionEditar = prompt("Seleccione una opción:\n a - Editar deudas \n b - Borrar amigo");

        switch (opcionEditar) {
        case "a":
            let amigoEditar = prompt("Ingrese el nombre del amigo cuya deuda desea editar:");

            let amigoEncontrado = amigos.find(function(amigo) {
            return amigo.nombre.toLowerCase() === amigoEditar.toLowerCase();
            });

            if (amigoEncontrado) {
                let nuevaDeuda = parseFloat(prompt("Ingrese la nueva deuda para " + amigoEditar));

                while (nuevaDeuda < 0 || isNaN(nuevaDeuda)) {
                    alert("La deuda debe ser un número positivo.");
                    nuevaDeuda = parseFloat(prompt("Ingrese la nueva deuda para " + amigoEditar + " (debe ser un número positivo):"));
                }

                amigos.forEach(function(amigo) {
                    if (amigo.nombre === amigoEditar) {
                    amigo.deuda = nuevaDeuda;
                    }
                });
            } else {
            alert("El amigo ingresado no corresponde a ningún contacto.");
            }

            break;
        case "b":
            let amigoBorrar = prompt("Ingrese el nombre del amigo que desea borrar:");

            let amigoAEliminar = amigos.findIndex(function(amigo) {
            return amigo.nombre === amigoBorrar;
            });

            if (amigoAEliminar !== -1) {
            amigos.splice(amigoAEliminar, 1);
            } else { 
            alert("El amigo ingresado no corresponde a ningún contacto.");
            }

            break;
        default:
            alert("Opción no válida");
            break;
        }
    });

    cerrarSesionButton.addEventListener("click", function() {
        // Aqui seria el codigo para cerrar la sesion
        // Mostrar seccion de inicio de sesion
        document.getElementById("inicioSesion").style.display = "block";
        // Ocultar seccion de funcionalidades y cierre de sesion
        document.getElementById("funcionalidades").style.display = "none";
        document.getElementById("cierreSesion").style.display = "none";
    });
});

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
    const cantidadDepositoInput = document.getElementById("cantidadDeposito");
    const realizarDepositoButton = document.getElementById("realizarDeposito");
    const mensajeDeposito = document.getElementById("mensajeDeposito");
    const tablaAmigos = document.getElementById("tablaAmigos");
    const mensajesElement = document.getElementById("mensajes");

    const promptContainer = document.getElementById("promptContainer");
    const promptTitle = document.getElementById("promptTitle");
    const promptInput = document.getElementById("promptInput");
    const promptOkButton = document.getElementById("promptOkButton");
    const promptCancelButton = document.getElementById("promptCancelButton");

    let saldo = 1000;
    let amigos = [];
    let currentPromptCallback;
    let promptQueue = [];

    function mostrarElemento(elemento) {
        elemento.classList.remove('hidden');
    }

    function ocultarElemento(elemento) {
        elemento.classList.add('hidden');
    }

    function mostrarMensaje(mensaje) {
        mensajesElement.textContent = mensaje;
        mostrarElemento(mensajesElement);
        setTimeout(() => {
            ocultarElemento(mensajesElement);
        }, 5000);
    }

    function mostrarPrompt(titulo, callback) {
        if (currentPromptCallback) {
            promptQueue.push({ titulo, callback });
        } else {
            promptTitle.textContent = titulo;
            promptInput.value = '';
            currentPromptCallback = callback;
            mostrarElemento(promptContainer);
        }
    }

    function procesarSiguientePrompt() {
        if (promptQueue.length > 0) {
            const siguientePrompt = promptQueue.shift();
            mostrarPrompt(siguientePrompt.titulo, siguientePrompt.callback);
        }
    }

    function Amigo(nombre, deuda) {
        this.nombre = nombre;
        this.deuda = deuda;
    }

    function pagarDeuda(amigos, saldo) {
        mostrarPrompt("Ingrese el nombre del amigo al que desea pagarle la deuda:", function(amigoAPagar) {
            let amigoEncontrado = amigos.find(amigo => amigo.nombre.toLowerCase() === amigoAPagar.toLowerCase());

            if (amigoEncontrado) {
                mostrarPrompt(`Ingrese la cantidad que desea pagar a ${amigoAPagar}. Tu saldo actual es: ${saldo}`, function(cantidadAPagar) {
                    cantidadAPagar = parseFloat(cantidadAPagar);

                    if (isNaN(cantidadAPagar) || cantidadAPagar <= 0 || cantidadAPagar > saldo || cantidadAPagar > amigoEncontrado.deuda) {
                        alert("La cantidad ingresada no es válida.");
                        return;
                    }

                    amigoEncontrado.deuda -= cantidadAPagar;
                    saldo -= cantidadAPagar;
                    mostrarMensaje(`Has pagado ${cantidadAPagar} a ${amigoAPagar}. La nueva deuda es de ${amigoEncontrado.deuda}. Tu nuevo saldo es: ${saldo}`);
                    mostrarAmigos(); // Actualizar la lista de amigos
                });
            } else {
                alert("El amigo ingresado no corresponde a ningún contacto.");
            }
        });
        return saldo;
    }

    function actualizarSaldo() {
        saldoElement.textContent = `Tu saldo es: ${saldo}`;
        mostrarElemento(saldoElement);
    }

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

    iniciarButton.addEventListener("click", function() {
        const passwordInput = document.getElementById("passwordInput").value;
        const claveGuardada = "123"; // Contraseña almacenada

        if (passwordInput === claveGuardada) {
            mostrarMensaje("Contraseña correcta. Bienvenido.");
            mostrarElemento(document.getElementById("funcionalidades"));
            mostrarElemento(document.getElementById("cierreSesion"));
            ocultarElemento(document.getElementById("inicioSesion"));
        } else {
            alert("Contraseña incorrecta. Intenta nuevamente.");
        }
    });

    consultaSaldoButton.addEventListener("click", function() {
        actualizarSaldo();
    });

    realizarDepositoButton.addEventListener("click", function() {
        const cantidadDeposito = parseFloat(cantidadDepositoInput.value);

        if (!isNaN(cantidadDeposito) && cantidadDeposito > 0) {
            saldo += cantidadDeposito;
            mensajeDeposito.textContent = `Se ha depositado $${cantidadDeposito}. Tu nuevo saldo es: $${saldo}`;
            mostrarElemento(mensajeDeposito);
            cantidadDepositoInput.value = ''; // Limpiar el input
            actualizarSaldo();
        } else {
            mensajeDeposito.textContent = "Por favor, ingresa una cantidad válida para depositar.";
            mostrarElemento(mensajeDeposito);
        }
    });

    pagoDeudasButton.addEventListener("click", function() {
        saldo = pagarDeuda(amigos, saldo);
    });

    verAmigosButton.addEventListener("click", function() {
        mostrarElemento(tablaAmigos);
        mostrarAmigos();
    });

    agregarAmigosButton.addEventListener("click", function() {
        ocultarElemento(agregarAmigosButton);
        mostrarElemento(formularioAgregarAmigos);
        mostrarElemento(finalizarAgregarAmigosButton);
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

        ocultarElemento(formularioAgregarAmigos);
        mostrarElemento(agregarAmigosButton);
        mostrarAmigos(); // Actualizar la lista de amigos
    });

    finalizarAgregarAmigosButton.addEventListener("click", function() {
        ocultarElemento(formularioAgregarAmigos);
        ocultarElemento(finalizarAgregarAmigosButton);
        mostrarElemento(agregarAmigosButton);
    });

    editarAmigosButton.addEventListener("click", function() {
        mostrarPrompt("Seleccione una opción:\n a - Editar deudas \n b - Borrar amigo", function(opcionEditar) {
            switch (opcionEditar) {
                case "a":
                    mostrarPrompt("Ingrese el nombre del amigo cuya deuda desea editar:", function(amigoEditar) {
                        let amigoEncontrado = amigos.find(amigo => amigo.nombre.toLowerCase() === amigoEditar.toLowerCase());

                        if (amigoEncontrado) {
                            mostrarPrompt(`Ingrese la nueva deuda para ${amigoEditar}`, function(nuevaDeuda) {
                                nuevaDeuda = parseFloat(nuevaDeuda);

                                if (nuevaDeuda < 0 || isNaN(nuevaDeuda)) {
                                    alert("La deuda debe ser un número positivo.");
                                    return;
                                }

                                amigoEncontrado.deuda = nuevaDeuda;
                                mostrarMensaje(`La deuda de ${amigoEditar} ha sido actualizada a ${nuevaDeuda}.`);
                                mostrarAmigos(); // Actualizar la lista de amigos
                            });
                        } else {
                            alert("El amigo ingresado no corresponde a ningún contacto.");
                        }
                    });
                    break;
                case "b":
                    mostrarPrompt("Ingrese el nombre del amigo que desea borrar:", function(amigoBorrar) {
                        let amigoAEliminar = amigos.findIndex(amigo => amigo.nombre.toLowerCase() === amigoBorrar.toLowerCase());

                        if (amigoAEliminar !== -1) {
                            amigos.splice(amigoAEliminar, 1);
                            mostrarMensaje(`El amigo ${amigoBorrar} ha sido eliminado.`);
                            mostrarAmigos(); // Actualizar la lista de amigos
                        } else {
                            alert("El amigo ingresado no corresponde a ningún contacto.");
                        }
                    });
                    break;
                default:
                    alert("Opción no válida");
                    break;
            }
        });
    });

    cerrarSesionButton.addEventListener("click", function() {
        mostrarElemento(document.getElementById("inicioSesion"));
        ocultarElemento(document.getElementById("funcionalidades"));
        ocultarElemento(document.getElementById("cierreSesion"));
        ocultarElemento(tablaAmigos); // Ocultar la tabla de amigos al cerrar sesión
        mostrarMensaje("Sesión cerrada.");
    });

    promptOkButton.addEventListener("click", function() {
        if (currentPromptCallback) {
            currentPromptCallback(promptInput.value);
            currentPromptCallback = null;
        }
        ocultarElemento(promptContainer);
        procesarSiguientePrompt();
    });

    promptCancelButton.addEventListener("click", function() {
        ocultarElemento(promptContainer);
        currentPromptCallback = null;
        procesarSiguientePrompt();
    });

    // Cargar datos desde un JSON local
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            amigos = data.map(item => new Amigo(item.nombre, item.deuda));
            mostrarAmigos();
        })
        .catch(error => console.error('Error cargando datos:', error));
});

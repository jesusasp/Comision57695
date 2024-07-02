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

    let saldo = 1000;
    let amigos = [];

    function mostrarElemento(elemento) {
        elemento.classList.remove('hidden');
    }

    function ocultarElemento(elemento) {
        elemento.classList.add('hidden');
    }

    function mostrarMensaje(mensaje) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: mensaje,
            timer: 5000,
            showConfirmButton: false
        });
    }

    function mostrarPrompt(titulo, callback) {
        Swal.fire({
            title: titulo,
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                callback(result.value);
            }
        });
    }

    function Amigo(nombre, deuda) {
        this.nombre = nombre;
        this.deuda = deuda;
    }

    function guardarAmigosEnLocalStorage() {
        localStorage.setItem('amigos', JSON.stringify(amigos));
    }

    function cargarAmigosDesdeLocalStorage() {
        const amigosGuardados = localStorage.getItem('amigos');
        if (amigosGuardados) {
            amigos = JSON.parse(amigosGuardados).map(item => new Amigo(item.nombre, item.deuda));
            mostrarAmigos();
        }
    }

    function pagarDeuda(amigos, saldo) {
        mostrarPrompt("Ingrese el nombre del amigo al que desea pagarle la deuda:", function(amigoAPagar) {
            let amigoEncontrado = amigos.find(amigo => amigo.nombre.toLowerCase() === amigoAPagar.toLowerCase());

            if (amigoEncontrado) {
                mostrarPrompt(`Ingrese la cantidad que desea pagar a ${amigoAPagar}. Tu saldo actual es: ${saldo}`, function(cantidadAPagar) {
                    cantidadAPagar = parseFloat(cantidadAPagar);

                    if (isNaN(cantidadAPagar) || cantidadAPagar <= 0 || cantidadAPagar > saldo || cantidadAPagar > amigoEncontrado.deuda) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'La cantidad ingresada no es válida.'
                        });
                        return;
                    }

                    amigoEncontrado.deuda -= cantidadAPagar;
                    saldo -= cantidadAPagar;
                    mostrarMensaje(`Has pagado ${cantidadAPagar} a ${amigoAPagar}. La nueva deuda es de ${amigoEncontrado.deuda}. Tu nuevo saldo es: ${saldo}`);
                    actualizarSaldo(); // Actualizar la interfaz con el nuevo saldo
                    guardarAmigosEnLocalStorage(); // Guardar cambios en localStorage
                    mostrarAmigos(); // Actualizar la lista de amigos
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El amigo ingresado no corresponde a ningún contacto.'
                });
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
            cargarAmigosDesdeLocalStorage(); // Cargar amigos desde localStorage al iniciar sesión (?)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Contraseña incorrecta. Intenta nuevamente.'
            });
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingresa una cantidad válida para depositar.'
            });
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La deuda debe ser un número positivo.'
            });
            return;
        }

        amigos.push(new Amigo(nombre, deuda));

        document.getElementById("nombreAmigo").value = "";
        document.getElementById("deudaAmigo").value = "";

        ocultarElemento(formularioAgregarAmigos);
        mostrarElemento(agregarAmigosButton);
        guardarAmigosEnLocalStorage(); // Guardar cambios en localStorage
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
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'La deuda debe ser un número positivo.'
                                    });
                                    return;
                                }

                                amigoEncontrado.deuda = nuevaDeuda;
                                mostrarMensaje(`La deuda de ${amigoEditar} ha sido actualizada a ${nuevaDeuda}.`);
                                guardarAmigosEnLocalStorage(); // Guardar cambios en localStorage
                                mostrarAmigos(); // Actualizar la lista de amigos
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'El amigo ingresado no corresponde a ningún contacto.'
                            });
                        }
                    });
                    break;
                case "b":
                    mostrarPrompt("Ingrese el nombre del amigo que desea borrar:", function(amigoBorrar) {
                        let amigoAEliminar = amigos.findIndex(amigo => amigo.nombre.toLowerCase() === amigoBorrar.toLowerCase());

                        if (amigoAEliminar !== -1) {
                            amigos.splice(amigoAEliminar, 1);
                            mostrarMensaje(`El amigo ${amigoBorrar} ha sido eliminado.`);
                            guardarAmigosEnLocalStorage(); // Guardar cambios en localStorage
                            mostrarAmigos(); // Actualizar la lista de amigos
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'El amigo ingresado no corresponde a ningún contacto.'
                            });
                        }
                    });
                    break;
                default:
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Opción no válida.'
                    });
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

    // Cargar datos desde el archivo JSON local
    fetch('./amigos.json')
        .then(response => response.json())
        .then(data => {
            amigos = data.map(item => new Amigo(item.nombre, item.deuda));
            guardarAmigosEnLocalStorage(); // Guardar en localStorage la primera vez
            mostrarAmigos();
        })
        .catch(error => console.error('Error cargando datos:', error));
});

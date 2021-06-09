let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
})

function iniciarApp() {
    mostrarServicios();

    //Resalta el div actual acorde al tab
    mostrarSeccion();
    //Ocultar o mostrar seccion
    cambiarSeccion();

    //Paginacion
    paginaSiguiente();
    paginaAnterior();
    botonesPaginador();

    //Resumen de citas
    mostrarResumen();

    //Almacena datos en la cita
    nombreCita();
    fechaCita();
    deshabilitarFechaAnterior();
    horaCita();

}

async function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            //Eliminar seccion previa

            // const seccion = document.querySelector(`#paso-${pagina}`);
            // seccion.classList.add('mostrar-seccion');


            // const tab = document.querySelector(`[data-paso="${pagina}"]`);
            // tab.classList.add('actual');

            mostrarSeccion();
            botonesPaginador();
        });
    })
}

async function mostrarSeccion() {

    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');

    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs button.actual')
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }


    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {
            servicios
        } = db;

        servicios.forEach(servicio => {
            const {
                id,
                nombre,
                precio
            } = servicio;
            //DOM Scripting
            // Nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Div contenedor
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Inyectar precio y nombre al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            document.querySelector('#servicios').appendChild(servicioDiv);

            //Click al servicio
            servicioDiv.onclick = seleccionarServicio;
        })

    } catch (e) {
        console.log(e);
    }
}

function seleccionarServicio(e) {

    let elemento;

    if (e.target.tagName == 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        agregarServicio(servicioObj);
    }
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    if (pagina == 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina == 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen() {

    //destructuring
    const {
        nombre,
        fecha,
        hora,
        servicios
    } = cita;

    //Seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpiar HTML
    resumenDiv.innerHTML = '';

    //Validación
    if (Object.values(cita).includes('')) {
        const noServicio = document.createElement('P');
        noServicio.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServicio.classList.add('invalidar-cita');

        //agregar a resumenDiv
        resumenDiv.appendChild(noServicio);
    } else {
        //mostrar resumen

        let total = 0;

        const nombreCita = document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de los servicios';

        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen de la cita';

        serviciosCita.appendChild(headingServicios);

        //iterar sobre arreglo servicios
        servicios.forEach(servicio => {

            const {
                nombre,
                precio
            } = servicio;
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;
            precioServicio.classList.add('precio');

            const price = precio.split('$');
            total += parseInt(price[1].trim());

            //colocar en div

            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);
            serviciosCita.appendChild(contenedorServicio);
        });

        const tAPagar = document.createElement('P');
        tAPagar.innerHTML = `<span>Total a pagar </span>$${total}`;
        tAPagar.classList.add('total');

        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);
        resumenDiv.appendChild(serviciosCita);
        resumenDiv.appendChild(tAPagar);
    }

}

function eliminarServicio(id) {
    const {
        servicios
    } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
}

function agregarServicio(servicioObj) {
    const {
        servicios
    } = cita;
    cita.servicios = [...servicios, servicioObj];
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //validacion del nombre
        if (nombreTexto === '' || nombreTexto.length < 3) mostrarAlerta('invalid name', 'error');
        else {
            const alerta = document.querySelector('.alerta');
            if (alerta) alerta.remove();
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(msg, tipo) {

    //alerta previa
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) return;

    const alerta = document.createElement('DIV');
    alerta.textContent = msg;
    alerta.classList.add('alerta');
    if (tipo === 'error') alerta.classList.add('error');

    const form = document.querySelector('.formulario');
    form.appendChild(alerta);

    //Eliminar despues de 3 seg
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    let fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput = '';
            mostrarAlerta('Los domingos no se toman cita', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    //formato
    const formato = {
        year: fechaAhora.getFullYear(),
        month: fechaAhora.getMonth() + 1,
        day: fechaAhora.getDate() + 1
    }
    const fechaDeshabilitar = `${formato.year}-${formato.month}-${formato.day}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        console.log(hora);

        if (hora[0] < 10 || hora[0] > 19) {
            mostrarAlerta('Horario de Atencion: 8:00 a 19:30, Ultima cita: 19:00', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;
        }
    })
}
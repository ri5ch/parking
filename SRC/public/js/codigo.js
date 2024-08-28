function mostrarTabla1() {
    var tabla = document.getElementById('tablaPlanta1');
    if (tabla.style.display === 'none') {
        tabla.style.display = 'block';
    } else {
        tabla.style.display = 'none';
    }
}

function mostrarTabla2() {
    var tabla = document.getElementById('tablaPlanta2');
    if (tabla.style.display === 'none') {
        tabla.style.display = 'block';
    } else {
        tabla.style.display = 'none';
    }
}  

var botonsimiluar=document.getElementById('inicializar');
var botonDetener = document.getElementById('detener');


botonsimiluar.addEventListener('click',function(){
iniciarSimulacion();
});
botonDetener.addEventListener('click', function() {
detenerSimulacion(); });

var intervaloOcupar; // Variable global para el intervalo de ocupar plaza
var intervaloSacar; // Variable global para el intervalo de sacar coche

function iniciarSimulacion() {
    // Iniciar intervalo y guardar referencia en las variables globales
    intervaloOcupar = setInterval(ocuparPlaza, 20000);
    intervaloSacar = setInterval(sacarCoche, 25000);
    console.log('simulacion en proceso');
}

function detenerSimulacion() {
    clearInterval(intervaloOcupar); 
    clearInterval(intervaloSacar); 
    console.log('simulacion detenida con exito');
}



var plazasOcupadas = []; // Array para mantener registro de plazas ocupadas
function ocuparPlaza() {
        var totalPlazas = document.getElementsByTagName("td").length; // Total de celdas
        var plazaAleatoria;

        do {
            // Generar un número aleatorio entre 1 y el total de celdas
            plazaAleatoria = Math.floor(Math.random() * totalPlazas) + 1;
        } while (plazasOcupadas.includes(plazaAleatoria)); // Generar nuevo número si la plaza ya está ocupada

        // Registrar la plaza como ocupada
        plazasOcupadas.push(plazaAleatoria);

        // Seleccionar la celda correspondiente
        var selectedCell = document.getElementById("spot" + plazaAleatoria);

        // Cambiar el color de fondo de la celda seleccionada a rojo
        selectedCell.style.backgroundColor = "red";

    


      // En el frontend, asegúrate de que 'plazaAleatoria' sea el número de la plaza
fetch('/metercoche?plaza=' + plazaAleatoria)

        .then(response => {
            if (!response.ok) {
                throw new Error('Error al insertar plaza roja');
            }
            return response.text(); // Suponiendo que el backend envía una respuesta JSON
        })
        .then(data => {
            console.log(data); // Registra la respuesta del backend
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function sacarCoche() {
// Si no hay coches en el parking, salimos de la función
if (plazasOcupadas.length === 0) return;

// Seleccionar aleatoriamente una plaza ocupada
var indiceAleatorio = Math.floor(Math.random() * plazasOcupadas.length);
var plazaAleatoria = plazasOcupadas.splice(indiceAleatorio, 1)[0];

// Seleccionar la celda correspondiente
var selectedCell = document.getElementById("spot" + plazaAleatoria);

// Cambiar el color de fondo de la celda seleccionada a verde
selectedCell.style.backgroundColor = "green";

// Realizar la solicitud fetch al backend para liberar la plaza
fetch('/sacarcoche?plaza=' + plazaAleatoria)
.then(response => {
    if (!response.ok) {
        throw new Error('Error al liberar plaza');
    }
    return response.text(); 
})
.then(data => {
    console.log(data); 
})
.catch(error => {
    console.error('Error:', error);
});
}


function obtenerDetallesCompra() {
    fetch('/detallescompra')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener detalles de compra');
            }
            return response.json();
        })
        .then(data => {
            mostrarDetallesCompra(data);
            console.log(data); 
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function mostrarDetallesCompra(data) {
    let mensaje = 'Detalles de la compra:\n\n';
    mensaje += `Total de compras: ${data.total_compras}\n\n`;
    mensaje += 'Detalles:\n';
    data.detalles.forEach(compra => {
        mensaje += `ID: ${compra.id}\n`;
        mensaje += `Hora de entrada: ${compra.hora_entrada}\n`;
        mensaje += `Hora de salida: ${compra.hora_salida}\n`;
        mensaje += `ID del coche: ${compra.id_coche}\n`;
        mensaje += `Total: ${compra.total}\n`;
        mensaje += `ID de la plaza: ${compra.id_plaza}\n\n`;
    });
    alert(mensaje);
}



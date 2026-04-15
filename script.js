let citas = [];

const horariosBase = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
];

$(document).ready(function () {
    
    flatpickr("#fecha", {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    
    AOS.init();

    mostrarDisponibilidad();

    $("#servicio, #fecha").on("change", function () {
        mostrarDisponibilidad();
    });

    $("#formCita").on("submit", function (e) {
        e.preventDefault();

        let nombre = $("#nombre").val().trim();
        let fecha = $("#fecha").val();
        let hora = $("#hora").val();
        let servicio = $("#servicio").val();

        if (nombre === "" || fecha === "" || hora === "" || servicio === "") {
            Swal.fire("Error", "Complete todos los campos", "error");
            return;
        }

        let nuevaCita = {
            nombre: nombre,
            fecha: fecha,
            hora: hora,
            servicio: servicio
        };

        citas.push(nuevaCita);

        Swal.fire("Éxito", "Cita guardada correctamente", "success");

        $("#formCita")[0].reset();
        $("#hora").html('<option value="">Seleccione una hora</option>');

        mostrarDisponibilidad();
        mostrarCitas();
    });
});

function mostrarDisponibilidad() {
    let fecha = $("#fecha").val();
    let servicio = $("#servicio").val();

    let horasOcupadas = citas
        .filter(cita => cita.fecha === fecha && cita.servicio === servicio)
        .map(cita => cita.hora);

    let horasDisponibles = horariosBase.filter(hora => !horasOcupadas.includes(hora));

    $("#hora").html('<option value="">Seleccione una hora</option>');
    $("#disponibilidad").html("");

    horasDisponibles.forEach(hora => {
        $("#hora").append(`<option value="${hora}">${hora}</option>`);
        $("#disponibilidad").append(`<span>${hora}</span>`);
    });
}

function mostrarCitas() {
    $("#listaCitas").html("");

    if (citas.length === 0) {
        $("#listaCitas").html("<p>No hay citas registradas.</p>");
        return;
    }

    citas.forEach((cita, index) => {
        $("#listaCitas").append(`
            <div class="cita">
                <p><strong>Cliente:</strong> ${cita.nombre}</p>
                <p><strong>Fecha:</strong> ${cita.fecha}</p>
                <p><strong>Hora:</strong> ${cita.hora}</p>
                <p><strong>Servicio:</strong> ${cita.servicio}</p>
                <button onclick="eliminarCita(${index})">Eliminar</button>
            </div>
        `);
    });
}

function eliminarCita(index) {
    citas.splice(index, 1);
    mostrarCitas();
    mostrarDisponibilidad();

    Swal.fire("Eliminada", "La cita fue eliminada", "success");
}
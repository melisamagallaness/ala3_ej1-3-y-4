const { esFechaValida, obtenerFechaActual, obtenerHoraActual } = require("./fechas.js");

function Tarea(titulo, descripcion, dificultad, fechaVencimiento, fechaCreacion, horaCreacion, estado = "P") {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.estado = estado;
    this.dificultad = dificultad;
    this.fechaVencimiento = fechaVencimiento;
    this.fechaCreacion = fechaCreacion;
    this.horaCreacion = horaCreacion;
    this.ultimaEdicion = fechaCreacion + " a las " + horaCreacion + " hs";
}

async function agregarTareas(rl, listaTareas = []) {
    console.log("\nEstás creando una nueva tarea.");

    let titulo = await rl.question("1. Ingrese el título de la tarea: ");
    while (titulo.trim() === "") {
        console.log("El título no puede estar vacío.");
        titulo = await rl.question("1. Ingrese el título de la tarea: ");
    }

    let descripcion = await rl.question("2. Ingrese la descripción de la tarea: ");

    let estado = "P";

    let respDificultad = await rl.question("3. Dificultad ([1] Fácil / [2] Media / [3] Difícil) [Por defecto: 1]: ");
    let dificultad = 1;
    if (respDificultad.trim() !== "") {
        let num = parseInt(respDificultad, 10);
        while (isNaN(num) || num < 1 || num > 3) {
            console.log("Opción inválida, intente de nuevo.");
            respDificultad = await rl.question("Ingrese la dificultad (1, 2 o 3): ");
            num = parseInt(respDificultad, 10);
        }
        dificultad = num;
    }

    let fechaVencimiento = await rl.question("4. Fecha de vencimiento (dd/mm/aaaa) [Opcional]: ");
    if (fechaVencimiento.trim() !== "") {
        while (!esFechaValida(fechaVencimiento.trim())) {
            console.log("Fecha inválida o formato incorrecto. Debe ser dd/mm/aaaa.");
            fechaVencimiento = await rl.question("Ingrese la fecha de vencimiento (dd/mm/aaaa): ");
        }
        fechaVencimiento = fechaVencimiento.trim();
    } else {
        fechaVencimiento = "";
    }

    const fechaCreacion = obtenerFechaActual();
    const horaCreacion = obtenerHoraActual();

    const nuevaTarea = new Tarea(
        titulo.trim(),
        descripcion.trim(),
        dificultad,
        fechaVencimiento,
        fechaCreacion,
        horaCreacion,
        estado
    );

    listaTareas.push(nuevaTarea);

    console.log("\n¡Datos guardados con éxito!");
    await rl.question("Presione cualquier tecla para continuar...");
}

module.exports = agregarTareas;
const { esFechaValida, obtenerFechaActual, obtenerHoraActual } = require("./fechas.js");
const Tarea = require("./Tarea.js");

Tarea.prototype.mostrarDetalle = function () {
    const nombresEstado = {
        P: "Pendiente",
        E: "En curso",
        T: "Terminada",
        C: "Cancelada"
    };

    const nombresDificultad = {
        1: "★☆☆ (Fácil)",
        2: "★★☆ (Media)",
        3: "★★★ (Difícil)"
    };

    let estadoTexto = nombresEstado[this.estado] || "Desconocido";
    let dificultadTexto = nombresDificultad[this.dificultad] || "Desconocida";
    let descTexto = this.descripcion ? this.descripcion : "(Sin descripción)";
    let vencTexto = this.fechaVencimiento ? this.fechaVencimiento : "(Sin fecha de vencimiento)";

    console.log("\nEsta es la tarea que elegiste.");
    console.log("Título:          " + this.titulo);
    console.log("Descripción:     " + descTexto);
    console.log("Estado:          " + estadoTexto);
    console.log("Dificultad:      " + dificultadTexto);
    console.log("Vencimiento:     " + vencTexto);
    console.log("Creada:          " + this.fechaCreacion + " a las " + this.horaCreacion + " hs");
    console.log("Última edición:  " + this.ultimaEdicion + "\n");
};

Tarea.prototype.actualizarEdicion = function () {
    this.ultimaEdicion = obtenerFechaActual() + " a las " + obtenerHoraActual() + " hs";
};

async function gestionarDetalleYEdicion(rl, tarea) {
    tarea.mostrarDetalle();

    console.log("Si deseas editarle presiona E, o 0 para volver: ");
    let editar = await rl.question("Ingrese opción:");
    while (editar !== "E" && editar !== "0") {
        console.log("Opcion invalida, intente de nuevo: ");
        editar = await rl.question("Ingrese opción:");
    }

    if (editar === "E") {
        console.log("\nEstas editando la tarea " + tarea.titulo + "\n");
        console.log("-Si deseas mantener los valores de un atributo , simplemente dejalo en blanco.\n-Si deseas dejar en blanco un atributo, escribe un espacio.\n");

        let titulo = await rl.question("1. Título actual [" + tarea.titulo + "]: ");
        if (titulo === " ") {
            console.log("El título no puede quedar vacío. Se mantiene el actual.");
        } else if (titulo.trim() !== "") {
            tarea.titulo = titulo.trim();
        }

        console.log("2. Ingresa la descripcion: ");
        let descripcion = await rl.question("Ingrese la descripcion de la tarea: ");
        if (descripcion === " ") {
            tarea.descripcion = "";
        } else if (descripcion !== "") {
            tarea.descripcion = descripcion.trim();
        }

        console.log("3. Estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada): ");
        let estado = await rl.question("Ingrese el estado de la tarea: ");
        while (estado !== "" && estado !== "P" && estado !== "E" && estado !== "T" && estado !== "C") {
            console.log("Opcion invalida, intente de nuevo: ");
            estado = await rl.question("Ingrese el estado de la tarea: ");
        }
        if (estado !== "") {
            tarea.estado = estado;
        }

        console.log("4. Dificultad ([1] / [2] / [3]): ");
        let dificultadStr = await rl.question("Ingrese la dificultad de la tarea: ");
        let dificultad = parseInt(dificultadStr, 10);
        while (dificultadStr !== "" && (isNaN(dificultad) || dificultad < 1 || dificultad > 3)) {
            console.log("Opcion invalida, intente de nuevo: ");
            dificultadStr = await rl.question("Ingrese la dificultad de la tarea: ");
            dificultad = parseInt(dificultadStr, 10);
        }
        if (dificultadStr !== "") {
            tarea.dificultad = dificultad;
        }

        console.log("5. Fecha de vencimiento (dd/mm/aaaa): ");
        let fechaVencimiento = await rl.question("Ingrese la fecha de vencimiento de la tarea: ");
        if (fechaVencimiento === " ") {
            tarea.fechaVencimiento = "";
        } else if (fechaVencimiento !== "") {
            while (!esFechaValida(fechaVencimiento.trim())) {
                console.log("Opcion invalida, intente de nuevo: ");
                fechaVencimiento = await rl.question("Ingrese la fecha de vencimiento de la tarea: ");
            }
            tarea.fechaVencimiento = fechaVencimiento.trim();
        }

        tarea.actualizarEdicion();

        console.log("¡Datos guardados!\nPresione cualquier tecla para continuar...\n");
        await rl.question("");
    }
}

async function mostrarTareas(rl, tareas = []) {
    console.log("¿Que tareas deseas ver?\n[1]Todas\n[2]Pendientes\n[3]En curso\n[4]Terminadas\n[0]Volver\n");
    let opcion2 = parseInt(await rl.question("Ingrese opción:"), 10);

    while (isNaN(opcion2) || opcion2 < 0 || opcion2 > 4) {
        console.log("Opcion invalida, intente de nuevo: ");
        opcion2 = parseInt(await rl.question("Ingrese opción:"), 10);
    }

    if (opcion2 === 0) {
        console.log("Volviendo al menu principal...");
        return;
    }

    let filtradas = [];
    if (opcion2 === 1) {
        console.log("Estas son todas las tareas.");
        filtradas = [...tareas];
    } else if (opcion2 === 2) {
        console.log("Estas son las tareas pendientes.");
        filtradas = tareas.filter(function (t) { return t.estado === "P"; });
    } else if (opcion2 === 3) {
        console.log("Estas son las tareas en curso.");
        filtradas = tareas.filter(function (t) { return t.estado === "E"; });
    } else if (opcion2 === 4) {
        console.log("Estas son las tareas terminadas.");
        filtradas = tareas.filter(function (t) { return t.estado === "T"; });
    }

    if (filtradas.length === 0) {
        console.log("No hay tareas para mostrar.");
        return;
    }

    filtradas.sort(function (a, b) {
        return a.titulo.localeCompare(b.titulo);
    });

    filtradas.forEach(function (t, i) {
        console.log("[" + (i + 1) + "] " + t.titulo);
    });

    console.log("Desea ver los detalles de alguna? Introduce el numero para verla o 0 para volver: ");
    let ver = parseInt(await rl.question("Ingrese opción:"), 10);

    while (isNaN(ver) || ver < 0 || ver > filtradas.length) {
        console.log("Opcion invalida, intente de nuevo: ");
        ver = parseInt(await rl.question("Ingrese opción:"), 10);
    }

    if (ver !== 0) {
        let seleccionada = filtradas[ver - 1];
        await gestionarDetalleYEdicion(rl, seleccionada);
    }
}

module.exports = mostrarTareas;
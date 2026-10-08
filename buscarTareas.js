const { esFechaValida, obtenerFechaActual, obtenerHoraActual } = require("./fechas.js");
const Tarea = require("./Tarea.js");

Tarea.prototype.coincideConTitulo = function (criterio) {
    if (!criterio) return false;
    return this.titulo.toLowerCase().includes(criterio.trim().toLowerCase());
};

Tarea.prototype.mostrarDetalles = function () {
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

    const estadoTexto = nombresEstado[this.estado] || "Desconocido";
    const dificultadTexto = nombresDificultad[this.dificultad] || "Desconocida";
    const vencimientoTexto = this.fechaVencimiento || "(Sin fecha de vencimiento)";
    const descripcionTexto = this.descripcion || "(Sin descripción)";

    console.log("\nDETALLES DE LA TAREA");
    console.log("Título:          " + this.titulo);
    console.log("Descripción:     " + descripcionTexto);
    console.log("Estado:          " + estadoTexto);
    console.log("Dificultad:      " + dificultadTexto);
    console.log("Vencimiento:     " + vencimientoTexto);
    console.log("Creada:          " + this.fechaCreacion + " a las " + this.horaCreacion + " hs");
    console.log("Última edición:  " + this.ultimaEdicion);
};

Tarea.prototype.actualizarUltimaEdicion = function () {
    this.ultimaEdicion = obtenerFechaActual() + " a las " + obtenerHoraActual() + " hs";
};

async function buscarTareas(rl, tareas = []) {
    let titulo = await rl.question("Ingrese el título de la tarea para buscarla: ");

    let coincidencias = tareas.filter(function (t) {
        return t.coincideConTitulo(titulo);
    });

    if (coincidencias.length === 0) {
        console.log("\nNo hubo coincidencias.");
        await rl.question("\nPresione Enter para volver al menú...");
        return;
    }

    console.log("\nEstas son las tareas relacionadas:\n");
    coincidencias.forEach(function (t, i) {
        console.log("[" + (i + 1) + "] " + t.titulo);
    });

    console.log("\n¿Desea ver detalles de alguna?\nIntroduce el número para verla o 0 para volver.");
    let respOp = await rl.question("Ingrese opción: ");
    let op = parseInt(respOp, 10);

    while (isNaN(op) || op < 0 || op > coincidencias.length) {
        console.log("Opción inválida, intente de nuevo.");
        respOp = await rl.question("Ingrese opción: ");
        op = parseInt(respOp, 10);
    }

    if (op === 0) return;

    let seleccionada = coincidencias[op - 1];

    seleccionada.mostrarDetalles();

    let editar = (await rl.question("\nSi deseas editarla presiona [E], o [0] para volver: ")).toUpperCase();
    while (editar !== "E" && editar !== "0") {
        console.log("Opción inválida, intente de nuevo.");
        editar = (await rl.question("Ingrese opción (E/0): ")).toUpperCase();
    }

    if (editar === "E") {
        console.log("\nEstás editando: " + seleccionada.titulo);
        console.log("-Si deseas mantener los valores de un atributo , simplemente dejalo en blanco (enter).\n-Si deseas dejar en blanco un atributo, escribe un espacio.\n");

        let nuevoTitulo = await rl.question("1. Título actual [" + seleccionada.titulo + "]: ");
        if (nuevoTitulo === " ") {
            console.log("El título no puede quedar vacío. Se mantiene el anterior.");
        } else if (nuevoTitulo.trim() !== "") {
            seleccionada.titulo = nuevoTitulo.trim();
        }

        let nuevaDesc = await rl.question("2. Descripción actual [" + (seleccionada.descripcion || "Sin descripción") + "]: ");
        if (nuevaDesc === " ") {
            seleccionada.descripcion = "";
        } else if (nuevaDesc !== "") {
            seleccionada.descripcion = nuevaDesc.trim();
        }

        let nuevoEstado = (await rl.question("3. Estado actual [" + seleccionada.estado + "] ([P] / [E] / [T] / [C]): ")).toUpperCase();
        while (nuevoEstado !== "" && !["P", "E", "T", "C"].includes(nuevoEstado)) {
            console.log("Opción inválida. Ingrese P, E, T, C o presione Enter para no modificar:");
            nuevoEstado = (await rl.question("Estado: ")).toUpperCase();
        }
        if (nuevoEstado !== "") {
            seleccionada.estado = nuevoEstado;
        }

        let nuevaDif = await rl.question("4. Dificultad actual [" + seleccionada.dificultad + "] ([1] / [2] / [3]): ");
        while (nuevaDif !== "" && !["1", "2", "3"].includes(nuevaDif.trim())) {
            console.log("Opción inválida. Ingrese 1, 2, 3 o presione Enter para no modificar:");
            nuevaDif = await rl.question("Dificultad: ");
        }
        if (nuevaDif !== "") {
            seleccionada.dificultad = parseInt(nuevaDif, 10);
        }

        let nuevoVenc = await rl.question("5. Fecha de vencimiento actual [" + (seleccionada.fechaVencimiento || "Sin fecha") + "] (dd/mm/aaaa): ");
        if (nuevoVenc === " ") {
            seleccionada.fechaVencimiento = "";
        } else if (nuevoVenc !== "") {
            while (!esFechaValida(nuevoVenc.trim())) {
                console.log("Fecha inválida. Debe ser dd/mm/aaaa o presione Enter para no modificar:");
                nuevoVenc = await rl.question("Fecha de vencimiento: ");
            }
            seleccionada.fechaVencimiento = nuevoVenc.trim();
        }

        seleccionada.actualizarUltimaEdicion();

        console.log("\n¡Tarea actualizada con éxito!");
    }

    await rl.question("\nPresione Enter para volver al menú...");
}

module.exports = buscarTareas;
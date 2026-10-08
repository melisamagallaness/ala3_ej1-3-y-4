const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

const mostrarTareas = require("./mostrarTareas.js");
const buscarTareas = require("./buscarTareas.js");
const agregarTareas = require("./agregarTareas.js");

function ListaDeTareas() {
    this.elementos = [];
}

ListaDeTareas.prototype.obtenerTodas = function () {
    return this.elementos;
};

ListaDeTareas.prototype.estaVacia = function () {
    return this.elementos.length === 0;
};

async function main() {
    const rl = readline.createInterface({ input, output });

    const lista = new ListaDeTareas();
    const tareas = lista.obtenerTodas();
    let opcion;

    do {
        console.log("\n¡Hola Olivia!\n¿Que deseas hacer?\n[1] Ver mis tareas.\n[2] Buscar una tarea.\n[3] Agregar una tarea.\n[0] Salir.\n");
        let respuesta = await rl.question("Ingrese opción: ");
        opcion = parseInt(respuesta, 10);

        while (Number.isNaN(opcion) || opcion < 0 || opcion > 3) {
            console.log("Opción inválida, intente de nuevo.");
            respuesta = await rl.question("Ingrese opción: ");
            opcion = parseInt(respuesta, 10);
        }

        switch (opcion) {
            case 1:
                await mostrarTareas(rl, tareas);
                break;
            case 2:
                await buscarTareas(rl, tareas);
                break;
            case 3:
                await agregarTareas(rl, tareas);
                break;
            case 0:
                console.log("\n¡Hasta luego Olivia!\n");
                break;
        }
    } while (opcion !== 0);

    rl.close();
}

main();
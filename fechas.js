function esFechaValida(cadenaFecha) {
    if (!cadenaFecha) return false;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = cadenaFecha.match(regex);
    if (!match) return false;

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10) - 1;
    const anio = parseInt(match[3], 10);

    const fecha = new Date(anio, mes, dia);

    return (
        fecha.getFullYear() === anio &&
        fecha.getMonth() === mes &&
        fecha.getDate() === dia
    );
}

function obtenerFechaActual() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, "0");
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const anio = ahora.getFullYear();
    return dia + "/" + mes + "/" + anio;
}

function obtenerHoraActual() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    return horas + ":" + minutos;
}

module.exports = {
    esFechaValida,
    obtenerFechaActual,
    obtenerHoraActual
};
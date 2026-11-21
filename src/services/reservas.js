const Reserva = require("../modelos/reserva");

async function listar(filtro = {}) {
  return Reserva.find(filtro);
}
async function buscarPorId(id) {
  return Reserva.findById(id);
}
async function crear(datos) {
  const reserva = new Reserva(datos);
  return reserva.save();
}
async function contar() {
  return Reserva.countDocuments();
}
async function actualizarCompleto(id, datos) {
  return Reserva.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
    upsert: false,
  });
}
async function actualizarParcial(id, cambios) {
  return Reserva.findByIdAndUpdate(
    id,
    {
      $set: cambios,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  );
}

async function eliminar(id) {
  return Reserva.findByIdAndDelete(id);
}

module.exports = {
  listar,
  buscarPorId,
  crear,
  contar,
  actualizarCompleto,
  actualizarParcial,
  eliminar,
};

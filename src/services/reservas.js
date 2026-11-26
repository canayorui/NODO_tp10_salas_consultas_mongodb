const Reserva = require("../modelos/reserva");

async function listar(
  filtro = {},
  orden = "estudiante",
  pagina = 1,
  limite = 0,
) {
  let criterioOrden;
  switch (orden) {
    case "personas-asc":
      criterioOrden = {
        personas: 1,
        _id: 1,
      };
      break;

    case "personas-desc":
      criterioOrden = {
        personas: -1,
        _id: 1,
      };
      break;
    default:
      criterioOrden = {
        estudiante: 1,
        _id: 1,
      };
  }

  const salto = (pagina - 1) * limite;
  const total = await Reserva.countDocuments(filtro);
  const datos = await Reserva.find(filtro)
    .select("estudiante email sala fecha turno personas estado")
    .sort(criterioOrden)
    .skip(salto)
    .limit(limite);
  return {
    datos,
    total,
    pagina,
    limite,
  };
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
async function actualizarCompleta(id, datos) {
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
  actualizarCompleta,
  actualizarParcial,
  eliminar,
};

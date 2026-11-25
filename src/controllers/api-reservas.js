const camposDeReserva = [
  "estudiante",
  "email",
  "sala",
  "fecha",
  "turno",
  "personas",
];
const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
const estadosPermitidos = ["pendiente", "confirmada"];

function esTextoNoVacio(valor) {
  return typeof valor === "string" && Boolean(valor.trim());
}

function datosCompletosValidos(datos) {
  return (
    esTextoNoVacio(datos.estudiante) &&
    esTextoNoVacio(datos.email) &&
    datos.email.includes("@") &&
    salasPermitidas.includes(datos.sala) &&
    esTextoNoVacio(datos.fecha) &&
    turnosPermitidos.includes(datos.turno) &&
    typeof datos.personas === "number" &&
    Number.isInteger(datos.personas) &&
    datos.personas >= 1 &&
    datos.personas <= 6 &&
    estadosPermitidos.includes(datos.estado)
  );
}

function datosParcialesValidos(cambios) {
  if ("personas" in cambios) {
    if (
      typeof cambios.personas !== "number" ||
      !Number.isInteger(cambios.personas) ||
      cambios.personas < 1 ||
      cambios.personas > 6
    ) {
      return false;
    }
  }
  if ("estado" in cambios && !estadosPermitidos.includes(cambios.estado)) {
    return false;
  }
  return true;
}

function validarContentTypeJson(req, res) {
  if (!req.is("application/json")) {
    res.status(400).json({ error: "Se requiere Content-Type JSON" });
    return false;
  }
  return true;
}

function representarReserva(reserva) {
  return {
    id: reserva._id.toString(),
    estudiante: reserva.estudiante,
    email: reserva.email,
    sala: reserva.sala,
    fecha: reserva.fecha,
    turno: reserva.turno,
    personas: reserva.personas,
    estado: reserva.estado,
  };
}

function crearControladorApiReservas(servicio) {
  return {
    async listar(req, res) {
      const { sala, orden, pagina = 1, limite = 2 } = req.query;

      if (sala !== undefined && typeof sala !== "string") {
        return res.status(400).json({
          error: "El parámetro sala debe aparecer una sola vez como texto",
        });
      }

      const paginaNumero = Number(pagina);
      const limiteNumero = Number(limite);

      if (
        !Number.isInteger(paginaNumero) ||
        paginaNumero < 1 ||
        paginaNumero > 1000
      ) {
        return res
          .status(400)
          .json({ error: "la pagina debe ser un entero entre el 1 al 100" });
      }

      if (
        !Number.isInteger(limiteNumero) ||
        limiteNumero < 1 ||
        limiteNumero > 20
      ) {
        return res.status(400).json({
          error: "el limite debe ser un entero entre el 1 al 20",
        });
      }

      const filtro = sala === undefined ? {} : { sala };
      const resultado = await servicio.listar(
        filtro,
        orden,
        paginaNumero,
        limiteNumero,
      );

      return res.json({
        datos: resultado.datos.map(representarReserva),
        pagina: paginaNumero,
        limite: limiteNumero,
        total: resultado.total,
        paginas: Math.ceil(resultado.total / limiteNumero),
      });
    },

    async detalle(req, res) {
      const { id } = req.params;

      if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const reserva = await servicio.buscarPorId(id);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva inexistente" });
      }

      return res.json(representarReserva(reserva));
    },

    async crear(req, res) {
      if (!req.is("application/json")) {
        return res.status(400).json({ error: "Se requiere Content-Type JSON" });
      }

      const body = req.body;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({ error: "Se requiere un objeto JSON" });
      }

      const datos = {};
      for (const campo of camposDeReserva) {
        const valor = body[campo];
        if (campo === "personas") {
          if (typeof valor !== "number" || !Number.isFinite(valor)) {
            return res.status(400).json({ error: "Datos inválidos" });
          }
          datos[campo] = valor;
        } else {
          if (typeof valor !== "string" || !valor.trim()) {
            return res.status(400).json({ error: "Datos inválidos" });
          }
          datos[campo] = valor.trim();
        }
      }

      if (!datos.email.includes("@")) {
        return res.status(400).json({ error: "Datos inválidos" });
      }
      if (!salasPermitidas.includes(datos.sala)) {
        return res.status(400).json({ error: "Datos inválidos" });
      }
      if (!turnosPermitidos.includes(datos.turno)) {
        return res.status(400).json({ error: "Datos inválidos" });
      }
      if (
        !Number.isInteger(datos.personas) ||
        datos.personas < 1 ||
        datos.personas > 6
      ) {
        return res.status(400).json({ error: "Datos inválidos" });
      }

      const reserva = await servicio.crear(datos);
      const recurso = representarReserva(reserva);
      return res
        .status(201)
        .location(`/api/reservas/${recurso.id}`)
        .json(recurso);
    },
    async actualizarCompleta(req, res) {
      const { id } = req.params;

      if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      if (!validarContentTypeJson(req, res)) return;

      const body = req.body;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({
          error: "datos invalidos",
        });
      }
      const camposObligatorios = [
        "estudiante",
        "email",
        "sala",
        "fecha",
        "turno",
        "personas",
        "estado",
      ];
      for (const campo of camposObligatorios) {
        if (!(campo in body)) {
          return res.status(400).json({
            error: "PUT requiere todos los campos",
          });
        }
      }
      const datos = {};
      for (const campo of camposObligatorios) {
        datos[campo] =
          typeof body[campo] === "string" ? body[campo].trim() : body[campo];
      }
      if (!datosCompletosValidos(datos)) {
        return res.status(400).json({ error: "datos invalidos" });
      }
      const reservas = await servicio.actualizarCompleta(id, datos);
      if (!reservas) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      return res.json(representarReserva(reservas));
    },

    async actualizarParcial(req, res) {
      const { id } = req.params;

      if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      if (!validarContentTypeJson(req, res)) return;

      const body = req.body;
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({ error: "datos invalidos" });
      }
      const camposPermitidos = ["personas", "estado"];
      const campos = Object.keys(body);
      if (campos.some((campo) => !camposPermitidos.includes(campo))) {
        return res
          .status(400)
          .json({ error: "PATCH solo admite personas y estado" });
      }
      if (campos.length === 0 || !datosParcialesValidos(body)) {
        return res.status(400).json({ error: "datos invalidos" });
      }
      const reserva = await servicio.actualizarParcial(id, body);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      return res.json(representarReserva(reserva));
    },
    async eliminar(req, res) {
      const { id } = req.params;
      if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const reserva = await servicio.eliminar(id);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      return res.status(204).end();
    },
  };
}
module.exports = crearControladorApiReservas;

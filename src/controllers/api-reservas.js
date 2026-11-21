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
      const { sala } = req.query;

      if (sala !== undefined && typeof sala !== "string") {
        return res.status(400).json({
          error: "El parámetro sala debe aparecer una sola vez como texto",
        });
      }

      const filtro = sala === undefined ? {} : { sala };
      const reservas = await servicio.listar(filtro);
      return res.json(reservas.map(representarReserva));
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
    async actualizarCompleto(req, res) {
      const { id } = req.params;

      if (!/^[a-f\d]{24}$/i.test(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

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
      const reservas = await servicio.actualizarCompleto(id, body);
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

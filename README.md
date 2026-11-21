# TP09 - CRUD de reservas de salas con MongoDB

## Alumna

Sheyla Canayo

## Repositorio

tp-09-salas-crud-mongodb

## Punto de partida

Este trabajo fue desarrollado a partir de una copia funcional del TP08 - Endpoints persistentes de reservas de salas.

## Tecnologías utilizadas

- Node.js
- Express 5
- MongoDB Atlas Free (M0)
- Mongoose
- Postman
- ESLint
- Prettier

## Base de datos

- Base de datos: `reservas_salas_u9`
- Colección: `reservas`

## Instalación del proyecto

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` a partir de `.env.example`.

Ejemplo:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u9?retryWrites=true&w=majority
```

**Importante:** el archivo `.env` no debe publicarse en GitHub.

## Ejecución

Iniciar el servidor:

```bash
npm start
```

El servidor quedará disponible en:

```text
http://localhost:3000
```

## Estructura principal del proyecto

```text
src
│
├── config
│   ├── base-datos.js
│   └── entorno.js
│
├── controllers
│   ├── api-reservas.js
│   └── reservas.js
│
├── modelos
│   └── reserva.js
│
├── router
│   ├── api-reservas.js
│   └── reservas.js
│
├── services
│   └── reservas.js
│
├── middleware
│
├── views
│
└── public
```

## Modelo Reserva

El modelo utiliza Mongoose y contiene los siguientes campos:

| Campo | Tipo | Regla |
|---------|---------|---------|
| estudiante | String | Obligatorio |
| email | String | Obligatorio |
| sala | String | Enum |
| fecha | String | Obligatorio |
| turno | String | Enum |
| personas | Number | Entero entre 1 y 6 |
| estado | String | pendiente / confirmada |

## Endpoints de la API

| Método | Ruta |
|----------|----------|
| GET | /api/reservas |
| GET | /api/reservas/:id |
| POST | /api/reservas |
| PUT | /api/reservas/:id |
| PATCH | /api/reservas/:id |
| DELETE | /api/reservas/:id |

## Ejemplo de creación (POST)

### URL

```text
http://localhost:3000/api/reservas
```

### Body

```json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2
}
```

### Resultado esperado

```http
201 Created
```

La respuesta incluye:

- id
- estudiante
- email
- sala
- fecha
- turno
- personas
- estado (pendiente)

## Ejemplo de actualización completa (PUT)

### URL

```text
http://localhost:3000/api/reservas/ID
```

### Body

```json
{
  "estudiante": "Ana Actualizada",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-25",
  "turno": "Tarde",
  "personas": 3,
  "estado": "confirmada"
}
```

### Resultado esperado

```http
200 OK
```

## Ejemplo de actualización parcial (PATCH)

### URL

```text
http://localhost:3000/api/reservas/ID
```

### Body

```json
{
  "estado": "confirmada"
}
```

### Resultado esperado

```http
200 OK
```

## Ejemplo de eliminación (DELETE)

### URL

```text
http://localhost:3000/api/reservas/ID
```

### Resultado esperado

```http
204 No Content
```

## Persistencia

Las reservas se almacenan en MongoDB Atlas y permanecen disponibles después de reiniciar el servidor.

Para comprobar la persistencia:

1. Crear una reserva mediante POST.
2. Guardar el ID devuelto.
3. Reiniciar el servidor.
4. Consultar nuevamente la reserva mediante GET.
5. Verificar que el mismo ID sigue existiendo.

## Pruebas realizadas

### Casos exitosos

- GET listado de reservas.
- GET reserva por ID.
- POST reserva válida.
- PUT actualización completa.
- PATCH actualización parcial.
- DELETE eliminación de reserva.

### Casos inválidos

- ID inválido.
- ID inexistente.
- Email sin @.
- Sala no permitida.
- Turno no permitido.
- Personas igual a 0.
- Personas mayor a 6.
- Personas decimal.
- JSON inválido.
- Content-Type incorrecto.

## Evidencias

Agregar las capturas de:

1. POST con respuesta 201.
2. GET por ID con respuesta 200.
3. PUT con respuesta 200.
4. PATCH con respuesta 200.
5. DELETE con respuesta 204.
6. GET posterior con respuesta 404.
7. Documento almacenado en MongoDB Atlas.
8. Persistencia luego de reiniciar el servidor.

## Diferencias respecto al TP08

En el TP08 se implementaron:

- GET listado
- GET por ID
- POST

En el TP09 se agregaron:

- PUT para actualización completa
- PATCH para actualización parcial
- DELETE para eliminación

Con estas operaciones se completa el CRUD del recurso Reserva.

## Calidad del código

Verificación de formato:

```bash
npm run format
```

Verificación de calidad:

```bash
npm run check
```

## Seguridad

No se publican:

- Credenciales
- URI privadas
- Archivos .env
- node_modules
- Datos personales reales
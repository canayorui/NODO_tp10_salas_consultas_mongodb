# TP10 - Consultas avanzadas de reservas de salas con MongoDB

## Alumna

Sheyla Canayo

## Repositorio

tp-10-salas-consultas-mongodb

## Punto de partida

Este trabajo práctico fue desarrollado a partir de una copia funcional del TP09 - CRUD de reservas de salas con MongoDB.

La aplicación mantiene la arquitectura implementada en trabajos anteriores y amplía las capacidades de consulta de la API mediante filtros, ordenación, paginación y selección de campos.

## Tecnologías utilizadas

- Node.js
- Express 5
- MongoDB Atlas Free (M0)
- Mongoose
- Postman
- ESLint
- Prettier

## Base de datos

- Base de datos: `reservas_salas_u10`
- Colección: `reservas`

## Configuración de MongoDB Atlas

Se utilizó un clúster MongoDB Atlas Free (M0).

Para reproducir el entorno:

1. Crear o reutilizar un clúster Atlas.
2. Crear un usuario con permisos de lectura y escritura.
3. Autorizar la dirección IP utilizada.
4. Obtener la URI de conexión para Node.js.
5. Configurar el archivo `.env`.

## Variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u10?retryWrites=true&w=majority
```

El archivo `.env` no se publica en GitHub.

## Instalación

Instalar dependencias:

```bash
npm install
```

## Ejecución

Iniciar el servidor:

```bash
npm start
```

El sitio quedará disponible en:

```text
http://localhost:3000
```

La API estará disponible en:

```text
http://localhost:3000/api/reservas
```

## Estructura del proyecto

```text
src/
│
├── config/
│   ├── base-datos.js
│   └── entorno.js
│
├── controllers/
│   ├── api-reservas.js
│   └── reservas.js
│
├── middleware/
│
├── modelos/
│   └── reserva.js
│
├── router/
│   ├── api-reservas.js
│   └── reservas.js
│
├── services/
│   └── reservas.js
│
├── views/
│
└── public/
```

## Modelo Reserva

La colección utiliza el siguiente esquema:

| Campo | Tipo | Regla |
|---------|---------|---------|
| estudiante | String | Obligatorio |
| email | String | Obligatorio y contiene @ |
| sala | String | Enum |
| fecha | String | Obligatorio |
| turno | String | Enum |
| personas | Number | Entero entre 1 y 6 |
| estado | String | pendiente / confirmada |

## Endpoints disponibles

### Listado

```http
GET /api/reservas
```

### Consulta por ID

```http
GET /api/reservas/:id
```

### Creación

```http
POST /api/reservas
```

### Actualización completa

```http
PUT /api/reservas/:id
```

### Actualización parcial

```http
PATCH /api/reservas/:id
```

### Eliminación

```http
DELETE /api/reservas/:id
```

## Funcionalidades incorporadas en TP10

### 1. Filtro por sala

Permite consultar únicamente las reservas de una sala determinada.

Ejemplo:

```http
GET /api/reservas?sala=Sala Norte
```

Resultado esperado:

- Devuelve únicamente reservas de Sala Norte.

Si no existen coincidencias:

```json
[]
```

con estado HTTP:

```http
200 OK
```

---

### 2. Ordenación

La API permite ordenar resultados utilizando el parámetro:

```text
orden
```

Opciones disponibles:

```text
estudiante
personas-asc
personas-desc
```

Ejemplos:

```http
GET /api/reservas?orden=estudiante
```

```http
GET /api/reservas?orden=personas-asc
```

```http
GET /api/reservas?orden=personas-desc
```

---

### 3. Paginación

Parámetros disponibles:

```text
pagina
limite
```

Valores por defecto:

```text
pagina = 1
limite = 2
```

Ejemplo:

```http
GET /api/reservas?pagina=2&limite=2
```

Respuesta:

```json
{
  "datos": [],
  "pagina": 2,
  "limite": 2,
  "total": 6,
  "paginas": 3
}
```

Validaciones:

- pagina entre 1 y 1000.
- limite entre 1 y 20.

---

### 4. Selección de campos

Las consultas recuperan únicamente los campos necesarios del recurso:

```text
estudiante
email
sala
fecha
turno
personas
estado
```

manteniendo el identificador requerido para la representación de la respuesta.

## Datos utilizados para las pruebas

Se registraron seis reservas de prueba:

1. Ana Ejemplo
2. Bruno Ejemplo
3. Carla Ejemplo
4. Diego Ejemplo
5. Elena Ejemplo
6. Fabian Ejemplo

Distribuidas entre:

- Sala Norte
- Sala Sur
- Sala Multimedia

## Matriz de pruebas

### Filtro

| Caso | Resultado esperado |
|--------|--------|
| Sala Norte | 4 reservas |
| Sala Sur | 1 reserva |
| Sala Multimedia | 1 reserva |
| Sala inexistente | [] |

### Orden

| Caso | Resultado esperado |
|--------|--------|
| estudiante | Orden alfabético |
| personas-asc | Menor a mayor |
| personas-desc | Mayor a menor |

### Paginación

| Caso | Resultado esperado |
|--------|--------|
| pagina=1 limite=2 | primeras 2 reservas |
| pagina=2 limite=2 | siguientes 2 reservas |
| pagina=3 limite=2 | últimas 2 reservas |
| pagina=4 limite=2 | [] |

### Casos inválidos

| Caso | Resultado esperado |
|--------|--------|
| pagina=0 | 400 |
| pagina=1.5 | 400 |
| limite=21 | 400 |

## Persistencia

Los datos permanecen almacenados en MongoDB Atlas después de reiniciar el servidor.

Para comprobarlo:

1. Crear reservas.
2. Reiniciar el servidor.
3. Consultar nuevamente los mismos registros.
4. Verificar que continúan existiendo.
5. Confirmar la existencia de los documentos en MongoDB Atlas.

## Comparación con el TP09

### TP09

Implementó:

- GET
- POST
- PUT
- PATCH
- DELETE

Completando el CRUD.

### TP10

Incorpora:

- Filtro por sala.
- Ordenación.
- Paginación.
- Selección de campos.

sin alterar el CRUD existente.

## Pregunta conceptual

### Si incorporáramos información de salas, ¿qué datos describen una sala y cuáles una reserva?

Datos de una sala:

- nombre
- ubicación
- capacidad
- equipamiento disponible

Datos de una reserva:

- estudiante
- email
- fecha
- turno
- cantidad de personas
- estado

### ¿Conviene usar referencias o documentos embebidos?

En este caso conviene utilizar referencias.

Una misma sala puede tener muchas reservas diferentes a lo largo del tiempo. Utilizar referencias evita duplicar información de la sala en cada documento de reserva y simplifica la actualización de los datos propios de la sala.

## Calidad del código

Formatear el proyecto:

```bash
npm run format
```

Comprobar calidad:

```bash
npm run check
```

## Seguridad

No se publican:

- credenciales
- contraseñas
- URI privadas
- archivos `.env`
- datos personales reales
- carpetas `node_modules`

## Ejemplosen postman:

- GET /api/reservas:
![RESERVAS](<imagenes/Captura de pantalla 2026-11-25 205612.png>)

- GET /api/reservas?sala=Sala Norte:
![busqueda por sala](<imagenes/Captura de pantalla 2026-11-25 210151.png>)

- GET /api/reservas?orden=personas-asc
![personas en orden ascendente](<imagenes/Captura de pantalla 2026-11-25 210426.png>)

- GET /api/reservas?pagina=1&limite=2
![pagina y limite](<imagenes/Captura de pantalla 2026-11-25 210535.png>)

- GET /api/reservas?pagina=4&limite=2
![alt text](<imagenes/Captura de pantalla 2026-11-25 210638.png>)

- Casos inválidos (pagina=0, limite=21, etc.)
![pagina=0, limite=21](<imagenes/Captura de pantalla 2026-11-25 210903.png>)
![pagina = 4, limite1.3](<imagenes/Captura de pantalla 2026-11-25 211226.png>)

- MongoDB Atlas mostrando las 6 reservas
![reservas](<imagenes/Captura de pantalla 2026-11-25 213045.png>)

# BiblioTech — API REST para la gestión de una biblioteca

API REST desarrollada con **Node.js, Express y MongoDB** para gestionar los recursos y operaciones de una biblioteca. El proyecto implementa una arquitectura organizada por responsabilidades, autenticación mediante JSON Web Tokens (JWT), control de acceso por roles, validación de datos y manejo centralizado de errores.

## Tabla de contenido

- [Descripción del proyecto](#descripción-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Ejecución del servidor](#ejecución-del-servidor)
- [Rutas principales](#rutas-principales)
- [Autenticación y autorización](#autenticación-y-autorización)
- [Validación y manejo de errores](#validación-y-manejo-de-errores)
- [Pruebas de la API](#pruebas-de-la-api)
- [Seguridad](#seguridad)
- [Colaboradores](#colaboradores)
- [Licencia](#licencia)

## Descripción del proyecto

BiblioTech es una API REST que permite administrar la información de una biblioteca mediante solicitudes HTTP. Su estructura separa las rutas, los controladores, los modelos, los middlewares y la configuración de la base de datos para facilitar el mantenimiento y la ampliación del sistema.

La API utiliza MongoDB como base de datos y Mongoose para definir los modelos, validar los documentos e interactuar con la información almacenada.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express 5:** creación y gestión de rutas y solicitudes HTTP.
- **MongoDB:** base de datos NoSQL.
- **Mongoose:** modelado de datos y conexión con MongoDB.
- **JWT (`jsonwebtoken`):** generación y verificación de tokens de autenticación.
- **bcryptjs:** cifrado de contraseñas mediante hash.
- **express-validator:** validación y comprobación de datos recibidos.
- **dotenv:** carga de variables de entorno.
- **cors:** configuración del acceso entre distintos orígenes.
- **Nodemon:** reinicio automático del servidor durante el desarrollo.
- **Postman:** herramienta para probar los endpoints de la API.

## Funcionalidades

### Gestión de libros

- Consultar libros registrados.
- Consultar libros mediante sus identificadores.
- Registrar y actualizar información de libros.
- Gestionar el estado de los libros.
- Validar los datos requeridos para registrar o modificar libros.
- Controlar la disponibilidad de ejemplares.

### Gestión de autores

- Consultar autores.
- Registrar y actualizar autores.
- Consultar información mediante identificadores.
- Validar los datos de los autores.
- Gestionar su estado activo.

### Gestión de usuarios

- Registrar usuarios.
- Consultar usuarios mediante las operaciones autorizadas.
- Actualizar roles de usuario.
- Proteger la información sensible, como las contraseñas.

### Autenticación y autorización

- Autenticación mediante JWT.
- Verificación de tokens en rutas protegidas.
- Control de acceso según los roles del usuario.
- Restricción de operaciones administrativas a usuarios autorizados.

### Préstamos y devoluciones

- Gestionar las operaciones de préstamo de libros.
- Asociar préstamos con usuarios y libros.
- Controlar la disponibilidad de ejemplares.
- Gestionar la devolución de libros y el estado de los préstamos.
- Aplicar las reglas de negocio definidas para estas operaciones.

### Validaciones y manejo de errores

- Validación de los datos recibidos.
- Manejo de identificadores inválidos.
- Manejo de errores de validación de Mongoose.
- Detección de datos duplicados, como correos electrónicos e ISBN.
- Respuestas JSON con códigos HTTP apropiados.
- Manejo centralizado de errores inesperados.

## Estructura del proyecto

La estructura principal del repositorio es la siguiente:

biblioteca_tech/
├── controllers/
├── database/
├── docs/
├── helpers/
├── middlewares/
├── models/
├── routers/
├── validators/
├── .env.example
├── .gitignore
├── app.js
├── server.js
├── package.json
├── package-lock.json
└── README.md

### Responsabilidad de cada directorio y archivo

| Directorio o archivo | Descripción |
|---|---|
| `controllers/` | Contiene la lógica que procesa las solicitudes y construye las respuestas. |
| `database/` | Contiene la configuración y conexión con la base de datos. |
| `docs/` | Almacena documentación adicional del proyecto. |
| `helpers/` | Contiene funciones auxiliares reutilizables. |
| `middlewares/` | Contiene funciones intermedias para autenticación, autorización, validaciones y manejo de errores. |
| `models/` | Define los modelos y esquemas de datos de Mongoose. |
| `routers/` | Define las rutas y los endpoints de la API. |
| `validators/` | Contiene las reglas de validación de los datos de entrada. |
| `.env.example` | Presenta las variables de entorno necesarias para configurar el proyecto. |
| `.gitignore` | Define los archivos y directorios que Git debe excluir. |
| `app.js` | Configura Express, los middlewares y las rutas de la API. |
| `server.js` | Inicia el servidor y permite ejecutar la aplicación. |
| `package.json` | Define las dependencias, los metadatos y los comandos del proyecto. |
| `package-lock.json` | Registra las versiones resueltas de las dependencias. |

## Requisitos previos

Antes de instalar el proyecto, asegúrate de contar con:

- Node.js y npm instalados.
- Una instancia de MongoDB local o una base de datos en MongoDB Atlas.
- Git para clonar el repositorio.
- Postman u otra herramienta para probar solicitudes HTTP.

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Dlaiton738/biblioteca_tech.git
```

### 2. Ingresar al directorio

```bash
cd biblioteca_tech
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crea un archivo llamado `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

Configura las siguientes variables:

env
PORT=3700
MONGO_URI=mongodb://127.0.0.1:27017/biblioteca_tech
JWT_SECRET=coloca_una_clave_secreta_propia


**Importante:** la URI anterior es un ejemplo para una instancia local. Si utilizas MongoDB Atlas, reemplaza `MONGO_URI` por la cadena de conexión de tu clúster. Usa un valor secreto propio para `JWT_SECRET` y no compartas las credenciales.

El archivo `.env` no debe subirse al repositorio.

## Ejecución del servidor

### Modo desarrollo

Ejecuta:

```bash
npm run dev
```

Este comando inicia el servidor con Nodemon, lo que permite reiniciarlo automáticamente cuando se detectan cambios en los archivos.

### Modo normal

Ejecuta:

```bash
npm start
```

El servidor utiliza el puerto configurado en `PORT`. Con la configuración de ejemplo, la dirección local es:

text
http://localhost:3700


La ruta raíz de la aplicación está disponible en:

text
GET http://localhost:3700/


## Rutas principales

La aplicación organiza sus recursos bajo las siguientes rutas base:

| Recurso | Ruta base | Descripción |
|---|---|---|
| Libros | `/api/books` | Operaciones relacionadas con los libros. |
| Autores | `/api/authors` | Operaciones relacionadas con los autores. |
| Usuarios | `/api/users` | Registro y operaciones autorizadas sobre usuarios. |
| Autenticación | `/api/auth` | Operaciones de autenticación. |
| Préstamos | `/api/loans` | Operaciones relacionadas con préstamos y devoluciones. |

Estas rutas base se complementan con endpoints específicos definidos en los archivos de `routers/`. Los métodos HTTP, parámetros, requisitos de autenticación y cuerpos de las solicitudes dependen de cada endpoint.

### Ejemplo de consulta

Para consultar los libros mediante Postman, envía una solicitud:

http
GET http://localhost:3700/api/books


La respuesta exitosa utiliza un objeto JSON con información sobre los resultados de la consulta y los libros registrados.

## Autenticación y autorización

Las rutas que requieren autenticación utilizan tokens JWT. El cliente debe enviar el token en el encabezado HTTP `Authorization` cuando el endpoint lo requiera.

Formato del encabezado:

http
Authorization: Bearer <token>


El middleware de autenticación verifica el token y permite identificar al usuario que realiza la solicitud. Los middlewares de autorización comprueban si el usuario tiene el rol necesario para ejecutar la operación.

Las operaciones administrativas, como la gestión de determinados recursos o la actualización de roles, deben realizarse con un usuario que cuente con los permisos correspondientes.

Los endpoints públicos y protegidos se encuentran definidos en los archivos de `routers/`.

## Validación y manejo de errores

La API valida los datos recibidos antes de ejecutar las operaciones correspondientes. Además, dispone de un middleware centralizado para procesar los errores que se transfieren mediante `next(error)`.

Los errores se devuelven en formato JSON y utilizan códigos HTTP apropiados para representar el resultado de la solicitud.

Entre los códigos utilizados se encuentran:

| Código | Significado | Ejemplo |
|---|---|---|
| `200 OK` | Solicitud procesada correctamente. | Consulta o actualización exitosa. |
| `201 Created` | Recurso creado correctamente. | Registro de un libro o usuario. |
| `400 Bad Request` | Solicitud o datos inválidos. | Identificador inválido o JSON malformado. |
| `401 Unauthorized` | Falta autenticación válida. | Token ausente o inválido. |
| `403 Forbidden` | El usuario no tiene permisos suficientes. | Acceso a una operación administrativa sin el rol requerido. |
| `404 Not Found` | Recurso no encontrado. | Consulta de un identificador que no corresponde a un registro existente. |
| `409 Conflict` | Conflicto con los datos almacenados. | ISBN o correo duplicado. |
| `500 Internal Server Error` | Error inesperado del servidor. | Fallo interno no contemplado específicamente. |

Los mensajes de error dirigidos al cliente no deben exponer contraseñas, tokens, credenciales de la base de datos ni detalles internos innecesarios.

## Pruebas de la API
Las solicitudes pueden probarse con Postman.

Para Visualizar el flujo de la API inserte este archivo JSON en POSTMAN:
[Descargar colección de Postman](./docs/bibliotechPostmanCollection.json)

Para cada endpoint, verifica:

1. El método HTTP y la URL.
2. Los encabezados requeridos, incluida la autorización cuando corresponda.
3. El cuerpo JSON y los campos obligatorios.
4. El código de estado HTTP.
5. La estructura y el contenido de la respuesta JSON.
6. El comportamiento ante datos inválidos, identificadores inexistentes y datos duplicados.
7. Los permisos requeridos para acceder a rutas protegidas.

Las pruebas deben considerar tanto las solicitudes válidas como los errores de validación, autenticación, autorización y base de datos.

## Seguridad

Para mantener la seguridad del proyecto:

- No subas el archivo `.env` al repositorio.
- No publiques contraseñas, tokens JWT ni cadenas de conexión con credenciales.
- Guarda las contraseñas de los usuarios mediante hash.
- Protege las rutas que requieren autenticación y autorización.
- Valida los datos recibidos por la API.
- Evita enviar información sensible en las respuestas de error.
- Mantén las dependencias instaladas y el entorno de ejecución actualizados.

## Colaboradores

Proyecto académico desarrollado de manera colaborativa como ejercicio de construcción de una API REST con Node.js, Express y MongoDB.

Repositorio: [Dlaiton738/biblioteca_tech](https://github.com/Dlaiton738/biblioteca_tech)

## Licencia

Este proyecto declara la licencia ISC en su archivo `package.json`.

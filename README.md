API de Agendas de Despacho
API REST desarrollada con TypeScript y Express para la gestión de agendas de despacho según cobertura geográfica.
Requisitos Previos

Node.js (versión ≥16.0.0)
npm (incluido con Node.js)
Docker (para ejecución containerizada)

Instalación

1) Clonar el repositorio:

bashCopygit clone [url-del-repositorio]
cd dev-challenge

2) Instalar dependencias:

npm install

3) Compilar el proyecto:

npm run build


Ejecución
------------
Desarrollo
Para ejecutar en modo desarrollo con recarga automática:

npm run dev

Producción
Para compilar y ejecutar en modo producción:

npm run build
npm start

Docker:
Para ejecutar usando Docker:

# Construir la imagen
npm run docker:build

# Ejecutar el contenedor
npm run docker:run


Documentación API:

La documentación de la API está disponible a través de Swagger UI:

Swagger UI: http://localhost:3000/api-docs
Swagger JSON: http://localhost:3000/swagger.json

Endpoint Principal
POST /api/schedule/coverage

Ejemplo de request:

json{
    "products": ["2000378936145"],
    "commune": "San Bernardo"
}
Tests
Ejecutar tests unitarios:
npm test

Ver cobertura de tests:
npm run test:coverage

Estructura del Proyecto
Copy├── src/
│   ├── config/         # Configuraciones y constantes
│   ├── controllers/    # Controladores de rutas
│   ├── interfaces/     # Interfaces TypeScript
│   ├── middlewares/    # Middlewares Express
│   ├── repositories/   # Acceso a datos
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   └── utils/          # Utilidades
├── resources/          # Archivos JSON (base de datos simulada)
├── tests/             # Tests unitarios
└── dist/              # Código compilado


Scripts Disponibles

npm start: Inicia la aplicación en producción
npm run dev: Inicia la aplicación en modo desarrollo
npm run build: Compila el proyecto
npm test: Ejecuta los tests
npm run lint: Ejecuta el linter
npm run lint:fix: Corrige errores de linting
npm run docker:build: Construye la imagen Docker
npm run docker:run: Ejecuta el contenedor Docker

Variables de Entorno

PORT: Puerto del servidor (default: 3000)

Enrique Garrido
kgarridofa@gmail.com
Cel: +51 971756021 

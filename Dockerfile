# Dockerfile
FROM node:18-alpine

# Creamos y establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Copiamos tsconfig.json
COPY tsconfig.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el código fuente
COPY src/ ./src/

# Muy importante: Creamos el directorio resources y copiamos los archivos JSON
RUN mkdir -p ./resources
COPY resources/products.json ./resources/
COPY resources/schedules.json ./resources/
COPY resources/schedule-routes.json ./resources/

# Verificamos que los archivos existan
RUN ls -la ./resources/

# Compilamos el código TypeScript
RUN npm run build

# Exponemos el puerto que usa la aplicación
EXPOSE 3000

# Establecemos NODE_ENV
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"]
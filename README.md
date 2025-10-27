<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Gestor de Ventas 2025

# 🏗️ Descripción del Proyecto:

Este proyecto es un backend desarrollado con **NestJS**, que utiliza **MySQL** como base de datos y **Prisma** ORM para la gestión y modelado de datos.

Cuenta con un sistema de autenticación basada en **JSON Web Tokens (JWT)** y encriptación de contraseñas mediante **bcrypt**, garantizando la seguridad de los usuarios y sus credenciales.

## ⚡ Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (`npm i -g @nestjs/cli`)

## 🛠️ Instalación del proyecto

### Instalar las dependencias de Node.js:

```bash
npm install
```

### Crear el archivo de variables de entorno .env en la raíz del proyecto

DATABASE_URL: conexión usada por NestJS
JWT_SECRET="contraseña-secreta"
JWT_EXPIRATION_TIME="3600s"

# Migraciones con Prisma

### 1 Crear y ejecutar migraciones según el schema definido en prisma/schema.prisma:

```bash
npx prisma migrate dev --name init
```

### 2 Generar Prisma Client (para que NestJS pueda usarlo):

```bash
npx prisma generate
```

### 3 Correr consulta.sql

Inicializar datos en base de datos que se encuentran en db/consulta.sql:

### 4 Luego ya podemos correr el programa con

```bash
npm run start:dev
```

### Si se cambia algo en esl esquema de la base de datos se debera correr este comando y luego seguir con el paso 1

```bash
npx prisma migrate reset
```

### Podemos visualizar la base de datos con

```bash
npx prisma studio
```

Podemos Acceder a la aplicacion con http://localhost:3000/openapi

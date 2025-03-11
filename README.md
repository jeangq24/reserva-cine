# Proyecto Reservaciones Cinema

Este repositorio contiene un sistema de reservaciones para un cine, desarrollado como parte de una prueba técnica. El proyecto cuenta con un **backend** en **Node.js** y un **frontend** en **React** con **Next.js**.

## 📌 Tecnologías utilizadas

### Backend:
- **Node.js**
- **TypeScript**
- **Sequelize**
- **PostgreSQL**
- **Arquitectura Hexagonal**

### Frontend:
- **React**
- **Next.js**
- **TypeScript**
- **React Hook Form**
- **Tailwind CSS**

## 🚀 Instalación y ejecución local

### 1. Clonar el repositorio

```sh
$ git clone https://github.com/jeangq24/reserva-cine.git
$ cd reserva-cine
```

### 2. Instalar dependencias

Ejecuta el siguiente comando en ambas carpetas (backend y frontend):

```sh
$ npm install
```

Si hay problemas con las dependencias, usa:

```sh
$ npm install --force
```

## ⚙️ Configuración del backend

### 3. Configurar las variables de entorno

En la carpeta **backend**, crea un archivo `.env` con el siguiente contenido:

```ini
PORT=3000 # Puedes cambiarlo según sea necesario
DB_HOST=localhost
DB_PORT=5432 # Puerto por defecto de PostgreSQL
DB_NAME=nombre_de_tu_base
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 4. Ejecutar el backend

```sh
$ cd backend
$ npm run dev
```

El backend se ejecutará en `http://localhost:3000`.

Dentro de la carpeta **backend** encontrarás un archivo `README.md` con la documentación de los endpoints disponibles.

## 🎨 Configuración del frontend

### 5. Ejecutar el frontend

```sh
$ cd frontend
$ npm run dev
```

El frontend se ejecutará en `http://localhost:3001`.

## 📌 Notas adicionales

- El proyecto gestiona los endpoints con una funcionalidad básica para demostrar la conexión con el backend.
- Los componentes visuales siguen principios de **UI/UX**, siendo responsivos y modulares.
- Debido a limitaciones de tiempo, no se han implementado validaciones avanzadas o una estructura más compleja.

## 🔨 Estado del desarrollo

El proyecto sigue en desarrollo y ha sido una experiencia muy gratificante trabajar en él. Planeo continuar mejorándolo, agregando nuevas funcionalidades y optimizaciones para hacerlo más robusto y completo.

---

📌 *¡Espero que disfrutes explorando este proyecto!* 🚀


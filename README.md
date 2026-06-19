## 🌸 Elix Fragancias 🌸

El proyecto consta de una plataforma web que funciona como catálogo de perfumes para un emprendimiento donde los potenciales clientes pueden consultar todos los productos con su respectiva información de una forma sencilla y accesible.

Se cuenta con un panel de administración para la gestión de la información de los productos, ventas y promociones. 

### Estructura del proyecto

```
Elix/
├── App/     # App en NextJS con Tailwind
├── Server/     # API REST con Django REST

```

### Tecnologías Principales 

|Capa|Stack|
|---|---|
|App|NextJS, Tailwind, Zustand|
|Server|Django REST, PostgreSQL, Docker|

### Puertos utilizados 

|Servicio|Puerto|
|---|---|
|Frontend (NextJS)|3000|
|Backend (Django REST)|8000|
|Base de Datos (PostgreSQL)|5432|

### Inicio rápido

**1. Requisitos previos**
| Herramienta | Versión |
|---|---|
| **[Node.js](https://nodejs.org/)** | 20 o superior |
| **[Python](https://www.python.org/downloads/)** | 3.10 o superior |
| **[PostgreSQL](https://www.postgresql.org/download/)** | 16 o superior |
| **[Docker](https://www.docker.com/products/docker-desktop/)** | Última versión estable |

#### Variables de entorno

Antes de iniciar el proyecto, configura los archivos de entorno correspondientes:

```
Elix/
├── App/.env.dev    # App en NextJS con Tailwind
├── Server/.env.dev     # API REST con Django REST

```

**2. Ejecución del proyecto**

Desde la raiz del proyecto ejecutar

```
docker compose -f docker-compose-prod.yml up --build

```
**3. Detener el proyecto**

```
docker compose down

```

Si además se desean eliminar los volúmenes ejecutar: 

```
docker compose down -v

```



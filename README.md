## 🌸 Elix Fragancias 🌸

El proyecto consta de una plataforma web que funciona como catálogo de perfumes para un emprendimiento donde los potenciales clientes pueden consultar todos los productos con su respectiva información de una forma sencilla y accesible.

Se cuenta con un panel de administración para la gestión de la información de los productos, ventas y promociones. 

### Estructura del proyecto

```
Elix/
├── App/               # Next.js (App Router, API Routes, Tailwind, Zustand, Prisma)
└── docker-compose.yml
```

### Tecnologías

| Capa | Stack |
|---|---|
| App + API | Next.js 15, Tailwind CSS, Zustand |
| ORM | Prisma |
| Base de Datos | PostgreSQL 16 |
| Imágenes | Cloudflare R2 |
| Auth | JWT (jose + bcryptjs) |

### Puertos

| Servicio | Puerto |
|---|---|
| Frontend + API | 3000 |
| Base de Datos | 5432 |

### Inicio rápido

**1. Requisitos previos**

| Herramienta | Versión |
|---|---|
| **[Node.js](https://nodejs.org/)** | 20 o superior |
| **[PostgreSQL](https://www.postgresql.org/download/)** | 16 o superior |
| **[Docker](https://www.docker.com/products/docker-desktop/)** | Última versión estable |

**2. Variables de entorno**

Configurar el archivo `App/.env.dev` con tus credenciales:

```env
DATABASE_URL="postgresql://elix_user:password@localhost:5432/elix"
JWT_SECRET="tu_jwt_secret"

R2_ACCOUNT_ID="tu_account_id"
R2_ACCESS_KEY_ID="tu_access_key"
R2_SECRET_ACCESS_KEY="tu_secret_key"
R2_BUCKET_NAME="elix-images"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"
```

**3. Ejecución con Docker**

Desde la raíz del proyecto:

```bash
docker compose up --build
```

**4. Ejecución local (sin Docker)**

Asegurarse de que PostgreSQL esté corriendo, luego:

```bash
cd App
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

**5. Detener el proyecto**

```bash
docker compose down
```

Para eliminar volúmenes:

```bash
docker compose down -v
```

### Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Iniciar en modo desarrollo |
| `npm run build` | Generar build de producción |
| `npm run lint` | Verificar estilo del código |
| `npm run prisma:generate` | Generar Prisma Client |
| `npm run prisma:migrate` | Ejecutar migraciones |
| `npm run prisma:seed` | Poblar base de datos |

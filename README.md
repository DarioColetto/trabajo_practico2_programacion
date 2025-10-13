# Trabajo Práctico 2 - Programación IV <br>

Proyecto base para el TP con Node + TypeScript + Express + Zod + Vitest/Supertest, siguiendo TDD.

## 📦 Requisitos

- Node.js 18 o superior

- npm 9+



## 🚀 Instalación y uso

### Clonacion del Repositorio.
1. Abrir la consola o terminal del sistema operativo o IDE de preferencia. 
2. Ubicar o crear la carpeta de destino
3. Clonar el repositorio (GIT requerido) con el siguiente comando:
``` bash
git clone https://github.com/DarioColetto/trabajo_practico2_programacion
```

### Instalar las dependencias
```bash
npm i
```
### Ejecucion de app o tests.
```bash
# Desarrollo (levanta el servidor)
npm run dev

# Correr tests
npm test

# Coverage (objetivo ≥ 80%)
npm run coverage

```

Nota: Es posible correr los archivos de test por separado, usando por ejemplo:  
```npx vitest run tests/unit/order.service.spec.ts```

## 🧰 Scripts disponibles
Ejecutar **npm run**

- **dev**: ejecuta src/server.ts con tsx

- **test**: corre la suite de tests (Vitest)

- **test**:watch: modo watch

- **coverage**: genera reporte de cobertura

- **lint**: lint de todo el repo (ESLint)

## 🗂️ Estructura principal del proyecto

```bash
-api/
├─ src/
│ ├─ app.ts 
│ ├─ server.ts
│ ├─ routes/
│ ├─ domain/ #Reemplaza a Models
│ ├─ services/
│ └─ repo/
├─ tests/
│ ├─ unit/
│ └─ integration/
├─ package.json
├─ tsconfig.json
├─ vitest.config.ts
├─ .eslintrc.json
├─ .gitignore
├─ README.md
└─ TEORIA.md
```
## 📄 Archivos de configuración sugeridos

### ```vitest.config.ts```

```ts
import { defineConfig } from 'vitest/config';


export default defineConfig({
    test: {
    globals: true,
        environment: 'node',
        coverage: {
            reporter: ['text', 'html'],
            include: ['src/**/*.{ts,tsx}']
        }
    }
});
```
### ```eslintrc.json```

```json
{
    "env": { "es2022": true, "node": true },
    "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },
    "extends": ["eslint:recommended"],
    "rules": {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": "off"
    }
}
```

### ```.gitignore```
```git
node_modules/
dist/
coverage/
.env
.DS_Store
```
### ```tsconfig.json```
```json
{
    "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "types": ["vitest/globals", "node"],
    "outDir": "dist"
    },
    "include": ["src", "tests"]
}
```
### ```package.json```

```json

{
    "name": "tp2",
    "type": "module",
    "scripts": {
    "dev": "tsx src/server.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "lint": "eslint ."
    },
    "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/supertest": "^2.0.16",
    "eslint": "^9.11.1",
    "supertest": "^7.0.0",
    "tsx": "^4.16.0",
    "typescript": "^5.6.3",
    "vitest": "^2.1.3",
    "zod": "^3.23.8"
    },
    "dependencies": {
    "express": "^4.19.2"
    }
}
```


## 🔌 API HTTP

### POST /orders

Crea un pedido.

- Body (JSON)

```json
{
  "items": [ { "size": "M", "toppings": ["mushroom", "onion"] } ],
  "address": "Calle Larga 1234"
}
```

- Reglas: size ∈ {S,M,L}, toppings.length ≤ 5, items.length ≥ 1, address.length ≥ 10.

Respuestas:

- ```201``` con el pedido creado { id, total, status, ... }

- ```422``` si falla validación (detalles en el body)

### GET /order/:id

Obtiene un pedido por id (UUID).

- Respuestas: 200 con el pedido, 404 si no existe.

### POST /orders/:id/cancel

Cancela un pedido si aún no fue entregado.

Regla: si ```status = delivered``` → no se puede cancelar.

Respuestas: ```200``` (cancelado), ```404``` (no existe), ```409``` (no cancelable por delivered).

### GET /orders?status=<pending|preparing|delivered|canceled>

Lista pedidos, opcionalmente filtrando por estado.

## 🧱 Diseño y TDD

- **makeApp()**: separa la app de Express del listen para testear con Supertest sin abrir puerto.

- **TDD**: ciclo Rojo → Verde → Refactor, en pasos pequeños.

- **Validación**: Zod con safeParse en bordes HTTP (422) y parse en params obligatorios (errores controlados).

- **Reglas de dominio**: cálculo de precio según tamaño+toppings; no cancelar si delivered.


## Evidencia de TDD
<font size=3>Primero se realizo la estructura general del proyecto definiendo las funciones minimas para su uso. <br> 
Luego se desarrollaron los tests siguiendo el orden “Rojo → Verde → Refactor”<br>

Ejemplo:

1. Rojo: el test exige que list('delivered') filtre. La implementación ignoraba status, devolviendo todos.

2. Verde: fix mínimo → pasar status al repo (listByStatus(status)), el test pasa.

3. Refactor: tipar con OrderStatus y pulir el repo para dejar clara la rama undefined vs status.

```diff
- list(_status?: OrderStatus) {
-   return OrdersMemoryRepo.listByStatus();
- }
+ list(status?: OrderStatus) {
+   return OrdersMemoryRepo.listByStatus(status);
+ }
```
 <br> Se testearon las funciones principaes y se refinaron algunas pruebas como para termminar de cubrir el **Coverage** requerido. <br>
 Se excluyó ```'src/domain/order.types.ts'``` del coverage ya que los atributos de las órdenes eran chequeados en otras partes del código.<font>

## 🧾 Cobertura

Ejecutar npm run coverage.

Umbral objetivo ```≥ 80%``` (instrucciones, ramas, funciones y líneas).

## Matriz de casos

![Imagen cargando](https://github.com/DarioColetto/trabajo_practico2_programacion/blob/main/matrizdeusos.PNG "Matriz de casos")

## User stories

**Función para buscar pedidos por ID y cancelarlo. En caso  de no encontrarlo nos avisa de que no eixte un pedido con ese ID** <br>
**Ubicación:** order.service.spec.ts (Línea 8) <br><br>


**Funciónes para crear pedidos y filtrarlos por estado. En este caso se crean 3 pedidos, se buscan los pedidos que esten en preparación y los retorna.** <br>
**Ubicación:** order.repo.spec.ts (Línea 9) <br><br>

**Funciónes para retornar todos los pedidos y tambien para filtrarlos por estado. En este caso se crean 2 pedidos y a uno se le da el estado de entregado. En una ocasión se llama a todos los pedidos y en otra se filtra para buscar solo los pedidos entregados.** <br>
**Ubicación:** order.service.spec.ts (Línea 13) <br><br>

**Se utiliza la función para crear pedidos. En este caso se completa el campo de dirección pero no el del pedido entonces nos da error por estar incompleto.** <br>
**Ubicación:** app.orders.spec.ts (Línea 10) <br><br>

**Se utiliza la función para crear pedidos. En este caso se completa el campo de dirección pero al no alcanzar el mínimo de caracteres nos da error.** <br>
**Ubicación:** app.orders.spec.ts (Línea 18) <br><br>

**Se utiliza la función para cancelar pedidos. En este caso se no existe un pedido con la ID proporcionada, entonces da error.** <br>
**Ubicación:** app.orders.spec.ts (Línea 32) <br><br>

**Se utiliza la función para filtrar pedidos por su estado. En este caso se filtra por una palabra que no esta disponible en el filtro, por eso nos dice que nuestra solicitud es inválida.** <br>
**Ubicación:** app.orders.spec.ts (Línea 60) <br><br>

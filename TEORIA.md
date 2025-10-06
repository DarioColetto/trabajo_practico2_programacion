# TEORIA
### 1) Ciclo TDD (Rojo → Verde → Refactor)

Primero se escribe un test que falla (Rojo). Luego, la implementación mínima para hacerlo pasar (Verde). Finalmente, se mejora el diseño manteniendo los tests en verde (Refactor). Esto reduce el riesgo, orienta el diseño a los usos reales y deja trazabilidad.

### 2) Unit vs Integración vs E2E

- Unit aísla funciones/clases, sin IO. Integración valida la interacción de módulos (p. ej., Express+rutas+validación). 
- E2E prueba el sistema completo en entorno cercano a producción. Cada nivel aporta feedback distinto y complementario.

### 3) Dobles de prueba (Stub/Mock/Spy)

- Stub: reemplazo con respuestas prefijadas para aislar dependencias. 
- Mock: además de simular, verifica interacciones/expectativas.
- Spy: observa llamadas y parámetros sin alterar comportamiento. Se elige según si importan datos, mensajes o inspección.

### 4) ¿Por qué separar app de server?

makeApp() devuelve la instancia de Express sin listen, permitiendo testear con Supertest sin abrir puertos. server.ts sólo hace el arranque HTTP. Esto acelera tests y simplifica el setup/teardown.

### 5) Zod: parse vs safeParse

- parse lanza excepción; conviene cuando un fallo debe considerarse bug y abortar el flujo interno. 
- safeParse devuelve { success, data/error } y es ideal en endpoints HTTP para responder 422 con detalle de validación sin tirar excepciones.

### 6) Reglas de dominio (ejemplos)

Precio por ítem = base por tamaño (S/M/L) + (precio por topping × cantidad).

Un pedido con estado delivered no puede cancelarse. Estas reglas deben probarse unitariamente (en services) además de validarse a nivel HTTP.

### 7) Malos olores en tests

Nombres y descripciones poco claras.

Duplicación de setup (extraer builders/fixtures).

Asserts débiles que no cubren contratos (status, shape de body, transiciones de estado).

Mocks frágiles que testean implementación en lugar de comportamiento observable.

### 8) Trazabilidad Casos ↔ Tests

Mantener una tabla con ID de caso y referencia al archivo/describe/it. Incluirla en README y mantenerla actualizada al agregar escenarios.

### 9) Cobertura no es calidad

Cobertura alta no garantiza buenos tests. Apuntar a los escenarios críticos y reglas de negocio, manteniendo un umbral saludable (≥ 80%) sin perseguir 100% a cualquier costo.

### 10) Builder/Helper para tests

Usar builders para crear inputs válidos por defecto y hacer override parcial. Ejemplo:

```
function makeOrderInput(over: Partial<{items:any; address:string}> = {}) {
return {
items: [{ size:'M', toppings:['a'] }],
address: 'Direccion valida 123',
...over
};
}

```
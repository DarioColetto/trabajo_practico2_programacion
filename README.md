# Trabajo Práctico 2 - Programación IV <br>
<font size=4>**Aclaración:** Usamos **Vitest** para realizar los test.</font><br>

## Guía de ejecución
<font size=3>1. Para poder correr el programa, primero es necesario tener instalado Node. <br>
2. Crear una carpeta o usar una vacía <br>
3. Abrir esa carpeta con Visual Studio Code  <br>
4. En una terminal, correr `git clone https://github.com/DarioColetto/trabajo_practico2_programacion` <br>
5. Luego correr en terminal `npm install express zod` <br>
6. Ahora es posible correr en terminal `npm run coverage` para ver la cobertura de los test sobre el total del código
o es posible correr los archivos de test por separado, usando por ejemplo, `npx vitest run tests/unit/order.service.spec.ts`</font> <br>

## Evidencia de TDD
<font size=3>Primero hicimos la estructura general (sin definir demasiadas funciones), como por ejemplo el MVC (en nuestro caso models se llama domain), agregamos scripts, configuramos los .config, etc. <br> Luego implementamos los test, los cuales daban “rojo” o error ya que no encontraban lo que tenían que testear. Ni bien hacíamos un test, tratábamos de implementar las cosas necesarias para que ese test funcione y luego pasábamos al siguiente. <br> Cuando consideramos que ya habíamos testeado todas o casi todas las situaciones posibles fue cuando agregamos algún que otro detalle, como por ejemplo excluimos 'src/domain/order.types.ts' del coverage ya que los atributos de las órdenes eran chequeados en otras partes del código.<font>
## Endpoints
<font size=4>**POST /orders**</font><br>
Crea un pedido.

<font size=4>**GET /orders/:id**</font><br>
Obtiene un pedido por su ID.


<font size=4>**POST /orders/:id/cancel**</font><br>
Cancela un pedido (si no está entregado).


<font size=4>**GET /orders?status**</font><br>
Lista pedidos filtrados por estado.

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

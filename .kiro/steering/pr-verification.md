---
inclusion: manual
---

# Verificacion de PRs: proteger la funcionalidad existente

Usa esta guia al revisar cualquier Pull Request del proyecto e-commerce. El objetivo
es confirmar que los cambios propuestos NO rompen ninguna de las funcionalidades ya
existentes antes de aprobar o fusionar.

## Como usar esta guia

1. Obten el diff de la PR (`git diff main...<rama>` o la vista de la PR).
2. Recorre el checklist de funcionalidades de abajo y, por cada punto, evalua si el
   diff podria afectarlo. Presta especial atencion a `src/App.js` (estado del carrito),
   `src/Pages/` y `src/Components/`.
3. Ejecuta las comprobaciones automaticas (seccion "Comprobaciones obligatorias").
4. Reporta hallazgos: que funcionalidad esta en riesgo, por que, y como verificarlo.
   Si algo se rompe, bloquea la aprobacion y explica el fix sugerido.

## Checklist de funcionalidades a proteger

Navegacion y catalogo
- [ ] El header permite ir al Home (logo) y al Checkout (icono de carrito).
- [ ] Las rutas `/`, `/category/:id` y `/checkout` siguen resolviendo.
- [ ] La categoria con id `all` muestra todos los productos; otros ids filtran por `categoryId`.

Filtros
- [ ] Los checkboxes de "delivery" y "stock" filtran los productos correctamente.
- [ ] Con ambos checkboxes activos se muestran solo productos con `inStock && delivery`.
- [ ] Sin checkboxes activos se muestran todos los productos de la categoria.

Carrito (estado en src/App.js con useReducer)
- [ ] "Add to cart" agrega el producto con `quantity: 1`.
- [ ] El boton "+" (handleIncrease -> accion INCREASE) aumenta la cantidad en 1.
- [ ] El boton "-" (handleDecrease -> accion DECREASE) disminuye la cantidad.
- [ ] La cantidad NUNCA baja de 1 (clamp con Math.max(1, ...)). No se permiten 0 ni negativos.
- [ ] "Eliminar" (handleRemove -> accion REMOVE) quita el item por su id.
- [ ] La logica de ADD/REMOVE/INCREASE/DECREASE vive en el reducer, no en los handlers.

Checkout
- [ ] El total se calcula como suma de `price * quantity` de todos los items.
- [ ] Con el carrito vacio se muestra el mensaje "Nothing in the cart".
- [ ] "Proceed to Pay" muestra el toast de confirmacion.

## Comprobaciones obligatorias antes de aprobar

- [ ] `npm run build` compila sin errores. En CI (`CI=true`) los warnings de ESLint se
      tratan como errores, asi que la PR NO debe introducir warnings nuevos.
- [ ] La PR no agrega warnings de ESLint nuevos respecto a `main`. Los warnings
      preexistentes en `src/Pages/Category.js` y `src/Pages/Checkout.js` son conocidos;
      no exijas arreglarlos, pero tampoco permitas que aparezcan nuevos.
- [ ] Los archivos fuente se guardan en UTF-8 SIN BOM (un BOM rompe el build por la regla
      `unicode-bom` de ESLint).
- [ ] La PR sale de una rama (no de `main`) y no incluye cambios no relacionados
      (por ejemplo, `package-lock.json` sin cambios de dependencias reales).

## Senales de alerta en el diff

- Cambios en el `reducer` de `src/App.js`: verifica que cada `case` siga devolviendo un
  estado nuevo e inmutable y que no se rompa el clamp de cantidad minima.
- Renombrar o eliminar tipos de accion (ADD, REMOVE, INCREASE, DECREASE) sin actualizar
  los dispatch correspondientes.
- Cambios en las props que `App.js` pasa a `Checkout` (cart, handleRemove, handleDecrease,
  handleIncrease) o a `Category` (addToCart).
- Modificaciones en `src/data/productsData.js` o `categoriesData.js` que cambien la forma
  de los datos (campos id, categoryId, price, quantity, inStock, delivery, thumbnail).
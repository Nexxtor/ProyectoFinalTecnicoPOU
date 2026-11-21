# Convención de commits

Este repositorio usa una variante de Conventional Commits para que el historial sea legible y permita reconstruir el proceso de construcción.

## Formato

```text
tipo(alcance): descripción breve en imperativo
```

Ejemplos:

```text
feat(eventos): agregar búsqueda por ciudad
fix(carrito): evitar cantidades negativas
test(api): cubrir la creación de órdenes
docs(arquitectura): explicar la capa de datos
```

## Tipos

| Tipo | Uso |
| --- | --- |
| `chore` | Configuración, dependencias, herramientas. |
| `feat` | Funcionalidad nueva. |
| `fix` | Corrección de un error. |
| `test` | Pruebas automatizadas. |
| `docs` | Documentación. |
| `refactor` | Reorganización sin cambiar el comportamiento. |
| `style` | Formato o estilos sin cambio lógico. |
| `perf` | Mejora de rendimiento. |

## Reglas

1. Un commit debe representar un cambio coherente.
2. El mensaje se escribe en imperativo: “agregar”, no “agregado” ni “agregando”.
3. No se usan mensajes genéricos como “cambios”, “avance” o “arreglos”.
4. Si el commit corrige un error, el mensaje debe describir el comportamiento corregido.
5. Los commits de prueba deben indicar qué se está probando.
6. Cada commit debe dejar el proyecto en un estado comprensible.
7. Las etiquetas `leccion-N` marcan el estado del código al finalizar una lección.

## Etiquetas

```bash
git tag leccion-1
git tag leccion-2
git tag leccion-3
git tag leccion-4
git tag leccion-5
git tag leccion-6
git tag leccion-7
git tag v1.0.0
```

Las etiquetas permiten generar los ZIP de cada lección:

```bash
git archive --format=zip --output=leccion-4.zip leccion-4
```

## Buenos ejemplos

```text
feat(auth): proteger las rutas administrativas por rol
feat(carrito): persistir los items en localStorage
feat(boletos): generar el payload del QR por boleto
test(checkout): validar el formulario de pago
```

## Malos ejemplos

```text
cambios
avance del proyecto
arreglos varios
update
```

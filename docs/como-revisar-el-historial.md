# Cómo revisar el historial

## Ver la historia resumida

```bash
git log --oneline --decorate --graph
```

## Ver los commits con sus etiquetas

```bash
git log --oneline --decorate --reverse
```

## Ver el detalle de un commit

```bash
git show ce493b7
```

## Ver los archivos modificados en un commit

```bash
git show --stat 3c46c5d
```

## Comparar dos momentos del proyecto

```bash
git diff leccion-1 leccion-4
```

## Revisar el estado de una lección

```bash
git checkout leccion-3
npm install
npm run dev
```

Para volver a la versión final:

```bash
git checkout main
```

## Generar un ZIP de una lección

```bash
git archive --format=zip --output=leccion-3.zip leccion-3
```

## Ver quién cambió una línea

```bash
git blame src/pages/CheckoutPage.jsx
```

## Buscar un cambio en el historial

```bash
git log -S "createOrder" --oneline
```

## Buenas prácticas al revisar

1. Leer el mensaje antes que el diff.
2. Revisar un commit a la vez.
3. Ejecutar la aplicación en la etiqueta correspondiente.
4. Comparar el estado con la lección que se está estudiando.
5. No mezclar la revisión del historial con cambios locales.

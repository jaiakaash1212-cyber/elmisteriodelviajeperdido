# El Misterio del Viaje Perdido

Escape room digital de misterio en español A1. Investiga la maleta de Isabel de la Vega, resuelve 15 misterios en cuatro actos, recuerda las cifras que ganas, abre los candados y descubre la historia del Atlas de los Siete Secretos.

## Ejecutar localmente

Requisitos: Node.js 20.19+ (o la versión compatible con Vite del proyecto).

```bash
npm install
npm run dev
```

Vite mostrará la dirección local para abrir el juego. No se necesita una clave de API ni un servicio externo.

## Comprobar y compilar

```bash
npm run lint
npm run build
```

## Mecánicas

- Temporizador continuo de 20 minutos y modo relajado al agotarse.
- 15 misterios con interacciones variadas.
- Cada misterio resuelto correctamente otorga 10 puntos y muestra una cifra durante tres segundos.
- Las cifras se conservan solo en el estado de la sesión para validar el candado; no se muestran en una lista. La combinación se forma en el orden en que se ganaron las cifras.
- Para conseguir una llave hay que resolver al menos el 50% de los misterios del acto. Con un 70% o más se obtiene además una pista extra. Por debajo del 50%, hay un desafío de recuperación.
- La traducción al inglés se puede usar una vez por acto y cuesta 50 puntos. Se necesita tener esos puntos disponibles.
- El progreso y las llaves se mantienen durante el modo relajado.

La validación se ejecuta en el navegador; es apropiada para una experiencia educativa, pero no debe considerarse un sistema de seguridad contra la inspección del código fuente.

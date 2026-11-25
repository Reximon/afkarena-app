# The Resonating Hall

Aplicación web bilingüe (inglés/español) para llevar el seguimiento de tu cuenta de **AFK Arena Classic**: qué héroes tienes, en qué has invertido y qué formaciones usas. Todos los datos se guardan en el propio navegador, así que no hay backend, ni cuentas, ni base de datos remota.

**Demo en vivo:** <https://reximon.github.io/afkarena-app/> · **Versión:** 1.4.0

## Índice

- [Qué puedes hacer](#qué-puedes-hacer)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Comandos](#comandos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Datos y catálogos](#datos-y-catálogos)
- [Persistencia, exportación e importación](#persistencia-exportación-e-importación)
- [Idiomas](#idiomas)
- [Calidad y pruebas](#calidad-y-pruebas)
- [Despliegue](#despliegue)
- [Documentación adicional](#documentación-adicional)
- [Aviso legal](#aviso-legal)

## Qué puedes hacer

### Héroes y roster

- Catálogo de los 255 héroes de AFK Arena Classic, generado desde el CDN comunitario `afk-mine`, con las cinco clases reales (Warrior, Tank, Ranger, Mage y Support) resueltas desde bases de datos públicas.
- Ficha por héroe con ascensión, nivel, pertenencia al Cristal Resonante, Signature Item, Furniture (0/3/9/36), Engraving (0/30/60/80), equipo, artefacto o colección, y notas libres.
- Búsqueda y filtros por facción, clase, ascensión y rol, además de un filtro para ver solo los héroes que estás priorizando.
- Panel principal con resumen de héroes, equipos y mascotas, reparto por facción, héroes objetivo y accesos rápidos.
- Héroes Dimensionales vinculados a otro héroe: copian su ascensión y los cambios posteriores se propagan. Si desvinculas, conservan la última ascensión copiada; mientras dura el vínculo, el selector de ascensión queda bloqueado.

### Equipamiento e inversión

- Cuatro piezas de equipo (arma, casco, pecho y botas) con tier (Mítico y T1–T5), estrellas de 0 a 5, facción, equipo resonante y equipo exclusivo.
- **22 artefactos**: los siete de Dura y quince de clase, estos últimos restringidos por la clase real del héroe.
- **23 colecciones** con restricción de clase, nivel de 0 a 10, nivel de habilidad de 0 a 3 y stats míticos de 0 a 8.
- Artefacto y colección son mutuamente excluyentes para un mismo héroe; al cambiar de uno a otro se conserva el progreso guardado de la colección.

### Equipos

- Formaciones con 2 héroes delante y 3 detrás, con nombre, modo (campaña, arena, Dream Realm, Guild Hunt, torre u otro) y notas. Los héroes se colocan arrastrando y soltando.
- Bonus de facción calculado automáticamente a partir de las facciones reales del equipo: 3 héroes → +10% ATK/HP; 3+2 → +15%/+15%; 4 → +15%/+20%; 5 → +25%/+25%. Los Celestiales actúan como comodín para las facciones normales, los Hipogeos suman su propia escala, cada Draconis aporta +2% de ATK/HP y los Dimensionales no cuentan.
- Puedes asignar una mascota a cada equipo.

### Mascotas (Beasts)

- **30 mascotas** con sus tres buffs de atributo (fuerza, inteligencia y agilidad). El nivel de bestia es la suma de los tres, no se introduce a mano.
- Entrenamiento de 0 a 3, disponible solo en mascotas Elite y Fabled y desbloqueado al alcanzar los niveles de bestia 3, 9 y 15.
- Nivel de resonancia objetivo (0–54) definido por ti. Es solo informativo: las mascotas por debajo muestran un indicador `+N` con lo que les falta, pero los buffs nunca se suben automáticamente.
- El objetivo se limita al máximo del tier de cada mascota (18 Rare, 36 Elite, 54 Fabled).

### Datos

- Exportación a JSON legible por personas e importación validada con Zod, ambas desde **Ajustes** y compatibles con copias antiguas.
- Interfaz en inglés y español, con los términos propios del juego siempre en inglés.
- Diseño oscuro adaptable con retratos enmarcados e imágenes oficiales de facción.

## Tecnologías

| Capa               | Tecnología                                                                    |
| ------------------ | ----------------------------------------------------------------------------- |
| Interfaz           | React 19 con TypeScript estricto (`verbatimModuleSyntax`)                     |
| Compilación        | Vite 8                                                                        |
| Estilos            | Tailwind CSS v4 (CSS-first, sin `tailwind.config`; tokens en `src/index.css`) |
| Estado             | Zustand 5 con `persist`                                                       |
| Validación         | Zod 4                                                                         |
| Enrutado           | `HashRouter` de react-router                                                  |
| i18n               | i18next + react-i18next                                                       |
| Componentes        | Radix UI (diálogo, popover, select, tooltip), lucide-react                    |
| Arrastrar y soltar | dnd-kit                                                                       |
| Pruebas            | Vitest + Testing Library sobre jsdom                                          |

La guía visual (tipografía, superficies, navegación) está en [DESIGN.md](DESIGN.md).

## Requisitos

- Node.js 24 y npm. Es la versión que usan la CI y el Dockerfile.
- Un navegador moderno con `localStorage` habilitado.

## Puesta en marcha

```bash
npm install
npm run dev
```

El servidor de desarrollo queda en <http://localhost:5173>.

Para probar el build de producción tal cual se publica:

```bash
npm run build
npm run preview
```

## Comandos

| Comando                     | Qué hace                                                             |
| --------------------------- | -------------------------------------------------------------------- |
| `npm run dev`               | Arranca el servidor de desarrollo de Vite en el puerto 5173.         |
| `npm run build`             | Comprueba tipos y genera la compilación de producción en `dist/`.    |
| `npm run preview`           | Sirve la compilación de producción para revisarla en local.          |
| `npm run typecheck`         | Ejecuta `tsc -b`.                                                    |
| `npm run lint`              | Ejecuta Oxlint.                                                      |
| `npm run test`              | Lanza Vitest una vez.                                                |
| `npm run test:watch`        | Lanza Vitest en modo vigilancia.                                     |
| `npm run format`            | Formatea el repositorio con Prettier.                                |
| `npm run sync:heroes`       | Regenera `src/data/heroes.json` desde el CDN.                        |
| `npm run sync:hero-classes` | Regenera `src/data/hero-classes.json` desde bases de datos públicas. |

## Estructura del proyecto

```
src/
  pages/                          Pantallas de ruta: Dashboard, Roster, Teams, Pets, Equipment, Settings
  components/                     Componentes por dominio: dashboard/, roster/, teams/, pets/, equipment/, heroes/, layout/
  components/ui/                  Primitivas reutilizables (Button, Badge, Dialog, Input, Select, Field, EmptyState, PageHeader…)
  components/roster/hero-detail/  Piezas de la ficha de héroe (escena de facción, selectores, panel de inversión)
  features/                       Lógica de dominio: heroes, gear, artifacts, collections, pets, teams, persistence
  store/                          Store de Zustand (useAppStore)
  types/                          Tipos y enums compartidos
  i18n/                           Configuración y locales (en.ts, es.ts)
  data/                           Catálogos generados (no editar a mano)
  assets/                         Pinturas oficiales de facción para las escenas de héroe
  lib/                            Utilidades compartidas (cn, funciones auxiliares de iconos…)
  index.css                       Tokens y clases de Tailwind (CSS-first)
scripts/                          Scripts de sincronización de los catálogos
docker/                           Configuración de nginx para la imagen
backup/                           Copias reales del formato antiguo; se usan para probar compatibilidad
.github/workflows/                CI y despliegue a GitHub Pages
public/                           Ficheros estáticos que se sirven tal cual
```

## Datos y catálogos

El catálogo de héroes se genera desde `https://raw.githubusercontent.com/afk-mine/cdn/main/unit.json` y se guarda en `src/data/heroes.json`. Los iconos de héroe se cargan en tiempo de ejecución desde el CDN de `afk-mine`, y el arte de artefactos, colecciones y mascotas desde `https://www.afk.global`.

Dentro de `heroes.json`, el campo `class` es el **tipo** de héroe (Warrior/Ranger/Mage), mientras que la clase real (Warrior/Tank/Ranger/Mage/Support) vive en `src/data/hero-classes.json`, generado con `npm run sync:hero-classes` desde `https://www.afk.global/afk-arena/characters` y con `https://gacha-data.com/afk-arena/characters/` como alternativa. Usa `entry.type` para lógica basada en tipo (por ejemplo, el arte del equipo) y `entry.class` para restricciones de clase (artefactos y colecciones).

Los catálogos de artefactos y colecciones se mantienen a mano en `src/features/artifacts/artifacts.ts` y `src/features/collections/collections.ts`; el de las 30 mascotas, en `src/features/pets/pets.ts`.

Los dos ficheros de `src/data/` son generados: no los edites a mano, vuelve a lanzar el script de sincronización correspondiente.

## Persistencia, exportación e importación

### Dónde se guarda

- Datos de la aplicación: clave `afk-astral-codex:data` de `localStorage`.
- Idioma elegido: clave `afk-astral-codex:lang`.
- Se persiste la versión 1 del esquema con `schemaVersion`, `profile`, `heroes`, `pets` y `teams`.

Internamente los héroes siempre se indexan por `heroId` y las mascotas por `petId`; nunca por nombre visible.

### Formato de exportación

El JSON exportado está pensado para leerse a mano, no para reimportarse a ciegas:

- `heroes` es un objeto indexado por nombre visible, sin `heroId`.
- Los vínculos entre héroes se exportan como `linkedHero` (nombre visible).
- Las posiciones de equipo se exportan como `hero` (nombre visible).
- `pets` es un objeto indexado por nombre de mascota, sin `petId`.
- La mascota asignada a un equipo se exporta como `pet` (nombre).
- No aparece ningún ID de héroe ni de mascota en el JSON.

Al importar se aceptan ambos formatos: primero se prueba el de copias antiguas indexado por ID y, si no encaja, el legible, que resuelve nombres a IDs y falla con un error si el nombre no existe. Las copias anteriores a las mascotas no traen `pets` ni `pet` en los equipos; ambas cosas son opcionales.

### Añadir un campo persistido

Si tocas `HeroProgress`, `PetProgress` o `Profile`, actualiza los cuatro puntos siguientes o el campo se perderá al importar:

1. `src/types/index.ts`.
2. El valor por defecto en `src/features/persistence/defaults.ts`.
3. El esquema Zod correspondiente en `src/features/persistence/exportSchema.ts` (los imports funcionan en modo _strip_, así que lo que no esté en el esquema se descarta en silencio).
4. Las pruebas de ida y vuelta.

Para campos opcionales heredados usa `z.boolean().optional()` y similares, no `.default(...)`, para no reescribir copias antiguas.

## Idiomas

- `src/i18n/locales/en.ts` es la fuente de verdad y exporta `TranslationSchema`.
- `es.ts` debe satisfacer ese esquema y `locales.test.ts` comprueba que haya paridad de claves y que ninguna traducción esté vacía.
- Los términos del juego (nombres de ascensión, SI, furniture, engraving, equipo…) se mantienen en inglés también en español.

## Calidad y pruebas

Antes de dar por terminado un cambio:

```bash
npm run typecheck
npm run lint
npm run test
```

Las pruebas están junto al código (`*.test.ts(x)`) y usan Vitest con Testing Library sobre jsdom. Se prefieren consultas accesibles (`getByRole`, `getByLabelText`) y, en las pruebas del store, se reinicia el estado persistido entre casos. Los cambios de interfaz conviene comprobarlos también en el navegador contra el servidor de desarrollo.

## Despliegue

### GitHub Pages

El sitio publicado está en <https://reximon.github.io/afkarena-app/>. El flujo de trabajo `.github/workflows/deploy.yml` se ejecuta en cada push a `master`: comprueba tipos, pasa el lint, lanza las pruebas, construye la app y publica `dist` como artefacto de Pages.

La primera vez hay que activar Pages en **Settings → Pages** eligiendo **GitHub Actions** como origen; después todo es automático. El flujo de trabajo toma la ruta base de Vite a partir del nombre del repositorio, así que no hay rutas que ajustar al publicar.

Las rutas usan `HashRouter`, de modo que cualquier alojamiento estático funciona sin reescrituras en el servidor.

### Docker

```bash
docker compose up --build
```

La app queda en <http://localhost:8080>. La imagen compila los estáticos y los sirve con nginx. Si la alojas bajo un subdirectorio, pasa `VITE_BASE_PATH` como argumento de compilación (`docker build --build-arg VITE_BASE_PATH=/mi-subpath/ .`); el `docker-compose.yml` lo deja en `/` por defecto.

## Documentación adicional

- [DESIGN.md](DESIGN.md): lenguaje visual, tipografía, superficies y especificación de cabecera y navegación.
- [AGENTS.md](AGENTS.md): guía de convenciones del proyecto (estado, persistencia, i18n, formato de exportación y pruebas) pensada para quien —o lo que— vaya a tocar el código.

## Aviso legal

Proyecto hecho por aficionados. No está afiliado a Lilith Games ni cuenta con su respaldo. AFK Arena y sus recursos gráficos pertenecen a sus respectivos propietarios.

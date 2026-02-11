# Plan de Implementación — Flujo de Creación de Contenido Diario

## Resumen
Transformar la plataforma en un **orquestador de contenido** que sincroniza las herramientas gratuitas que ya usa el usuario (Grok Imagine, CapCut, Canva) con generación de audio vía ElevenLabs API y publicación directa a redes sociales.

---

## Módulo 1: Catálogo de Templates Favoritos
**Qué es**: Biblioteca personal de templates de CapCut/Canva que el usuario guarda como referencia.

**Funcionalidad**:
- Crear/editar/eliminar templates de referencia
- Cada template almacena:
  - Nombre del template
  - Fuente (CapCut / Canva)
  - Screenshot o preview (imagen subida)
  - Cantidad de cortes
  - Estructura narrativa (ej: Hook → Problema → Solución → Demo → CTA)
  - Si lleva voz o no
  - Link directo al template en CapCut/Canva
- Categorías: Reels, Vlog Reels, Carousel, Storytelling, etc.
- Agregar nuevos templates en cualquier momento

**Componentes**:
- `TemplateCatalog.tsx` — Vista principal del catálogo con grid de templates por categoría
- `TemplateForm.tsx` — Formulario para crear/editar un template de referencia
- API route para CRUD de templates (almacenamiento local/JSON por ahora)

---

## Módulo 2: Pipeline de Generación por Cortes (el corazón)
**Qué es**: Flujo paso a paso que genera todos los prompts y assets por cada corte del video.

### Paso 1 — Configuración
- Seleccionar producto
- Seleccionar template del catálogo (auto-carga cantidad de cortes y estructura)
- O modo manual: definir cantidad de cortes sin template

### Paso 2 — AI Genera Estructura + Prompts
- Con OpenAI (que ya está integrado), la AI:
  - Propone tipo de video si el usuario no lo sabe (educativo, demostrativo, comparativo, etc.)
  - Genera por CADA corte:
    - **Prompt de imagen** (para Grok Imagine)
    - **Prompt de animación** (para animar la imagen en Grok)
    - **Speech text** (para ElevenLabs, toggle on/off)
- El usuario puede editar cualquier prompt antes de continuar

### Paso 3 — Generación de Assets (por corte)
Vista por corte con:
```
Corte N — [Nombre del corte según estructura]

📝 Prompt imagen: "..."
   [Copiar] [Abrir Grok Imagine ↗]
   [Subir imagen] → preview de la imagen subida

🎬 Prompt animación: "..."
   [Copiar] [Abrir Grok Imagine ↗]
   [Subir video] → preview del video subido

🗣️ Speech: "..."
   [Generar Audio ▶️] → genera directo con ElevenLabs API
   [Sin voz]

Progress: ✅ Imagen  ✅ Video  ⬜ Audio
```

### Paso 4 — Todos los cortes listos
- Vista resumen de todos los assets
- Descarga individual por asset
- Link directo al template en CapCut/Canva para ir a editar
- Tracking visual de progreso

**Componentes**:
- `ContentPipeline.tsx` — Componente principal del wizard/pipeline
- `PipelineConfig.tsx` — Paso 1: selección de producto y template
- `PipelinePrompts.tsx` — Paso 2: vista de prompts generados por AI, editables
- `PipelineCutCard.tsx` — Card individual por corte con upload, copiar, generar audio
- `PipelineSummary.tsx` — Vista resumen final con todos los assets
- API route `/api/generate-prompts` — Genera prompts por corte usando OpenAI
- API route `/api/generate-speech` — Genera audio con ElevenLabs API

---

## Módulo 3: Divisor de Video
**Qué es**: Herramienta para dividir un video largo (ej: 8 seg de Grok) en clips cortos.

**Funcionalidad**:
- Subir un video
- Elegir cantidad de partes (2, 3, 4, o custom)
- Preview de cada parte resultante
- Seleccionar qué partes conservar
- Descargar partes individuales

**Implementación**: FFmpeg del lado del servidor (gratis, sin API de pago).

**Componentes**:
- `VideoSplitter.tsx` — Interfaz de división de video
- API route `/api/video/split` — Procesa la división con FFmpeg

---

## Módulo 4: Sistema de Captions Fijos por Producto
**Qué es**: Captions pre-escritos por producto, adaptados a cada red social.

**Funcionalidad**:
- Un caption por producto por red social
- Caracteres correctos por plataforma:
  - Instagram: hasta 2,200 chars
  - TikTok: hasta 300 chars (4,000 con update)
  - YouTube: hasta 5,000 chars
  - Facebook: hasta 63,206 chars
- Hashtags guardados por red social
- Fijos: se configuran una vez, se usan siempre
- Editable en cualquier momento

**Componentes**:
- `CaptionManager.tsx` — CRUD de captions por producto y red social
- `CaptionPreview.tsx` — Preview del caption con contador de caracteres
- Almacenamiento junto con los datos del producto

---

## Módulo 5: Publicador Multi-Plataforma
**Qué es**: Subir video final y publicar en todas las redes con un click.

**Flujo**:
1. Subir video final (el editado de CapCut/Canva)
2. Seleccionar producto → caption se carga automáticamente
3. Preview por red social
4. Botón "PUBLICAR EN TODAS"
5. Se envía a todas las redes configuradas

**Componentes**:
- `Publisher.tsx` — Interfaz de publicación
- `PublishPreview.tsx` — Preview por red social antes de enviar
- API routes por red social (usar APIs oficiales de cada plataforma)

**Nota**: Las APIs de publicación de redes sociales requieren autenticación OAuth por plataforma. Se implementará progresivamente.

---

## Orden de Implementación (prioridad)

### Fase 1 — Base del flujo
1. Módulo 1: Catálogo de Templates
2. Módulo 4: Sistema de Captions

### Fase 2 — El corazón
3. Módulo 2: Pipeline de Generación por Cortes (prompts + ElevenLabs + uploads)

### Fase 3 — Herramientas extra
4. Módulo 3: Divisor de Video

### Fase 4 — Publicación
5. Módulo 5: Publicador Multi-Plataforma

---

## Tecnologías a usar
- **OpenAI API** (ya integrada) — Generación de prompts
- **ElevenLabs API** (ya tiene la key) — Generación de audio
- **FFmpeg** — División de video (server-side)
- **Next.js API Routes** — Backend
- **React + Tailwind** — Frontend (consistente con lo existente)
- **Almacenamiento local/JSON** — Templates, captions, proyectos (escalable a DB después)

## Estructura de archivos nuevos
```
src/
├── app/
│   ├── api/
│   │   ├── templates/route.ts          — CRUD templates favoritos
│   │   ├── captions/route.ts           — CRUD captions por producto
│   │   ├── generate-prompts/route.ts   — AI genera prompts por corte
│   │   ├── generate-speech/route.ts    — ElevenLabs audio generation
│   │   ├── video/split/route.ts        — FFmpeg video splitter
│   │   └── publish/route.ts            — Multi-platform publishing
│   └── pipeline/
│       └── page.tsx                    — Página del pipeline
├── components/
│   ├── pipeline/
│   │   ├── ContentPipeline.tsx
│   │   ├── PipelineConfig.tsx
│   │   ├── PipelinePrompts.tsx
│   │   ├── PipelineCutCard.tsx
│   │   └── PipelineSummary.tsx
│   ├── templates/
│   │   ├── TemplateCatalog.tsx
│   │   └── TemplateForm.tsx
│   ├── captions/
│   │   ├── CaptionManager.tsx
│   │   └── CaptionPreview.tsx
│   ├── publisher/
│   │   ├── Publisher.tsx
│   │   └── PublishPreview.tsx
│   └── video/
│       └── VideoSplitter.tsx
├── data/                               — Almacenamiento local JSON
│   ├── templates.json
│   └── captions.json
└── types/
    └── pipeline.ts                     — Tipos para el nuevo flujo
```

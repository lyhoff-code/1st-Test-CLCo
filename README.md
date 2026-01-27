# Shopify Content Generator

Genera contenido de video automaticamente para tus productos de Shopify con IA.

## Caracteristicas

- **Seleccion de Productos**: Conecta tu tienda Shopify o usa productos de demo
- **Tipos de Contenido**: Reel, Story o Post
- **Tonos**: Divertido, Profesional o Educativo
- **Generacion de Script con IA**: Usa OpenAI GPT-4 para crear guiones atractivos
- **Text-to-Speech**: Voz automatica con ElevenLabs o el navegador
- **Preview en Tiempo Real**: Visualiza tu contenido antes de exportar

## Instalacion

```bash
# Instalar dependencias
npm install

# Copiar archivo de configuracion
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## Configuracion

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Shopify (requerido para productos reales)
SHOPIFY_STORE_URL=tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx

# OpenAI (requerido para generacion de scripts con IA)
OPENAI_API_KEY=sk-xxxxx

# ElevenLabs (opcional - para voces premium)
ELEVENLABS_API_KEY=xxxxx
```

### Configurar Shopify

1. Ve a tu admin de Shopify
2. Settings > Apps and sales channels > Develop apps
3. Crea una nueva app
4. En "API credentials", crea un Storefront access token
5. Copia el token a tu `.env.local`

### Configurar OpenAI

1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una API key
3. Copia la key a tu `.env.local`

### Configurar ElevenLabs (Opcional)

1. Ve a [elevenlabs.io](https://elevenlabs.io)
2. Crea una cuenta y obtiene tu API key
3. Copia la key a tu `.env.local`

## Uso

1. **Selecciona un producto** de tu tienda o usa uno de demo
2. **Elige el tipo de contenido**: Reel, Story o Post
3. **Selecciona el tono**: Divertido, Profesional o Educativo
4. **Haz clic en "Generar Contenido"**
5. **Previsualiza** el resultado y descarga

## Modo Demo

Si no configuras las credenciales de Shopify, la app mostrara productos de demo para que puedas probar todas las funcionalidades.

## Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estatico
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **OpenAI API** - Generacion de scripts
- **ElevenLabs API** - Text-to-Speech
- **Shopify Storefront API** - Productos

## Estructura del Proyecto

```
src/
  app/
    api/
      generate-audio/    # API para TTS
      generate-script/   # API para generacion de scripts
      shopify/products/  # API para productos Shopify
    settings/            # Pagina de configuracion
    page.tsx             # Pagina principal
  components/
    ProductSelector      # Selector de productos
    ContentTypeSelector  # Selector tipo contenido
    ToneSelector         # Selector de tono
    GenerationPanel      # Panel de progreso
    VideoPreview         # Preview del video
  types/
    index.ts             # Tipos TypeScript
```

## Licencia

MIT

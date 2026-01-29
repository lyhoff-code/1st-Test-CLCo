export type Language = 'en' | 'es'

export const translations = {
  en: {
    // Header
    aiContentStudio: 'AI Content Studio',
    history: 'History',
    settings: 'Settings',
    aiAssistant: 'AI Assistant',

    // Hero Section
    aiPoweredContentCreation: 'AI-Powered Content Creation',
    createViralContent: 'Create Viral Content',
    forYourProducts: 'for Your Products',
    heroDescription: 'Transform your Shopify products into engaging reels, stories, and posts with AI-powered scripts and voiceovers.',

    // Steps
    selectYourProduct: 'Select Your Product',
    contentType: 'Content Type',
    contentTone: 'Content Tone',
    advancedSettings: 'Advanced Settings',
    categories: 'categories',

    // Content Types
    reel: 'Reel',
    story: 'Story',
    post: 'Post',
    storytelling: 'Storytelling',
    reelDesc: '15-60s vertical video',
    storyDesc: '15s disappearing content',
    postDesc: 'Feed image/carousel',
    storytellingDesc: '30s story-driven reel',

    // Tones
    fun: 'Fun',
    professional: 'Professional',
    emotional: 'Emotional',
    urgent: 'Urgent',
    educational: 'Educational',
    funDesc: 'Casual and entertaining',
    professionalDesc: 'Serious and trustworthy',
    emotionalDesc: 'Connect with feelings',
    urgentDesc: 'Create FOMO',
    educationalDesc: 'Inform and teach',

    // Actions
    generateContent: 'Generate Content',
    generating: 'Generating...',
    startStorytellingMode: 'Start Storytelling Mode',
    exitStorytelling: 'Exit Storytelling',
    downloadVideo: 'Download Video',
    copy: 'Copy',
    preview: 'Preview',
    currentSettings: 'Current Settings',

    // Storytelling
    storytellingMode: 'Storytelling Mode',
    createStoryDrivenReel: 'Create a story-driven 30-second reel',
    storytellingModeSelected: 'Storytelling Mode Selected',
    storytellingDescription: 'Create a 6-scene story: Hook → Problem → Agitation → Solution → Result → CTA. Each scene gets its own script, voice, and AI-generated image.',

    // Scenes
    hook: 'Hook',
    problem: 'Problem',
    agitation: 'Agitation',
    solution: 'Solution',
    result: 'Result',
    cta: 'CTA',

    // Settings Labels
    voice: 'Voice',
    platform: 'Platform',
    style: 'Style',
    music: 'Music',
    duration: 'Duration',
    quality: 'Quality',

    // Product Selector
    searchProducts: 'Search products...',
    noProductsFound: 'No products found',
    selectAProduct: 'Select a product to see the preview',

    // History
    contentHistory: 'Content History',
    clearAll: 'Clear All',
    noHistory: 'No history yet',
    loadFromHistory: 'Loaded from history',

    // Assistant
    contentAssistant: 'Content Assistant',
    poweredByGemini: 'Powered by Gemini AI',
    askMeAnything: 'Ask me anything about content...',
    quickActions: 'Quick actions:',
    contentIdeas: 'Content Ideas',
    trendingHooks: 'Trending Hooks',
    hashtagStrategy: 'Hashtag Strategy',
    targetAudience: 'Target Audience',
    viralTips: 'Viral Tips',
    improveScript: 'Improve Script',
    needHelp: 'Need help? Press',

    // Footer
    madeWith: 'Made with',
    aiPoweredCreation: 'AI-Powered Content Creation',

    // Generation States
    analyzingProduct: 'Analyzing product...',
    creatingVoiceover: 'Creating voiceover...',
    composingVideo: 'Composing video...',
    contentReady: 'Content ready!',
    generatedScript: 'Generated Script',

    // Errors
    errorGeneratingScript: 'Error generating script',
    errorGeneratingAudio: 'Error generating audio',
    unknownError: 'Unknown error',
    troubleConnecting: "I'm having trouble connecting. Please check your internet connection and try again.",

    // Settings Page
    apiConfiguration: 'API Configuration',
    geminiApiKey: 'Gemini API Key',
    elevenLabsApiKey: 'ElevenLabs API Key',
    shopifyConfig: 'Shopify Configuration',
    storeDomain: 'Store Domain',
    accessToken: 'Access Token',
    saveSettings: 'Save Settings',

    // Assistant Welcome
    assistantWelcome: `Hey! I'm your Content Assistant. I'm here to help you create amazing social media content. Ask me anything about:

• Content ideas & strategies
• Trending hooks and formats
• Hashtag optimization
• Target audience insights
• Script improvements
• Viral content tips

What would you like help with today?`,
  },
  es: {
    // Header
    aiContentStudio: 'Estudio de Contenido IA',
    history: 'Historial',
    settings: 'Ajustes',
    aiAssistant: 'Asistente IA',

    // Hero Section
    aiPoweredContentCreation: 'Creación de Contenido con IA',
    createViralContent: 'Crea Contenido Viral',
    forYourProducts: 'para Tus Productos',
    heroDescription: 'Transforma tus productos de Shopify en reels, stories y posts atractivos con scripts y voces generados por IA.',

    // Steps
    selectYourProduct: 'Selecciona Tu Producto',
    contentType: 'Tipo de Contenido',
    contentTone: 'Tono del Contenido',
    advancedSettings: 'Ajustes Avanzados',
    categories: 'categorías',

    // Content Types
    reel: 'Reel',
    story: 'Story',
    post: 'Post',
    storytelling: 'Storytelling',
    reelDesc: 'Video vertical de 15-60s',
    storyDesc: 'Contenido temporal de 15s',
    postDesc: 'Imagen/carrusel para feed',
    storytellingDesc: 'Reel narrativo de 30s',

    // Tones
    fun: 'Divertido',
    professional: 'Profesional',
    emotional: 'Emocional',
    urgent: 'Urgente',
    educational: 'Educativo',
    funDesc: 'Casual y entretenido',
    professionalDesc: 'Serio y confiable',
    emotionalDesc: 'Conecta con sentimientos',
    urgentDesc: 'Crea urgencia (FOMO)',
    educationalDesc: 'Informa y enseña',

    // Actions
    generateContent: 'Generar Contenido',
    generating: 'Generando...',
    startStorytellingMode: 'Iniciar Modo Storytelling',
    exitStorytelling: 'Salir de Storytelling',
    downloadVideo: 'Descargar Video',
    copy: 'Copiar',
    preview: 'Vista Previa',
    currentSettings: 'Configuración Actual',

    // Storytelling
    storytellingMode: 'Modo Storytelling',
    createStoryDrivenReel: 'Crea un reel narrativo de 30 segundos',
    storytellingModeSelected: 'Modo Storytelling Seleccionado',
    storytellingDescription: 'Crea una historia de 6 escenas: Gancho → Problema → Agitación → Solución → Resultado → CTA. Cada escena tiene su propio script, voz e imagen generada por IA.',

    // Scenes
    hook: 'Gancho',
    problem: 'Problema',
    agitation: 'Agitación',
    solution: 'Solución',
    result: 'Resultado',
    cta: 'CTA',

    // Settings Labels
    voice: 'Voz',
    platform: 'Plataforma',
    style: 'Estilo',
    music: 'Música',
    duration: 'Duración',
    quality: 'Calidad',

    // Product Selector
    searchProducts: 'Buscar productos...',
    noProductsFound: 'No se encontraron productos',
    selectAProduct: 'Selecciona un producto para ver la vista previa',

    // History
    contentHistory: 'Historial de Contenido',
    clearAll: 'Borrar Todo',
    noHistory: 'Sin historial aún',
    loadFromHistory: 'Cargado del historial',

    // Assistant
    contentAssistant: 'Asistente de Contenido',
    poweredByGemini: 'Potenciado por Gemini AI',
    askMeAnything: 'Pregúntame cualquier cosa sobre contenido...',
    quickActions: 'Acciones rápidas:',
    contentIdeas: 'Ideas de Contenido',
    trendingHooks: 'Ganchos Trending',
    hashtagStrategy: 'Estrategia de Hashtags',
    targetAudience: 'Audiencia Objetivo',
    viralTips: 'Tips Virales',
    improveScript: 'Mejorar Script',
    needHelp: '¿Necesitas ayuda? Presiona',

    // Footer
    madeWith: 'Hecho con',
    aiPoweredCreation: 'Creación de Contenido con IA',

    // Generation States
    analyzingProduct: 'Analizando producto...',
    creatingVoiceover: 'Creando voz...',
    composingVideo: 'Componiendo video...',
    contentReady: '¡Contenido listo!',
    generatedScript: 'Script Generado',

    // Errors
    errorGeneratingScript: 'Error al generar script',
    errorGeneratingAudio: 'Error al generar audio',
    unknownError: 'Error desconocido',
    troubleConnecting: 'Tengo problemas para conectar. Por favor verifica tu conexión a internet e intenta de nuevo.',

    // Settings Page
    apiConfiguration: 'Configuración de API',
    geminiApiKey: 'Clave API de Gemini',
    elevenLabsApiKey: 'Clave API de ElevenLabs',
    shopifyConfig: 'Configuración de Shopify',
    storeDomain: 'Dominio de la Tienda',
    accessToken: 'Token de Acceso',
    saveSettings: 'Guardar Ajustes',

    // Assistant Welcome
    assistantWelcome: `¡Hola! Soy tu Asistente de Contenido. Estoy aquí para ayudarte a crear contenido increíble para redes sociales. Pregúntame sobre:

• Ideas y estrategias de contenido
• Ganchos y formatos trending
• Optimización de hashtags
• Análisis de audiencia objetivo
• Mejoras de scripts
• Tips para contenido viral

¿Con qué te puedo ayudar hoy?`,
  },
}

export type TranslationKey = keyof typeof translations.en

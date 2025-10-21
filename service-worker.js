const APP_VERSION = '4.0.6';
const CACHE_NAME = `pizzaria-solnascente-${APP_VERSION}`;
const urlsToCache = [
  '/',
  '/index.html', // Adicionado para garantir que a página principal seja sempre cacheada
  '/config.js',
  'https://cdn.tailwindcss.com', // Tailwind CSS CDN
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/qrcode.min.js', // URL corrigida

  // Adicione aqui os ícones do PWA se desejar que funcionem offline
  // '/icons/icon-192x192.png',
  // '/icons/icon-512x512.png'
];

// Evento de instalação: abre o cache e adiciona os arquivos principais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('[PWA] Cache aberto e iniciando cache de recursos:', CACHE_NAME);
        const promises = urlsToCache.map(async (url) => {
          try {
            // Usar fetch() e cache.put() manualmente para lidar com respostas opacas de CDNs
            const request = new Request(url, { mode: 'no-cors' });
            const response = await fetch(request);
            await cache.put(request, response);
          } catch (error) {
            console.error(`[PWA] Falha ao fazer cache de ${url}:`, error);
          }
        });
        await Promise.all(promises);
        console.log('[PWA] Todos os recursos foram cacheados com sucesso.');
      })
  );
});

// Evento de ativação: limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[PWA] Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de push: recebe a notificação do servidor e a exibe
self.addEventListener('push', event => {
  console.log('[PWA] Notificação Push recebida!');
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('[PWA] Erro ao parsear dados do push:', e);
      data = { title: 'Notificação', body: event.data.text() };
    }
  }

  const title = data.title || 'Seu Pedido';
  const options = {
    body: data.body || 'Temos uma novidade sobre seu pedido.',
    icon: data.icon || '/icons/icon-192x192.png', // Ícone padrão
    badge: data.badge || '/icons/icon-96x96.png' // Ícone para a barra de status (Android)
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Evento de fetch: Estratégia "Network falling back to cache"
// Tenta buscar da rede primeiro para obter os dados mais recentes.
// Se a rede falhar (offline), serve do cache.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Lista de domínios que NÃO devem ser interceptados pelo Service Worker
  const externalAPIs = [
    'viacep.com.br',
    'cepaberto.com',
    'postmon.com.br',
    'supabase.co',
    'googleapis.com',
    'cdn.jsdelivr.net',
    'cdn.tailwindcss.com',
    'via.placeholder.com',
    'placeholder.com'
  ];
  
  // Se a requisição é para uma API externa, não interceptar
  const isExternalAPI = externalAPIs.some(domain => url.hostname.includes(domain));
  
  if (isExternalAPI) {
    // Deixar a requisição passar direto sem cache
    return;
  }
  
  // Para requisições locais, usar estratégia de cache
  event.respondWith(
    fetch(event.request).catch(() => {
      // Se a requisição de rede falhar, tenta encontrar no cache
      return caches.match(event.request).then(response => {
        if (response) {
          console.log(`[PWA] Servindo do cache: ${event.request.url}`);
          return response;
        }
        // Se não estiver nem na rede nem no cache, pode retornar uma página offline padrão (opcional)
        if (event.request.mode === 'navigate') {
          // return caches.match('/offline.html'); // Exemplo
        }
      });
    })
  );
});
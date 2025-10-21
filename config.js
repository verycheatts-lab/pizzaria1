/**
 * ====================================================================
 * CONFIGURAÇÃO DO CARDÁPIO SHEETS - V4.0.5 - 02/09/2025 - 10h33
 * ====================================================================
 * 
 * Este arquivo contém todas as configurações principais do sistema,
 * incluindo URLs das planilhas e textos traduzíveis.
 */
// ====================================================================
// URLs DAS PLANILHAS DO GOOGLE SHEETS
// ====================================================================
/**
 * Para alterar as planilhas utilizadas pelo cardápio, modifique as URLs abaixo.
 * Certifique-se de que as planilhas estejam publicadas e acessíveis publicamente.
 * 
 * Como obter a URL correta:
 * 1. Abra sua planilha no Google Sheets
 * 2. Vá em Arquivo > Publicar na web
 * 3. Selecione a aba específica que deseja publicar
 * 4. Escolha o formato CSV
 * 5. Copie a URL gerada
 */

/**
 * ====================================================================
 * 🍕 EXEMPLO PARA PIZZARIA
 * ====================================================================
 * 
 * Para configurar tamanhos de pizza (Brotinho, Média, Grande), você pode usar
 * o sistema de "Preços Múltiplos" na coluna 'preco' da sua planilha de itens.
 * 
 * Formato: Nome do Tamanho:Preço
 * Exemplo na célula da coluna 'preco':
 * Brotinho:25,90/Média:35,90/Grande:45,90
 * 
 * Para bordas recheadas, use a coluna 'classificacao_adicional'.
 * 
 * Formato: #Nome da Variação:radio:Opção1 +Preço/Opção2 +Preço
 * Exemplo na célula da coluna 'classificacao_adicional':
 * #Borda:radio:Sem Borda +0/Catupiry +5,00/Cheddar +6,00
 * 
 * O '#' no início torna a seleção obrigatória.
 */

// URL of the spreadsheet with menu items (tab: Items)
const MENU_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPxNrW67bUVOCnkvGaWVYBje3bjTKvK4lu1-C7tYVCRRQNbQImaf9-aH6jAqdAI495sxOYI4QIhKDP/pub?gid=116771707&single=true&output=csv';

// URL of the spreadsheet with menu categories (tab: Categories)
const CATEGORIES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPxNrW67bUVOCnkvGaWVYBje3bjTKvK4lu1-C7tYVCRRQNbQImaf9-aH6jAqdAI495sxOYI4QIhKDP/pub?gid=271394769&single=true&output=csv';

// URL of the spreadsheet with operating hours (tab: Hours)
const HOURS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPxNrW67bUVOCnkvGaWVYBje3bjTKvK4lu1-C7tYVCRRQNbQImaf9-aH6jAqdAI495sxOYI4QIhKDP/pub?gid=1842804489&single=true&output=csv';

// URL of the spreadsheet with neighborhoods and delivery fees (tab: Bairros) **OPCIONAL**
const NEIGHBORHOODS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPxNrW67bUVOCnkvGaWVYBje3bjTKvK4lu1-C7tYVCRRQNbQImaf9-aH6jAqdAI495sxOYI4QIhKDP/pub?gid=1634629476&single=true&output=csv';

// URL da planilha de cupons de desconto  **OPCIONAL**
const COUPONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPxNrW67bUVOCnkvGaWVYBje3bjTKvK4lu1-C7tYVCRRQNbQImaf9-aH6jAqdAI495sxOYI4QIhKDP/pub?gid=1144201431&single=true&output=csv';

// URL of the spreadsheet with general settings (tab: Config)
const CONFIG_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPxNrW67bUVOCnkvGaWVYBje3bjTKvK4lu1-C7tYVCRRQNbQImaf9-aH6jAqdAI495sxOYI4QIhKDP/pub?gid=0&single=true&output=csv';




// ====================================================================
// CONFIGURAÇÃO DE TIMEZONE
// ====================================================================
/**
 * Configure o timezone do seu estabelecimento.
 * Este timezone será usado para validação de cupons e horários de funcionamento.
 * 
 * TIMEZONES BRASILEIROS DISPONÍVEIS:
 * 
 * 🇧🇷 FUSO HORÁRIO DE BRASÍLIA (UTC-3):
 * - 'America/Sao_Paulo'     → São Paulo, Rio de Janeiro, Minas Gerais, Bahia, 
 *                             Goiás, Distrito Federal, Paraná, Santa Catarina, 
 *                             Rio Grande do Sul, Espírito Santo, Sergipe, Alagoas, 
 *                             Pernambuco, Paraíba, Rio Grande do Norte, Piauí
 * - 'America/Fortaleza'     → Ceará, Maranhão (mesmo fuso de Brasília)
 * 
 * 🇧🇷 FUSO HORÁRIO DO AMAZONAS (UTC-4):
 * - 'America/Manaus'        → Amazonas (exceto alguns municípios), Roraima, 
 *                             Rondônia, Mato Grosso, Mato Grosso do Sul
 * 
 * 🇧🇷 FUSO HORÁRIO DO ACRE (UTC-5):
 * - 'America/Rio_Branco'    → Acre e alguns municípios do oeste do Amazonas
 * 
 * 🇧🇷 FUSO HORÁRIO DE FERNANDO DE NORONHA (UTC-2):
 * - 'America/Noronha'       → Fernando de Noronha e Atol das Rocas
 * 
 * ⚠️  IMPORTANTE: Use exatamente um dos valores acima (com aspas simples)
 * ⚠️  Não modifique a formatação, apenas o valor entre aspas
 */
const TIMEZONE = 'America/Sao_Paulo';


// ====================================================================
// CONFIGURAÇÃO DE PEDIDOS
// ====================================================================
/**
 * ⏱️ JANELA DE CANCELAMENTO (em segundos)
 * 
 * Define por quanto tempo (em segundos) o cliente pode cancelar um pedido
 * após ele ter sido movido para "Em Preparo".
 * 
 * Exemplos:
 * const CANCELLATION_WINDOW_SECONDS = 60;  // 1 minuto
 * const CANCELLATION_WINDOW_SECONDS = 120; // 2 minutos
 * const CANCELLATION_WINDOW_SECONDS = 0;   // Não permite cancelar após entrar em preparo
 */
const CANCELLATION_WINDOW_SECONDS = 60; // Padrão: 60 segundos

// ====================================================================
// CONFIGURAÇÃO DO PRELOADER
// ====================================================================
/**
 * 🎨 PERSONALIZAÇÃO DO PRELOADER
 * 
 * Configure a aparência do preloader que aparece durante o carregamento.
 * 
 * PRELOADER_LOGO_URL:
 * - URL do logotipo a ser exibido no preloader
 * - Tamanho recomendado: máximo 150x150 pixels
 * - Formatos suportados: PNG, JPG, SVG
 * - Deixe vazio ('') para não exibir logo
 * 
 * 📁 SUPORTE A SERVIÇOS DE NUVEM:
 * 
 * 📊 GOOGLE DRIVE:
 * - URL direta: https://drive.google.com/thumbnail?id=SEU_FILE_ID&sz=w300
 * - URL de compartilhamento: https://drive.google.com/file/d/SEU_FILE_ID/view
 * - Ambos os formatos são automaticamente processados
 * 
 * 📊 DROPBOX:
 * - Substitua ?dl=0 por ?raw=1 na URL de compartilhamento
 * - Exemplo: https://dropbox.com/s/abc123/logo.png?raw=1
 * - URLs são automaticamente processadas
 * 
 * 📊 URLs EXTERNAS:
 * - Qualquer URL pública de imagem funciona
 * - Certifique-se de que a imagem seja acessível publicamente
 * 
 * Exemplos:
 * const PRELOADER_LOGO_URL = 'https://meusite.com/logo.png';
 * const PRELOADER_LOGO_URL = 'https://drive.google.com/file/d/1ABC.../view';
 * const PRELOADER_LOGO_URL = 'https://dropbox.com/s/abc/logo.png?dl=0';
 * const PRELOADER_LOGO_URL = ''; // Sem logo
 */
const PRELOADER_LOGO_URL = 'https://drive.google.com/file/d/1UpxbmxxgPissjR06eQE-5qVT9kj20HiF/view?usp=sharing'; // Adicione a URL do seu logo aqui

/**
 * COR DO PRELOADER:
 * - Cor principal usada na barra de progresso e efeitos do preloader
 * - Use formato hexadecimal (#000000) ou nome da cor (red, blue, etc.)
 * - Padrão:#e74c3c (vermelho elegante)
 * 
 * Exemplos:
 * const PRELOADER_COLOR = '#3498db'; // Azul
 * const PRELOADER_COLOR = '#2ecc71'; // Verde
 * const PRELOADER_COLOR = '#9b59b6'; // Roxo 
 */
const PRELOADER_COLOR = '#D92B2B'; // Cor principal do preloader (vermelho pizzaria)




// ====================================================================
// CONFIGURAÇÃO DO SISTEMA DE TRADUÇÃO
// ====================================================================
/**
 * 🌐 SISTEMA DE TRADUÇÃO AUTOMÁTICA
 * 
 * Configure se o sistema de tradução deve estar ativo e quais idiomas
 * estarão disponíveis para os usuários.
 * 
 * TRADUCAO: true/false - Habilita ou desabilita o sistema de tradução
 * LANGS: Array com códigos dos idiomas disponíveis
 *        - O primeiro idioma da lista será o idioma padrão inicial
 *        - Códigos suportados: pt-br, pt, en, es, fr, it, de, ru, ja, ko, zh, ar
 * 
 * Exemplos de configuração:
 * 
 * 🌍 IDIOMAS:
 * - TRADUCAO: true, LANGS: ['pt', 'en', 'es'] → Português PT padrão
 * - LANGS: ['pt-br', 'en', 'es', 'fr'] → Português BR padrão
 * - LANGS: ['en', 'pt', 'es', 'fr'] → Inglês padrão
 * - TRADUCAO: false → Sistema desabilitado
 * 
 * 🌎 BANDEIRAS:
 * - BANDEIRAS: {"es": "spain"} → Espanhol com bandeira da Espanha 🇪🇸
 * - BANDEIRAS: {"es": "mexico"} → Espanhol com bandeira do México 🇲🇽
 * - BANDEIRAS: {"fr": "quebec"} → Francês com bandeira do Quebec 🇨🇦
 * - BANDEIRAS: {"en": "uk"} → Inglês com bandeira do Reino Unido 🇬🇧
 */

// Habilitar/Desabilitar sistema de tradução
const TRADUCAO = false;

// Idiomas disponíveis (primeiro da lista = idioma padrão)
const LANGS = ['pt', 'en', 'es', 'fr'];

// Mapeamento de bandeiras (opcional - se não definido, usa bandeira padrão)
const BANDEIRAS = {   
    "pt": "brazil",      // 🇧🇷 Português → Brasil
    "en": "usa",         // 🇺🇸 Inglês → EUA
    "es": "",       // 🇪🇸 Espanhol → Espanha
    "fr": ""       // 🇫🇷 Francês → França
}





// ====================================================================
// CONFIGURAÇÃO DE DEBUG E LOGS
// ====================================================================
/**
 * 🐛 SISTEMA DE DEBUG CONDICIONAL
 * 
 * Controla se os console.log devem ser exibidos ou não.
 * 
 * 🟢 DESENVOLVIMENTO (true):
 * - Todos os logs são exibidos
 * - Facilita debug e desenvolvimento
 * - Pode impactar performance
 * 
 * 🔴 PRODUÇÃO (false):
 * - Logs são desabilitados
 * - Performance otimizada
 * - Experiência do usuário melhorada
 * 
 * ⚠️ IMPORTANTE: Defina como 'false' antes de publicar em produção!
 */
const DEBUG_MODE = false; // Mude para 'false' em produção

/**
 * 🎯 NÍVEIS DE LOG DISPONÍVEIS:
 * 
 * - 'error'   → Apenas erros críticos
 * - 'warn'    → Erros + avisos importantes  
 * - 'info'    → Erros + avisos + informações gerais
 * - 'debug'   → Todos os logs (desenvolvimento)
 * 
 * Recomendações:
 * - Desenvolvimento: 'debug'
 * - Teste: 'info' 
 * - Produção: 'error'
 */
const LOG_LEVEL = 'debug'; // Ajuste conforme necessário

/**
 * 🚀 FUNÇÕES DE LOG OTIMIZADAS
 * 
 * Use estas funções em vez de console.log direto:
 * - debugLog()  → Para logs de desenvolvimento
 * - infoLog()   → Para informações importantes
 * - warnLog()   → Para avisos
 * - errorLog()  → Para erros (sempre exibidos)
 */

// Função para verificar se deve logar baseado no nível
function shouldLog(level) {
    if (!DEBUG_MODE) return level === 'error';
    
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return levels[level] <= levels[LOG_LEVEL];
}

// Funções de log otimizadas
function debugLog(...args) {
    if (shouldLog('debug')) console.log('🐛', ...args);
}

function infoLog(...args) {
    if (shouldLog('info')) console.log('ℹ️', ...args);
}

function warnLog(...args) {
    if (shouldLog('warn')) console.warn('⚠️', ...args);
}

function errorLog(...args) {
    if (shouldLog('error')) console.error('❌', ...args);
}

// Função para logs de performance
function perfLog(label, fn) {
    if (!shouldLog('debug')) return fn();
    
    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
}

// Função para logs de grupos (para organizar logs relacionados)
function groupLog(label, fn) {
    if (!shouldLog('debug')) return fn();
    
    console.group(label);
    const result = fn();
    console.groupEnd();
    return result;
}

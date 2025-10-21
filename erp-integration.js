// ====================================================================
// GOOGLE SHEETS API - INTEGRAÇÃO COMPLETA (BASEADO NO ERP)
// ====================================================================

// Configurações da API do Google
// IMPORTANTE: Configure as variáveis de ambiente no arquivo env-config.js
console.log('🔍 Verificando variáveis de ambiente:', window.ENV);
const CLIENT_ID = window.ENV?.GOOGLE_CLIENT_ID || '';
const API_KEY = window.ENV?.GOOGLE_API_KEY || '';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const SPREADSHEET_ID = window.ENV?.GOOGLE_SPREADSHEET_ID || '';

console.log('🔑 Credenciais carregadas:', {
    CLIENT_ID: CLIENT_ID ? '✅ Presente' : '❌ Ausente',
    API_KEY: API_KEY ? '✅ Presente' : '❌ Ausente',
    SPREADSHEET_ID: SPREADSHEET_ID ? '✅ Presente' : '❌ Ausente'
});

let tokenClient;
let gapiInited = false;
let gisInited = false;
let sheets = [];
let activeSheetName = '';

// ====================================================================
// INICIALIZAÇÃO DA API
// ====================================================================

// Carrega a biblioteca GAPI
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    console.log('✅ Google API inicializada');
    // Tenta restaurar a sessão se o GIS também já estiver pronto
    if (gisInited) await restoreSession();
}

// Carrega o Google Identity Services
async function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            // Salva o token e a data de expiração no localStorage
            const expiresIn = resp.expires_in;
            const tokenData = { 
                token: resp.access_token, 
                expiresAt: Date.now() + expiresIn * 1000 
            };
            localStorage.setItem('google_auth_token', JSON.stringify(tokenData));

            console.log('✅ Autenticado com sucesso!');
            showToast('✅ Conectado ao Google Sheets!', 'success');
            
            // Atualiza UI dos botões
            updateAuthButtons(true);
            if (typeof updateERPAuthButtons === 'function') {
                updateERPAuthButtons(true);
            }
            
            // Carrega a planilha e suas abas
            await loadSpreadsheetAndSheets();
            
            // Carrega ERP se estiver na view ERP
            if (typeof loadERPSpreadsheet === 'function') {
                await loadERPSpreadsheet();
            }
        },
    });
    gisInited = true;
    console.log('✅ Google Identity Services inicializado');
    // Tenta restaurar a sessão se o GAPI também já estiver pronto
    if (gapiInited) await restoreSession();
}

// ====================================================================
// GERENCIAMENTO DE AUTENTICAÇÃO
// ====================================================================

function handleAuthClick() {
    // Verifica se as APIs estão inicializadas
    if (!gapiInited || !gisInited) {
        showToast('⏳ Aguarde, as APIs do Google ainda estão carregando...', 'warning');
        console.warn('APIs não inicializadas. gapiInited:', gapiInited, 'gisInited:', gisInited);
        return;
    }
    
    if (!tokenClient) {
        showToast('❌ Erro: tokenClient não inicializado', 'error');
        console.error('tokenClient está undefined');
        return;
    }
    
    // Solicita o token de acesso
    tokenClient.requestAccessToken({prompt: 'consent'});
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken('');
            localStorage.removeItem('google_auth_token');
            window.sessionRestored = false;
            
            showToast('Desconectado do Google Sheets', 'info');
            console.log('✅ Desconectado');
            
            // Atualiza UI dos botões
            updateAuthButtons(false);
            if (typeof updateERPAuthButtons === 'function') {
                updateERPAuthButtons(false);
            }
            
            // Limpa os dados
            if (typeof erpData !== 'undefined') {
                erpData.items = [];
                erpData.categories = [];
                erpData.hours = [];
                erpData.neighborhoods = [];
                
                // Limpa as tabelas
                if (typeof renderItemsTable === 'function') renderItemsTable();
                if (typeof renderCategoriesGrid === 'function') renderCategoriesGrid();
                if (typeof renderHoursTable === 'function') renderHoursTable();
                if (typeof renderNeighborhoodsTable === 'function') renderNeighborhoodsTable();
            }
        });
    }
}

// Função para restaurar a sessão do usuário
async function restoreSession() {
    // Garante que a função só execute uma vez
    if (window.sessionRestored) return;

    const tokenDataString = localStorage.getItem('google_auth_token');
    if (!tokenDataString) {
        window.sessionRestored = true;
        return; // Nenhum token salvo
    }

    const tokenData = JSON.parse(tokenDataString);

    // Verifica se o token expirou
    if (Date.now() >= tokenData.expiresAt) {
        window.sessionRestored = true;
        localStorage.removeItem('google_auth_token');
        console.log('⚠️ Token expirado, faça login novamente');
        return;
    }

    // Se o token for válido, configura o GAPI
    window.sessionRestored = true;
    gapi.client.setToken({ access_token: tokenData.token });
    
    console.log('✅ Sessão restaurada! Carregando dados...');
    showToast('✅ Sessão restaurada! Carregando dados...', 'info', 2000);
    
    // Atualiza UI dos botões
    updateAuthButtons(true);
    if (typeof updateERPAuthButtons === 'function') {
        updateERPAuthButtons(true);
    }
    
    // Carrega a planilha e suas abas
    await loadSpreadsheetAndSheets();
    
    // Carrega ERP se estiver na view ERP
    if (typeof loadERPSpreadsheet === 'function') {
        await loadERPSpreadsheet();
    }
}

// Atualiza a visibilidade dos botões de autenticação
function updateAuthButtons(isConnected) {
    const connectBtn = document.getElementById('connect-google-btn');
    const disconnectBtn = document.getElementById('disconnect-google-btn');
    
    if (connectBtn && disconnectBtn) {
        if (isConnected) {
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-flex';
        } else {
            connectBtn.style.display = 'inline-flex';
            disconnectBtn.style.display = 'none';
        }
    }
}

// ====================================================================
// CARREGAMENTO DA PLANILHA E ABAS
// ====================================================================

// Carrega a planilha e suas abas
async function loadSpreadsheetAndSheets() {
    try {
        console.log('🔄 Carregando planilha e abas...');
        showToast('Carregando planilha...', 'info', 2000);
        
        const response = await gapi.client.sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        
        sheets = response.result.sheets;
        
        if (!sheets || sheets.length === 0) {
            showToast('Nenhuma aba encontrada nesta planilha.', 'error');
            return;
        }
        
        console.log('✅ Planilha carregada!', sheets.length, 'abas encontradas');
        console.log('📋 Abas:', sheets.map(s => s.properties.title));
        
        // Carrega dados de todas as abas automaticamente
        await loadAllSheets();
        
        showToast('✅ Todas as abas carregadas com sucesso!', 'success');
        
    } catch (err) {
        console.error('❌ Erro ao carregar a planilha:', err);
        showToast('Erro ao carregar planilha: ' + (err.result?.error?.message || err.message), 'error');
    }
}

// Carrega dados de todas as abas
async function loadAllSheets() {
    try {
        console.log('🔄 Carregando dados de todas as abas...');
        
        // Mapeia os nomes das abas para as funções de carregamento
        const sheetLoaders = {
            'Itens': loadItemsFromSheet,
            'itens': loadItemsFromSheet,
            'Categorias': loadCategoriesFromSheet,
            'categorias': loadCategoriesFromSheet,
            'Horários': loadHoursFromSheet,
            'horarios': loadHoursFromSheet,
            'Horarios': loadHoursFromSheet,
            'Bairros': loadNeighborhoodsFromSheet,
            'bairros': loadNeighborhoodsFromSheet
        };
        
        // Carrega cada aba encontrada
        const loadPromises = sheets.map(async (sheet) => {
            const sheetName = sheet.properties.title;
            const loader = sheetLoaders[sheetName];
            
            if (loader) {
                console.log(`📄 Carregando aba: ${sheetName}`);
                await loader(sheetName);
            } else {
                console.log(`⚠️ Aba ignorada: ${sheetName}`);
            }
        });
        
        await Promise.all(loadPromises);
        
        console.log('✅ Todas as abas foram carregadas!');
        
    } catch (err) {
        console.error('❌ Erro ao carregar abas:', err);
        showToast('Erro ao carregar dados: ' + err.message, 'error');
    }
}

// ====================================================================
// CARREGAMENTO DE DADOS POR ABA
// ====================================================================

// Carrega dados da aba Itens
async function loadItemsFromSheet(sheetName) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${sheetName}'!A:Z`,
        });

        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            console.log('⚠️ Nenhum dado encontrado na aba Itens.');
            return;
        }

        const headers = rows[0];
        console.log('📋 Headers Itens:', headers);

        // Mapear dados
        erpData.items = rows.slice(1).map((row, index) => {
            const item = {
                id: row[0] || index + 1,
                name: row[1] || '',
                category: row[2] || '',
                description: row[3] || '',
                price: row[4] || '',
                status: row[5] || 'ativo',
                image: ''
            };
            
            // Valida se é uma URL válida antes de usar como imagem
            if (row[7] && (row[7].startsWith('http://') || row[7].startsWith('https://'))) {
                item.image = row[7];
            }
            
            return item;
        });

        console.log('✅ Itens carregados:', erpData.items.length);
        if (typeof renderItemsTable === 'function') renderItemsTable();
        if (typeof loadCategoryFilter === 'function') loadCategoryFilter();
        
    } catch (error) {
        console.error('❌ Erro ao carregar itens:', error);
        throw error;
    }
}

// Carrega dados da aba Categorias
async function loadCategoriesFromSheet(sheetName) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${sheetName}'!A:Z`,
        });

        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            console.log('⚠️ Nenhum dado encontrado na aba Categorias.');
            return;
        }

        const headers = rows[0];
        console.log('📋 Headers Categorias:', headers);

        erpData.categories = rows.slice(1).map((row, index) => ({
            id: index + 1,
            name: row[0] || '',
            icon: row[1] || '🍕',
            description: row[2] || '',
            order: parseInt(row[3]) || index + 1,
            status: row[4] || 'ativo'
        }));

        console.log('✅ Categorias carregadas:', erpData.categories.length);
        if (typeof renderCategoriesGrid === 'function') renderCategoriesGrid();
        
    } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
        throw error;
    }
}

// Carrega dados da aba Horários
async function loadHoursFromSheet(sheetName) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${sheetName}'!A:Z`,
        });

        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            console.log('⚠️ Nenhum dado encontrado na aba Horários.');
            return;
        }

        const headers = rows[0];
        console.log('📋 Headers Horários:', headers);

        erpData.hours = rows.slice(1).map((row, index) => {
            const periodo1 = row[1] || '';
            const [open, close] = periodo1.split(' - ');
            
            return {
                id: index + 1,
                day: row[0] || '',
                open: open || '',
                close: close || '',
                status: 'open'
            };
        });

        console.log('✅ Horários carregados:', erpData.hours.length);
        if (typeof renderHoursTable === 'function') renderHoursTable();
        
    } catch (error) {
        console.error('❌ Erro ao carregar horários:', error);
        throw error;
    }
}

// Carrega dados da aba Bairros
async function loadNeighborhoodsFromSheet(sheetName) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${sheetName}'!A:Z`,
        });

        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            console.log('⚠️ Nenhum dado encontrado na aba Bairros.');
            return;
        }

        const headers = rows[0];
        console.log('📋 Headers Bairros:', headers);

        erpData.neighborhoods = rows.slice(1).map((row, index) => ({
            id: index + 1,
            name: row[0] || '',
            fee: row[1] || '0',
            time: '30-40 min',
            status: 'active'
        }));

        console.log('✅ Bairros carregados:', erpData.neighborhoods.length);
        if (typeof renderNeighborhoodsTable === 'function') renderNeighborhoodsTable();
        
    } catch (error) {
        console.error('❌ Erro ao carregar bairros:', error);
        throw error;
    }
}

// ====================================================================
// FUNÇÃO DE RECARGA MANUAL
// ====================================================================

async function loadAllDataFromSheets() {
    // Verifica se as APIs estão inicializadas
    if (!gapiInited || !gisInited) {
        showToast('⏳ Aguarde, as APIs do Google ainda estão carregando...', 'warning');
        console.warn('APIs não inicializadas. gapiInited:', gapiInited, 'gisInited:', gisInited);
        return;
    }
    
    // Verifica se está autenticado
    if (!gapi || !gapi.client || !gapi.client.getToken()) {
        showToast('⚠️ Faça login primeiro!', 'warning');
        return;
    }
    
    await loadSpreadsheetAndSheets();
}

// Expor funções globalmente para serem chamadas pelos scripts do Google
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;

// ====================================================================
// FUNÇÕES DE ESCRITA NA PLANILHA
// ====================================================================

// Atualizar um item na planilha
async function updateItemInSheet(item) {
    try {
        console.log('📝 Atualizando item na planilha:', item);
        
        // Encontrar a linha do item (linha 1 é header, então item.id + 1)
        const rowIndex = parseInt(item.id) + 1;
        
        const values = [[
            item.id,
            item.name,
            item.category,
            item.description,
            item.price,
            item.status,
            '', // adicionais_obrigatorios
            item.image
        ]];
        
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Itens!A${rowIndex}:H${rowIndex}`,
            valueInputOption: 'USER_ENTERED',
            resource: { values }
        });
        
        console.log('✅ Item atualizado na planilha');
        showToast('Item atualizado na planilha!', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao atualizar item:', error);
        showToast('Erro ao atualizar item: ' + error.message, 'error');
        throw error;
    }
}

// Adicionar novo item na planilha
async function addItemToSheet(item) {
    try {
        console.log('➕ Adicionando item na planilha:', item);
        
        const values = [[
            item.id,
            item.name,
            item.category,
            item.description,
            item.price,
            item.status,
            '', // adicionais_obrigatorios
            item.image
        ]];
        
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Itens!A:H',
            valueInputOption: 'USER_ENTERED',
            resource: { values }
        });
        
        console.log('✅ Item adicionado na planilha');
        showToast('Item adicionado na planilha!', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao adicionar item:', error);
        showToast('Erro ao adicionar item: ' + error.message, 'error');
        throw error;
    }
}

// Deletar item da planilha
async function deleteItemFromSheet(itemId) {
    try {
        console.log('🗑️ Deletando item da planilha:', itemId);
        
        // Encontrar a linha do item
        const rowIndex = parseInt(itemId);
        
        // Buscar o sheetId da aba Itens
        const response = await gapi.client.sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        
        const sheet = response.result.sheets.find(s => s.properties.title === 'Itens');
        if (!sheet) throw new Error('Aba Itens não encontrada');
        
        const sheetId = sheet.properties.sheetId;
        
        // Deletar a linha
        await gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            resource: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex, // 0-indexed
                            endIndex: rowIndex + 1
                        }
                    }
                }]
            }
        });
        
        console.log('✅ Item deletado da planilha');
        showToast('Item deletado da planilha!', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao deletar item:', error);
        showToast('Erro ao deletar item: ' + error.message, 'error');
        throw error;
    }
}

// Expor funções globalmente
window.updateItemInSheet = updateItemInSheet;
window.addItemToSheet = addItemToSheet;
window.deleteItemFromSheet = deleteItemFromSheet;

// Chamar quando a página carregar
window.addEventListener('load', () => {
    console.log('🚀 Sistema ERP carregado');
    console.log('⏳ Aguardando inicialização das APIs do Google...');
});

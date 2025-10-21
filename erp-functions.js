// ====================================================================
// FUNÇÕES ERP UNIFICADO COM ABAS
// ====================================================================

let erpSheets = [];
let erpActiveSheet = '';
let erpCurrentData = [];
let erpHeaders = [];

// Atualiza status de conexão ERP
function updateERPStatus(status, text) {
    const dot = document.getElementById('erp-status-dot');
    const statusText = document.getElementById('erp-status-text');
    
    if (!dot || !statusText) return;
    
    const colors = {
        connected: 'bg-green-500',
        disconnected: 'bg-gray-400',
        error: 'bg-red-500'
    };
    
    dot.className = `w-3 h-3 rounded-full ${colors[status] || colors.disconnected}`;
    statusText.textContent = text;
}

// Atualiza botões de autenticação ERP
function updateERPAuthButtons(isConnected) {
    const connectBtn = document.getElementById('erp-connect-btn');
    const disconnectBtn = document.getElementById('erp-disconnect-btn');
    const controls = document.getElementById('erp-controls');
    const sheetsNav = document.getElementById('erp-sheets-nav');
    
    if (connectBtn && disconnectBtn) {
        if (isConnected) {
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-flex';
            if (controls) controls.style.display = 'flex';
            if (sheetsNav) sheetsNav.style.display = 'block';
            updateERPStatus('connected', 'Conectado');
        } else {
            connectBtn.style.display = 'inline-flex';
            disconnectBtn.style.display = 'none';
            if (controls) controls.style.display = 'none';
            if (sheetsNav) sheetsNav.style.display = 'none';
            updateERPStatus('disconnected', 'Desconectado');
        }
    }
}

// Carrega planilha e suas abas
async function loadERPSpreadsheet() {
    try {
        const response = await gapi.client.sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        
        erpSheets = response.result.sheets;
        
        if (!erpSheets || erpSheets.length === 0) {
            showToast('Nenhuma aba encontrada nesta planilha.', 'error');
            return;
        }
        
        renderERPTabs();
        updateERPAuthButtons(true);
        
        // Carrega a primeira aba automaticamente
        if (erpSheets.length > 0) {
            await switchERPSheet(erpSheets[0].properties.title);
        }
        
    } catch (err) {
        console.error('❌ Erro ao carregar a planilha:', err);
        showToast('Erro ao carregar planilha: ' + (err.result?.error?.message || err.message), 'error');
    }
}

// Renderiza as abas de navegação
function renderERPTabs() {
    const tabsContainer = document.getElementById('erp-sheets-tabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = '';
    
    erpSheets.forEach(sheet => {
        const tab = document.createElement('button');
        tab.className = 'px-4 py-2 rounded-lg font-medium transition-colors';
        tab.textContent = sheet.properties.title;
        
        if (sheet.properties.title === erpActiveSheet) {
            tab.className += ' bg-blue-600 text-white';
        } else {
            tab.className += ' bg-gray-200 text-gray-700 hover:bg-gray-300';
        }
        
        tab.onclick = () => switchERPSheet(sheet.properties.title);
        tabsContainer.appendChild(tab);
    });
}

// Troca para uma nova aba
async function switchERPSheet(sheetName) {
    if (sheetName === erpActiveSheet) return;
    
    erpActiveSheet = sheetName;
    renderERPTabs();
    await loadERPSheetData();
}

// Carrega dados da aba ativa
async function loadERPSheetData() {
    if (!erpActiveSheet) return;
    
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${erpActiveSheet}'!A:Z`,
        });

        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            erpCurrentData = [];
            erpHeaders = [];
            renderERPTable();
            return;
        }

        erpHeaders = rows[0];
        erpCurrentData = rows.slice(1);
        
        renderERPTable();
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        showToast('Erro ao carregar dados: ' + error.message, 'error');
    }
}

// Renderiza a tabela
function renderERPTable() {
    const thead = document.getElementById('erp-table-head');
    const tbody = document.getElementById('erp-table-body');
    const dataSection = document.getElementById('erp-data-section');
    
    if (!thead || !tbody || !dataSection) return;
    
    thead.innerHTML = '';
    tbody.innerHTML = '';
    
    if (erpHeaders.length === 0) {
        dataSection.style.display = 'none';
        return;
    }
    
    dataSection.style.display = 'block';
    
    // Detectar se é a aba "Itens" para usar renderização resumida
    const isItensTab = erpActiveSheet.toLowerCase() === 'itens';
    
    // Cabeçalho
    const headerRow = document.createElement('tr');
    
    if (isItensTab) {
        // Renderização resumida para Itens: apenas colunas principais
        const mainColumns = ['sku', 'item', 'categoria', 'preco', 'status'];
        const columnIndexes = [];
        
        mainColumns.forEach(col => {
            const index = erpHeaders.findIndex(h => h.toLowerCase() === col);
            if (index !== -1) {
                columnIndexes.push(index);
                const th = document.createElement('th');
                th.className = 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
                th.textContent = erpHeaders[index];
                headerRow.appendChild(th);
            }
        });
        
        // Armazena os índices para usar no corpo
        headerRow.dataset.columnIndexes = JSON.stringify(columnIndexes);
    } else {
        // Renderização completa para outras abas
        erpHeaders.forEach(header => {
            const th = document.createElement('th');
            th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
            th.textContent = header;
            headerRow.appendChild(th);
        });
    }
    
    const actionTh = document.createElement('th');
    actionTh.className = 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
    actionTh.textContent = 'Ações';
    headerRow.appendChild(actionTh);
    thead.appendChild(headerRow);

    // Corpo da tabela
    erpCurrentData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.dataset.rowIndex = index + 2; // +2 porque linha 1 é header
        
        if (isItensTab) {
            // Renderização resumida
            const columnIndexes = JSON.parse(headerRow.dataset.columnIndexes);
            columnIndexes.forEach(colIndex => {
                const td = document.createElement('td');
                td.className = 'px-4 py-3 text-sm text-gray-900';
                
                // Formatação especial para algumas colunas
                const headerName = erpHeaders[colIndex].toLowerCase();
                let cellValue = row[colIndex] || '';
                
                if (headerName === 'preco') {
                    td.className += ' font-semibold text-green-600';
                    cellValue = cellValue ? `R$ ${cellValue}` : '';
                    td.textContent = cellValue;
                } else if (headerName === 'status') {
                    const normalizedValue = cellValue.trim();
                    const isActive = normalizedValue.toLowerCase() === 'ativo';
                    const displayValue = isActive ? 'Ativo' : 'Inativo';
                    td.innerHTML = `<span class="px-2 py-1 text-xs rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${displayValue}</span>`;
                } else {
                    td.textContent = cellValue;
                }
                
                tr.appendChild(td);
            });
        } else {
            // Renderização completa
            row.forEach((cell, j) => {
                const td = document.createElement('td');
                td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
                td.textContent = cell || '';
                tr.appendChild(td);
            });
        }

        // Célula de ações
        const actionTd = document.createElement('td');
        actionTd.className = 'px-4 py-3 whitespace-nowrap text-sm font-medium';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️ Editar';
        editBtn.className = 'text-blue-600 hover:text-blue-800 mr-3';
        editBtn.onclick = () => showERPEditModal(index + 2, row);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Deletar';
        deleteBtn.className = 'text-red-600 hover:text-red-800';
        deleteBtn.onclick = () => deleteERPRow(index + 2);
        
        actionTd.appendChild(editBtn);
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });
}

// Filtrar tabela
function filterERPTable() {
    const searchInput = document.getElementById('erp-search');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const tbody = document.getElementById('erp-table-body');
    if (!tbody) return;
    
    const rows = tbody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Mostrar modal para adicionar
async function showERPAddModal() {
    const modal = document.getElementById('erp-modal');
    const title = document.getElementById('erp-modal-title');
    const rowIndex = document.getElementById('erp-row-index');
    const formFields = document.getElementById('erp-form-fields');
    
    if (!modal || !title || !rowIndex || !formFields) return;
    
    title.textContent = 'Adicionar Nova Linha';
    rowIndex.value = '';
    formFields.innerHTML = '';
    
    // Se for aba Itens, carregar categorias
    const isItensTab = erpActiveSheet.toLowerCase() === 'itens';
    
    let categories = [];
    if (isItensTab) {
        try {
            categories = await loadCategoriesFromSheet();
            if (!Array.isArray(categories)) {
                categories = [];
            }
        } catch (error) {
            categories = [];
        }
    }
    
    // Criar campos baseados nos headers
    erpHeaders.forEach((header, index) => {
        const div = document.createElement('div');
        const headerLower = header.toLowerCase();
        
        // Campo especial para categoria na aba Itens
        if (isItensTab && headerLower === 'categoria' && Array.isArray(categories) && categories.length > 0) {
            const options = categories.map(cat => 
                `<option value="${cat}">${cat}</option>`
            ).join('');
            
            div.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">${header}</label>
                <select id="erp-field-${index}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione uma categoria</option>
                    ${options}
                </select>
            `;
        } 
        // Campo especial para status na aba Itens
        else if (isItensTab && headerLower === 'status') {
            div.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">${header}</label>
                <select id="erp-field-${index}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Ativo" selected>Ativo</option>
                    <option value="Inativo">Inativo</option>
                </select>
            `;
        }
        else {
            div.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">${header}</label>
                <input type="text" id="erp-field-${index}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            `;
        }
        
        formFields.appendChild(div);
    });
    
    modal.style.display = 'flex';
}

// Buscar categorias da planilha para o ERP
async function loadCategoriesFromSheet() {
    try {
        if (!gapi || !gapi.client) {
            return [];
        }
        
        // Tentar diferentes nomes de aba
        const possibleSheetNames = ['Categorias', 'categorias', 'CATEGORIAS', 'Category', 'categoria'];
        
        for (const sheetName of possibleSheetNames) {
            try {
                const response = await gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${sheetName}!A:A`,
                });

                const rows = response.result.values;
                
                if (rows && rows.length > 0) {
                    // Remove o header e retorna apenas os nomes
                    const categories = rows.slice(1).map(row => row[0]).filter(cat => cat && cat.trim());
                    return categories;
                }
            } catch (err) {
                continue;
            }
        }
        
        return [];
    } catch (error) {
        return [];
    }
}

// Mostrar modal para editar
async function showERPEditModal(rowIndex, rowData) {
    const modal = document.getElementById('erp-modal');
    const title = document.getElementById('erp-modal-title');
    const rowIndexInput = document.getElementById('erp-row-index');
    const formFields = document.getElementById('erp-form-fields');
    
    if (!modal || !title || !rowIndexInput || !formFields) return;
    
    // Encontrar o nome do item para mostrar no título
    const isItensTab = erpActiveSheet.toLowerCase() === 'itens';
    let itemName = '';
    if (isItensTab) {
        const nomeIndex = erpHeaders.findIndex(h => h.toLowerCase() === 'nome');
        if (nomeIndex !== -1 && rowData[nomeIndex]) {
            itemName = ` - ${rowData[nomeIndex]}`;
        }
    }
    
    title.textContent = `Editar Linha${itemName}`;
    rowIndexInput.value = rowIndex;
    formFields.innerHTML = '';
    
    // Se for aba Itens, carregar categorias
    let categories = [];
    if (isItensTab) {
        try {
            const result = await loadCategoriesFromSheet();
            
            if (!Array.isArray(result)) {
                categories = [];
            } else {
                categories = result;
            }
        } catch (error) {
            categories = [];
        }
    }
    
    // Criar campos baseados nos headers e preencher com dados
    erpHeaders.forEach((header, index) => {
        const div = document.createElement('div');
        const headerLower = header.toLowerCase();
        
        // Garantir que rowData[index] existe
        const currentValue = (rowData && rowData[index]) ? rowData[index] : '';
        
        // Campo especial para categoria na aba Itens
        if (isItensTab && headerLower === 'categoria' && Array.isArray(categories) && categories.length > 0) {
            const options = categories.map(cat => 
                `<option value="${cat}" ${cat === currentValue ? 'selected' : ''}>${cat}</option>`
            ).join('');
            
            div.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">${header}</label>
                <select id="erp-field-${index}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione uma categoria</option>
                    ${options}
                </select>
            `;
        } 
        // Campo especial para status na aba Itens
        else if (isItensTab && headerLower === 'status') {
            const isAtivo = currentValue.toLowerCase() === 'ativo';
            div.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">${header}</label>
                <select id="erp-field-${index}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Ativo" ${isAtivo ? 'selected' : ''}>Ativo</option>
                    <option value="Inativo" ${!isAtivo ? 'selected' : ''}>Inativo</option>
                </select>
            `;
        }
        else {
            div.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">${header}</label>
                <input type="text" id="erp-field-${index}" value="${currentValue}" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            `;
        }
        
        formFields.appendChild(div);
    });
    
    modal.style.display = 'flex';
}

// Fechar modal
function closeERPModal() {
    const modal = document.getElementById('erp-modal');
    if (modal) modal.style.display = 'none';
}

// Salvar linha
async function saveERPRow(event) {
    event.preventDefault();
    
    const rowIndex = document.getElementById('erp-row-index').value;
    const values = [];
    
    // Coletar valores dos campos
    erpHeaders.forEach((header, index) => {
        const field = document.getElementById(`erp-field-${index}`);
        values.push(field ? field.value : '');
    });
    
    try {
        if (rowIndex) {
            // Editar linha existente
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `'${erpActiveSheet}'!A${rowIndex}:${String.fromCharCode(65 + erpHeaders.length - 1)}${rowIndex}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values: [values] }
            });
        } else {
            // Adicionar nova linha
            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: `'${erpActiveSheet}'!A:${String.fromCharCode(65 + erpHeaders.length - 1)}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values: [values] }
            });
        }
        
        closeERPModal();
        await loadERPSheetData();
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        
        // Verificar se é erro de permissão
        if (error.status === 403 || (error.result && error.result.error && error.result.error.code === 403)) {
            showToast('❌ Sem permissão de escrita! Desconecte e faça login novamente para obter permissões completas.', 'error', 8000);
        } else {
            showToast('Erro ao salvar: ' + (error.message || 'Erro desconhecido'), 'error');
        }
        throw error;
    }
}

// Deletar linha
async function deleteERPRow(rowIndex) {
    if (!confirm('Tem certeza que deseja excluir esta linha?')) return;
    
    try {
        // Buscar o sheetId da aba ativa
        const response = await gapi.client.sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        
        const sheet = response.result.sheets.find(s => s.properties.title === erpActiveSheet);
        if (!sheet) throw new Error('Aba não encontrada');
        
        const sheetId = sheet.properties.sheetId;
        
        // Deletar a linha (rowIndex é 1-indexed, mas a API usa 0-indexed)
        await gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            resource: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: 'ROWS',
                            startIndex: rowIndex - 1,
                            endIndex: rowIndex
                        }
                    }
                }]
            }
        });
        
        await loadERPSheetData();
        
    } catch (error) {
        console.error('❌ Erro ao deletar:', error);
        showToast('Erro ao deletar: ' + error.message, 'error');
    }
}

// Verificar se já está autenticado ao carregar
function checkERPAuth() {
    const tokenDataString = localStorage.getItem('google_auth_token');
    if (tokenDataString) {
        try {
            const tokenData = JSON.parse(tokenDataString);
            // Verifica se o token não expirou
            if (Date.now() < tokenData.expiresAt) {
                updateERPAuthButtons(true);
            }
        } catch (e) {
            console.error('Erro ao verificar token:', e);
        }
    }
}

// Expor funções globalmente
window.updateERPAuthButtons = updateERPAuthButtons;
window.loadERPSpreadsheet = loadERPSpreadsheet;
window.loadERPSheetData = loadERPSheetData;
window.filterERPTable = filterERPTable;
window.showERPAddModal = showERPAddModal;
window.showERPEditModal = showERPEditModal;
window.closeERPModal = closeERPModal;
window.saveERPRow = saveERPRow;
window.deleteERPRow = deleteERPRow;

// Verificar autenticação ao carregar
setTimeout(checkERPAuth, 500);

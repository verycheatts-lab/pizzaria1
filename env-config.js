// ====================================================================
// CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE
// ====================================================================
// Este arquivo contém as variáveis de ambiente para desenvolvimento local
// IMPORTANTE: Em produção, use variáveis de ambiente do Netlify
// ====================================================================

(function() {
    'use strict';
    
    // Objeto global para armazenar as variáveis de ambiente
    window.ENV = {
        // ====================================================================
        // GOOGLE SHEETS API
        // ====================================================================
        // ATENÇÃO: Estas chaves antigas devem ser REVOGADAS e substituídas!
        GOOGLE_API_KEY: 'AIzaSyBhVrMGEf6r4ejfh4IFNVTRfgzt9zWXhjc',
        GOOGLE_CLIENT_ID: '120313322191-klangko2snsaaqs36cvc0tujrlpg6ouo.apps.googleusercontent.com',
        GOOGLE_SPREADSHEET_ID: '1ZnD4_u965kBQcZgDAm2U6luLaPUnffnsZ6-DUNRYn2g',
        
        // ====================================================================
        // IP GEOLOCATION API
        // ====================================================================
        IP_GEO_API_KEY: 'API_KEY_FREE',
        
        // ====================================================================
        // SUPABASE (se aplicável)
        // ====================================================================
        SUPABASE_URL: 'https://seu-projeto.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        
        // ====================================================================
        // CONFIGURAÇÕES
        // ====================================================================
        NODE_ENV: 'development',
        PORT: '3000'
    };
    
    console.log('✅ Variáveis de ambiente carregadas com sucesso');
    console.warn('⚠️ ATENÇÃO: As chaves do Google devem ser revogadas e substituídas por novas!');
    console.info('📚 Consulte SEGURANCA-CHAVES.md para mais detalhes');
})();

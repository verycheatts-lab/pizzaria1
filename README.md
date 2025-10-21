# 🍕 Sistema de Cardápio Digital - Pizzaria

Sistema completo de cardápio digital para pizzarias com integração Google Sheets, Supabase e PWA.

[![Netlify Status](https://api.netlify.com/api/v1/badges/seu-site-id/deploy-status)](https://app.netlify.com/sites/seu-site/deploys)

---

## 🚀 Funcionalidades

- ✅ **Cardápio Digital Dinâmico** - Atualização via Google Sheets
- ✅ **Carrinho de Compras** - Sistema completo com localStorage
- ✅ **Sistema de Pedidos** - Integração com WhatsApp
- ✅ **Cupons de Desconto** - Sistema de promoções
- ✅ **Cálculo de Frete** - Por bairro/região
- ✅ **Horário de Funcionamento** - Validação automática
- ✅ **PWA** - Funciona offline e pode ser instalado
- ✅ **Responsivo** - Mobile-first design
- ✅ **Painel Admin** - Gerenciamento de pedidos
- ✅ **Sistema de Login** - Autenticação segura

---

## 🛠️ Tecnologias

- **Front-end:** HTML5, CSS3, JavaScript (Vanilla), TailwindCSS
- **Backend:** Supabase Edge Functions
- **Database:** Google Sheets (via API)
- **Hosting:** Netlify
- **PWA:** Service Worker, Manifest
- **APIs:** Google Sheets API, IP Geolocation API

---

## 📦 Estrutura do Projeto

```
pizzaria/
├── index.html              # Página principal do cardápio
├── login.html              # Página de login
├── paineladmin.html        # Painel administrativo
├── config.js               # Configurações gerais
├── env.js                  # Carregador de variáveis de ambiente
├── erp-functions.js        # Funções de integração ERP
├── erp-integration.js      # Lógica de integração
├── google_api_functions.js # Funções da API do Google
├── service-worker.js       # Service Worker (PWA)
├── manifest.json           # Manifest (PWA)
├── netlify.toml            # Configuração do Netlify
├── _redirects              # Regras de redirect
├── .env                    # Variáveis de ambiente (NÃO commitar!)
├── .env.example            # Template de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── DEPLOY-NETLIFY.md       # Guia de deploy no Netlify
├── SUPABASE-SETUP.md       # Guia de configuração do Supabase
├── CREDENCIAIS-INSTRUCOES.md # Instruções para credenciais
├── CONFIGURACAO-ENV.md     # Guia de configuração de variáveis
└── SEGURANCA-CHAVES.md     # Migração de segurança
```

---

## 🚀 Deploy Rápido

### Opção 1: Deploy no Netlify (Recomendado)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seu-usuario/pizzaria)

1. Clique no botão acima
2. Conecte seu GitHub
3. Configure as variáveis de ambiente
4. Deploy automático!

### Opção 2: Deploy Manual

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pizzaria.git
cd pizzaria

# 2. Configure as credenciais
cp .env.example .env
# Edite .env com suas credenciais

# 3. Deploy via Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

📚 **Guia completo:** [DEPLOY-NETLIFY.md](./DEPLOY-NETLIFY.md)

---

## ⚙️ Configuração

### 1. Configurar Google Sheets

Crie uma planilha com as seguintes abas:

- **Items** - Produtos do cardápio
- **Categories** - Categorias
- **Hours** - Horários de funcionamento
- **Bairros** - Taxas de entrega
- **Cupons** - Cupons de desconto
- **Config** - Configurações gerais

📚 **Formato das planilhas:** Veja exemplos em `config.js`

### 2. Configurar Supabase

```bash
# Login no Supabase
supabase login

# Linkar projeto
supabase link --project-ref seu-projeto-id

# Configurar secrets
supabase secrets set GOOGLE_API_KEY=sua_chave
supabase secrets set IP_GEO_API_KEY=sua_chave

# Deploy das Edge Functions
supabase functions deploy google-sheets
supabase functions deploy ip-geolocation
```

📚 **Guia completo:** [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)

### 3. Configurar Credenciais

```bash
# Copiar template
cp .env.example .env

# Editar com suas credenciais
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - GOOGLE_API_KEY
# - IP_GEO_API_KEY
```

📚 **Guia completo:** [CREDENCIAIS-INSTRUCOES.md](./CREDENCIAIS-INSTRUCOES.md)

### 4. Configurar URLs das Planilhas

Edite `config.js` e atualize as URLs:

```javascript
const MENU_CSV_URL = 'sua-url-aqui';
const CATEGORIES_CSV_URL = 'sua-url-aqui';
const HOURS_CSV_URL = 'sua-url-aqui';
// ...
```

---

## 🧪 Testes

### Testar Localmente

```bash
# Servidor HTTP simples
python -m http.server 8000

# Ou com Node.js
npx http-server -p 8000

# Acesse: http://localhost:8000
```

### Testar Conexões

Abra o console do navegador (F12):

```javascript
// Testar Supabase
await testSupabaseConnection();

// Testar Google Sheets
const dados = await secureReadSheet(SPREADSHEET_ID, 'Items!A1:Z100');
console.log(dados);
```

---

## 📱 PWA - Progressive Web App

O sistema funciona como um aplicativo:

- **Instalável** - Pode ser instalado no celular/desktop
- **Offline** - Funciona sem internet (cache)
- **Push Notifications** - Notificações de pedidos (futuro)
- **App-like** - Experiência de app nativo

### Instalar como App

**Android:**
1. Abra o site no Chrome
2. Toque no menu (⋮)
3. "Adicionar à tela inicial"

**iOS:**
1. Abra o site no Safari
2. Toque em "Compartilhar"
3. "Adicionar à Tela de Início"

**Desktop:**
1. Abra o site no Chrome
2. Clique no ícone de instalação (barra de endereço)
3. "Instalar"

---

## 🔐 Segurança

### ⚠️ IMPORTANTE: Migração de Segurança

**Todas as chaves de API foram movidas para variáveis de ambiente!**

📚 **Guias de Segurança:**
- [SEGURANCA-CHAVES.md](./SEGURANCA-CHAVES.md) - Mudanças implementadas e ações necessárias
- [CONFIGURACAO-ENV.md](./CONFIGURACAO-ENV.md) - Como configurar variáveis de ambiente

### Boas Práticas Implementadas

- ✅ Variáveis de ambiente protegidas
- ✅ API Keys no servidor (Supabase Edge Functions)
- ✅ HTTPS obrigatório
- ✅ CORS configurado
- ✅ Headers de segurança (CSP, X-Frame-Options)
- ✅ Sanitização de inputs
- ✅ Rate limiting (Supabase)
- ✅ Chaves movidas para `.env` (não commitadas no Git)

### Checklist de Segurança

- [x] `.env` no `.gitignore`
- [ ] Arquivo `.env` criado e configurado
- [ ] Chaves antigas revogadas
- [ ] Novas credenciais geradas
- [ ] Secrets configurados no Supabase
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] CORS configurado para seu domínio
- [ ] HTTPS ativo
- [ ] API Keys restritas por domínio
- [ ] Backup das credenciais em local seguro

---

## 📊 Monitoramento

### Netlify Analytics

- Pageviews
- Unique visitors
- Bandwidth usage
- Top pages

### Supabase Logs

```bash
# Ver logs em tempo real
supabase functions logs google-sheets --follow
```

### Performance

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- Netlify Analytics (pago)

---

## 🐛 Troubleshooting

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| Site não carrega | Verifique `netlify.toml` - publish directory deve ser `.` |
| CSS não aplica | Verifique caminhos relativos no HTML |
| Erro de CORS | Configure domínio no Supabase |
| API não funciona | Verifique secrets no Supabase |
| Carrinho não salva | Verifique localStorage no navegador |

📚 **Mais soluções:** [DEPLOY-NETLIFY.md#troubleshooting](./DEPLOY-NETLIFY.md#troubleshooting)

---

## 🔄 Atualizações

### Deploy Automático (GitHub)

```bash
git add .
git commit -m "Atualização do cardápio"
git push origin main
# Deploy automático em ~30 segundos
```

### Rollback

Se algo der errado:
1. Acesse Netlify Dashboard
2. Vá em "Deploys"
3. Encontre o deploy anterior
4. Clique em "Publish deploy"

---

## 📚 Documentação

### Guias de Deploy e Configuração
- [DEPLOY-NETLIFY.md](./DEPLOY-NETLIFY.md) - Guia completo de deploy
- [SUPABASE-SETUP.md](./SUPABASE-SETUP.md) - Configuração do Supabase
- [CREDENCIAIS-INSTRUCOES.md](./CREDENCIAIS-INSTRUCOES.md) - Configurar credenciais

### Guias de Segurança
- [SEGURANCA-CHAVES.md](./SEGURANCA-CHAVES.md) - Migração de segurança e ações necessárias
- [CONFIGURACAO-ENV.md](./CONFIGURACAO-ENV.md) - Como configurar variáveis de ambiente

### Arquivos de Configuração
- [config.js](./config.js) - Configurações do sistema
- [env.js](./env.js) - Carregador de variáveis de ambiente
- [.env.example](./.env.example) - Template de variáveis de ambiente

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🆘 Suporte

- **Documentação:** Veja os arquivos `.md` no repositório
- **Issues:** Abra uma issue no GitHub
- **Email:** seu-email@exemplo.com

---

## 🎉 Agradecimentos

- [Supabase](https://supabase.com/) - Backend as a Service
- [Netlify](https://netlify.com/) - Hosting e CDN
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Google Sheets API](https://developers.google.com/sheets/api) - Database

---

**Desenvolvido com ❤️ para pizzarias**

**Bom apetite! 🍕**

# Cooud.com — Clone Completo (Estilo SaveWeb2Zip)

Este pacote contém o clone 100% idêntico e autônomo do site **[https://cooud.com](https://cooud.com)**, pronto para ser executado localmente, editado livremente e hospedado onde você desejar.

---

## 🚀 Como Executar Localmente

Você tem várias maneiras simples de rodar a página:

### Opção 1: Servidor Integrado Node.js (Sem instalar nada)
Já incluímos um servidor pronto (`server.js`) configurado com suporte a MIME types, rotas e streaming de vídeos:

```bash
cd cooud-site
node server.js
```
Acesse no seu navegador: **`http://localhost:3333`**

### Opção 2: Com qualquer servidor estático
```bash
npx serve cooud-site
# ou
python3 -m http.server 3000 -d cooud-site
```

### Opção 3: Arquivo ZIP
O arquivo **`cooud.com.zip`** (16 MB) já foi gerado na raiz com a estrutura completa idêntica ao SaveWeb2Zip.

---

## 📁 Estrutura de Arquivos

```text
cooud-site/
├── index.html                       # O HTML completo da página com textos e seções
├── server.js                        # Servidor local Node.js com suporte a vídeos
├── logo.png / logo-white.png        # Logos originais da Cooud
├── favicon.ico                      # Favicon original
├── _next/static/css/                # Todas as 4 folhas de estilo CSS da página
├── _next/static/chunks/             # Scripts e componentes interativos (JS)
├── fonts/                           # Todas as fontes originais (GoodTimes e SF Pro Display)
├── images/landing/                  # Imagens, medalhas, placas e ícones SVG globais
├── landing/carousel/                # Imagens do carrossel
└── videos/landing/                  # Vídeos em alta definição (Cooud TV e Upsell)
```

---

## ✏️ Como Editar a Página

1. **Alterar Textos, Títulos e Chamadas:**
   - Abra o arquivo `cooud-site/index.html` em qualquer editor (VS Code, Notepad, etc.).
   - Procure pelo texto que deseja mudar (ex: *"Venda. Escale. Sem limites."*, planos, taxas, depoimentos).
   - Altere o texto e salve o arquivo. Ao recarregar no navegador, a alteração aparecerá instantaneamente.

2. **Alterar Links e Botões de Checkout / Cadastro:**
   - No `cooud-site/index.html`, busque pelas tags `<a href="...">` ou botões de ação e substitua pelas suas próprias URLs de checkout, WhatsApp ou cadastro.

3. **Trocar Imagens e Logo:**
   - Substitua os arquivos `logo.png` e `logo-white.png` pelas suas logos mantendo o mesmo nome, ou aponte a tag `<img>` para uma nova imagem.
   - As imagens de ilustrações e carrossel estão organizadas em `images/` e `landing/carousel/`.

4. **Trocar Cores e Estilos:**
   - As classes Tailwind e arquivos CSS estão em `_next/static/css/`. Você também pode adicionar seus próprios estilos diretamente em uma tag `<style>` dentro de `index.html`.

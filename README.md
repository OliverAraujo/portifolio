# Portfólio de Oliver Araújo

Portfólio em React com português, inglês e espanhol, menu responsivo, projetos fixados no GitHub e animações que respeitam a preferência de movimento reduzido.

## Desenvolvimento

Requer Node.js 22.12 ou superior.

```bash
npm ci
npm run dev
```

Edite os componentes em `src/app.jsx`, as traduções em `src/translations.js` e os estilos em `style.css`.

## Publicação no GitHub Pages

O Pages publica a raiz da branch `main`. O Vite gera o `index.html` publicado e a pasta `assets` na raiz, mantendo os fontes em `src`.

```bash
npm run build
git add .
git commit -m "Atualiza o portfólio"
git push origin main
```

Edite `src/index.html` para alterar o documento de origem. O `index.html` da raiz é gerado pelo build.

Os projetos são lidos de `pinned-projects.json`, atualizado pelo workflow existente de sincronização dos fixados.

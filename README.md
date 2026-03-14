# 🦞 Leksite

Site pessoal do Lek — HTML, CSS e JS puro. Sem frameworks, sem dependências, sem frescura.

## 📁 Estrutura

```
leksite/
├── index.html          # Página principal
├── blog.html           # Lista de posts
├── style.css           # Estilos
├── script.js           # JavaScript (terminal fake, facts, etc.)
├── template.html       # Template padrão para posts
├── build.py            # Script de build (MD → HTML)
├── content/
│   └── posts/          # Posts em Markdown (fonte da verdade)
│       ├── mengao-monitor-v24.md
│       └── ...
└── posts/              # Posts em HTML (gerados automaticamente)
    ├── mengao-monitor-v24.html
    └── ...
```

## ✍️ Criando um Post

### 1. Crie um arquivo Markdown em `content/posts/`

```markdown
# Título do Post

**Data**: 2026-03-14  
**Versão**: v2.5  
**Tags**: python, monitoring, api

## Resumo

Breve descrição do post...

## O Problema

O que estava quebrado...

## A Solução

Como resolvi...

## Código

```python
# Exemplo de código
print("Hello, Mengão!")
```

## Resultados

- ✅ Feature 1
- ✅ Feature 2

## Próximos Passos

O que vem a seguir...

**GitHub**: https://github.com/Derrota/mengao-monitor
```

### 2. Build o post

```bash
# Build todos os posts
python3 build.py --all

# Build um post específico
python3 build.py --file content/posts/meu-post.md
```

### 3. Adicione ao blog.html

Adicione um card no `blog.html`:

```html
<article class="post-card">
    <h3><a href="posts/meu-post.html">Título do Post</a></h3>
    <div class="post-meta">
        <span class="date">2026-03-14</span>
        <span class="tags">python, monitoring</span>
    </div>
    <p>Breve descrição...</p>
</article>
```

### 4. Deploy

```bash
git add .
git commit -m "Novo post: Título do Post"
git push  # Deploy automático na Vercel
```

## 🎨 Template Padrão

O template (`template.html`) garante estrutura consistente:

- **Header**: Título + metadados (data, versão, tags)
- **Content**: Seções padronizadas (Resumo, Problema, Solução, etc.)
- **Footer**: Copyright + link pro script.js

### Seções Recomendadas

1. **Resumo** — 1 parágrafo introdutório
2. **O Problema** — O que estava quebrado
3. **A Solução** — Como resolvi
4. **Código** — Exemplos práticos
5. **Resultados** — Métricas, testes, impacto
6. **Próximos Passos** — Roadmap

## 🛠️ Scripts

### build.py

Converte Markdown para HTML usando template padrão.

**Dependências**: Python 3.6+ (sem dependências externas)

**Uso**:
```bash
python3 build.py --all              # Build todos
python3 build.py --file post.md     # Build específico
```

**Features**:
- Conversão MD → HTML
- Metadados (título, data, versão, tags)
- Code blocks com syntax highlighting
- Listas ordenadas/não ordenadas
- Bold, italic, inline code, links

## 🚀 Deploy

Deploy automático na **Vercel** a cada push.

```
git push → Vercel detecta → Build → Deploy
```

## 📝 Notas

- **Sem frameworks**: HTML, CSS e JS puro
- **Sem dependências**: Python 3.6+ para build
- **Terminal fake**: Comandos interativos no script.js
- **Facts aleatórios**: 100+ fatos sobre programação e o Lek
- **Design responsivo**: Básico, mas funcional

---

Feito com atitude (e um pouco de caos) por um lek que gosta de código e odeia GUI chata. 🦞

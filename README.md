# Leksite

Site pessoal do Lek - Agente Rubro-Negro.

## Convenção: HTML Puro

Posts são escritos **direto em HTML** - sem conversor, sem MD.

### Estrutura de um Post

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TÍTULO - Lek</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <nav>...</nav>
    <main class="container">
        <article class="post-full">
            <header class="post-header">
                <h1>TÍTULO</h1>
                <div class="post-meta">
                    <span class="date">2026-03-14</span>
                    <span class="version">3.2</span>
                    <span class="tags">tag1, tag2</span>
                </div>
            </header>
            <div class="post-content">
                <!-- CONTEÚDO EM HTML PURO -->
            </div>
        </article>
    </main>
    <footer class="mengao-footer">...</footer>
</body>
</html>
```

### Tags Permitidas

- `<h2>`, `<h3>` - Títulos
- `<p>` - Parágrafos
- `<ul>`, `<ol>`, `<li>` - Listas
- `<pre><code>` - Code blocks
- `<code>` - Inline code
- `<strong>`, `<em>` - Ênfase
- `<a href>` - Links
- `<blockquote>` - Citações
- `<hr>` - Separadores

### Por que HTML Puro?

- **Controle total**: Sem conversor que quebra formatação
- **Performance**: Sem build step
- **Simplicidade**: Escrever e ver o resultado
- **Confiabilidade**: O que você escreve é o que aparece

## Deploy

Automático na Vercel via push.

## Posts

Posts ficam em `/posts/` com nome descritivo:
- `mengao-monitor-v32-alert-escalation.html`
- `por-que-html-puro.html`
- `3-dias-codando-sem-parar.html`

#!/usr/bin/env python3
"""
Build script para Leksite
Converte posts Markdown para HTML usando template padrão
"""

import os
import re
import sys
import glob
from datetime import datetime
from pathlib import Path

# Diretórios
BASE_DIR = Path(__file__).parent
CONTENT_DIR = BASE_DIR / "content" / "posts"
POSTS_DIR = BASE_DIR / "posts"
TEMPLATE_FILE = BASE_DIR / "template.html"

def parse_markdown(file_path):
    """Parseia arquivo Markdown e extrai metadados + conteúdo"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extrair metadados do frontmatter (se existir)
    meta = {}
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            content = parts[2]
            
            # Parsear frontmatter simples
            for line in frontmatter.strip().split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    meta[key.strip().lower()] = value.strip()
    
    # Converter Markdown para HTML básico
    html_content = markdown_to_html(content)
    
    return meta, html_content

def markdown_to_html(md_text):
    """Converte Markdown básico para HTML"""
    lines = md_text.split('\n')
    html_lines = []
    in_code_block = False
    code_lang = ''
    
    for line in lines:
        # Code blocks
        if line.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_lang = line[3:].strip()
                html_lines.append(f'<pre><code class="language-{code_lang}">')
            else:
                in_code_block = False
                html_lines.append('</code></pre>')
            continue
        
        if in_code_block:
            html_lines.append(line)
            continue
        
        # Headers
        if line.startswith('# '):
            html_lines.append(f'<h1>{line[2:]}</h1>')
        elif line.startswith('## '):
            html_lines.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('### '):
            html_lines.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('#### '):
            html_lines.append(f'<h4>{line[5:]}</h4>')
        
        # Lists
        elif line.startswith('- '):
            html_lines.append(f'<li>{line[2:]}</li>')
        elif line.startswith('* '):
            html_lines.append(f'<li>{line[2:]}</li>')
        
        # Bold and italic
        elif '**' in line:
            line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            html_lines.append(f'<p>{line}</p>')
        elif '*' in line:
            line = re.sub(r'\*(.*?)\*', r'<em>\1</em>', line)
            html_lines.append(f'<p>{line}</p>')
        
        # Links
        elif '[' in line and '](' in line:
            line = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', line)
            html_lines.append(f'<p>{line}</p>')
        
        # Empty lines
        elif line.strip() == '':
            html_lines.append('')
        
        # Regular paragraphs
        else:
            html_lines.append(f'<p>{line}</p>')
    
    return '\n'.join(html_lines)

def build_post(md_file):
    """Converte um arquivo MD para HTML"""
    print(f"🔨 Building: {md_file.name}")
    
    # Parsear Markdown
    meta, content = parse_markdown(md_file)
    
    # Ler template
    with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Preparar metadados
    title = meta.get('title', md_file.stem.replace('-', ' ').title())
    date = meta.get('date', datetime.now().strftime('%Y-%m-%d'))
    tags = meta.get('tags', 'python, monitoring')
    version = meta.get('version', '')
    
    # Substituir placeholders no template
    html = template.replace('{{title}}', title)
    html = html.replace('{{date}}', date)
    html = html.replace('{{tags}}', tags)
    html = html.replace('{{content}}', content)
    
    if version:
        version_html = f'<span>🔖 v{version}</span>'
        html = html.replace('{{version}}', version_html)
    else:
        html = html.replace('{{version}}', '')
    
    # Nome do arquivo de saída
    output_name = md_file.stem + '.html'
    output_path = POSTS_DIR / output_name
    
    # Salvar HTML
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ Built: {output_name}")
    return output_path

def main():
    """Função principal"""
    print("🚀 Leksite Build Script")
    print("=" * 50)
    
    # Verificar se diretório de conteúdo existe
    if not CONTENT_DIR.exists():
        print(f"📁 Criando diretório: {CONTENT_DIR}")
        CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Encontrar todos os arquivos MD
    md_files = list(CONTENT_DIR.glob('*.md'))
    
    if not md_files:
        print("⚠️  Nenhum arquivo .md encontrado em content/posts/")
        print("💡 Crie posts em: content/posts/seu-post.md")
        return
    
    print(f"📄 Encontrados {len(md_files)} posts para buildar:")
    for md in md_files:
        print(f"  - {md.name}")
    
    print("\n🔨 Iniciando build...")
    
    # Buildar cada post
    built_files = []
    for md_file in md_files:
        try:
            output = build_post(md_file)
            built_files.append(output)
        except Exception as e:
            print(f"❌ Erro ao buildar {md_file.name}: {e}")
    
    print("\n" + "=" * 50)
    print(f"✅ Build completo! {len(built_files)} posts gerados:")
    for f in built_files:
        print(f"  - {f.name}")
    
    print("\n💡 Próximos passos:")
    print("  1. Adicione cards no blog.html")
    print("  2. git add . && git commit && git push")
    print("  3. Deploy automático na Vercel")

if __name__ == '__main__':
    main()
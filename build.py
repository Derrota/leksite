#!/usr/bin/env python3
"""
Leksite Build Script
Converte posts em Markdown para HTML usando template padrão.
Uso: python3 build.py [--all] [--file content/posts/arquivo.md]
"""

import os
import re
import sys
import argparse
from datetime import datetime

TEMPLATE_FILE = "template.html"
CONTENT_DIR = "content/posts"
OUTPUT_DIR = "posts"

def parse_frontmatter(content):
    """Extrai metadados do frontmatter YAML ou formato antigo."""
    title = ""
    date = ""
    version = ""
    tags = ""
    
    # Procura por frontmatter YAML entre ---
    if content.startswith('---'):
        end = content.find('---', 3)
        if end > 0:
            frontmatter = content[3:end].strip()
            for line in frontmatter.split('\n'):
                line = line.strip()
                if line.startswith('title:'):
                    title = line.split(':', 1)[1].strip().strip('"\'')
                elif line.startswith('date:'):
                    date = line.split(':', 1)[1].strip().strip('"\'')
                elif line.startswith('version:'):
                    version = line.split(':', 1)[1].strip().strip('"\'')
                elif line.startswith('tags:'):
                    tags = line.split(':', 1)[1].strip().strip('"\'')
            return title, date, version, tags
    
    # Formato antigo: **Data**: ... **Versão**: ... **Tags**: ...
    lines = content.split('\n')
    for line in lines[:20]:
        line = line.strip()
        if line.startswith('# '):
            title = line[2:].strip()
        elif line.startswith('**Data**:'):
            date = line.split(':', 1)[1].strip().replace('**', '').strip()
        elif line.startswith('**Versão**:'):
            version = line.split(':', 1)[1].strip().replace('**', '').strip()
        elif line.startswith('**Tags**:'):
            tags = line.split(':', 1)[1].strip().replace('**', '').strip()
    
    return title, date, version, tags

def markdown_to_html(content):
    """Conversão básica de Markdown para HTML."""
    # Remove frontmatter
    if content.startswith('---'):
        end = content.find('---', 3)
        if end > 0:
            content = content[end+3:].strip()
    
    lines = content.split('\n')
    html_lines = []
    in_code_block = False
    in_list = False
    list_type = None
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Code blocks
        if line.startswith('```'):
            if in_code_block:
                html_lines.append('</code></pre>')
                in_code_block = False
            else:
                lang = line[3:].strip()
                html_lines.append(f'<pre><code class="language-{lang}">')
                in_code_block = True
            i += 1
            continue
        
        if in_code_block:
            html_lines.append(line)
            i += 1
            continue
        
        # Headers
        if line.startswith('### '):
            html_lines.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('## '):
            html_lines.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('# '):
            # Título principal - já está no header, pular
            pass
        
        # Horizontal rule
        elif line.startswith('---'):
            html_lines.append('<hr>')
        
        # Blockquote
        elif line.startswith('> '):
            html_lines.append(f'<blockquote><p>{line[2:]}</p></blockquote>')
        
        # Listas não ordenadas
        elif line.startswith('- '):
            if not in_list or list_type != 'ul':
                if in_list:
                    html_lines.append(f'</{list_type}>')
                html_lines.append('<ul>')
                in_list = True
                list_type = 'ul'
            html_lines.append(f'<li>{line[2:]}</li>')
        
        # Listas ordenadas
        elif re.match(r'^\d+\. ', line):
            if not in_list or list_type != 'ol':
                if in_list:
                    html_lines.append(f'</{list_type}>')
                html_lines.append('<ol>')
                in_list = True
                list_type = 'ol'
            content_match = re.match(r'^\d+\. (.*)', line)
            html_lines.append(f'<li>{content_match.group(1)}</li>')
        
        # Linha vazia
        elif line.strip() == '':
            if in_list:
                html_lines.append(f'</{list_type}>')
                in_list = False
                list_type = None
            html_lines.append('')
        
        # Parágrafo normal
        else:
            if in_list:
                html_lines.append(f'</{list_type}>')
                in_list = False
                list_type = None
            
            # Inline formatting
            processed = line
            # Bold
            processed = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', processed)
            # Italic
            processed = re.sub(r'\*(.*?)\*', r'<em>\1</em>', processed)
            # Inline code
            processed = re.sub(r'`(.*?)`', r'<code>\1</code>', processed)
            # Links
            processed = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', processed)
            
            html_lines.append(f'<p>{processed}</p>')
        
        i += 1
    
    if in_list:
        html_lines.append(f'</{list_type}>')
    
    return '\n'.join(html_lines)

def build_post(md_file, template):
    """Converte um arquivo markdown para HTML."""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title, date, version, tags = parse_frontmatter(content)
    
    # Remove frontmatter e título H1 do conteúdo para conversão
    clean_content = content
    
    # Remove frontmatter
    if clean_content.startswith('---'):
        end = clean_content.find('---', 3)
        if end > 0:
            clean_content = clean_content[end+3:].strip()
    
    # Remove título H1 se existir
    lines = clean_content.split('\n')
    if lines and lines[0].startswith('# '):
        lines = lines[1:]
    clean_content = '\n'.join(lines)
    
    html_content = markdown_to_html(clean_content)
    
    # Substitui placeholders no template
    output = template
    output = output.replace('{{TITLE}}', title)
    output = output.replace('{{DATE}}', date)
    output = output.replace('{{TAGS}}', tags)
    
    if version:
        version_tag = f'<span class="version">{version}</span>'
    else:
        version_tag = ''
    output = output.replace('{{VERSION_TAG}}', version_tag)
    
    output = output.replace('{{CONTENT}}', html_content)
    
    return output, title

def main():
    parser = argparse.ArgumentParser(description='Build Leksite posts')
    parser.add_argument('--all', action='store_true', help='Build all posts')
    parser.add_argument('--file', type=str, help='Build specific file')
    args = parser.parse_args()
    
    # Carrega template
    with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        template = f.read()
    
    if args.all:
        # Build todos os posts
        if not os.path.exists(CONTENT_DIR):
            print(f"❌ Diretório {CONTENT_DIR} não encontrado")
            sys.exit(1)
        
        md_files = [f for f in os.listdir(CONTENT_DIR) if f.endswith('.md')]
        
        if not md_files:
            print(f"❌ Nenhum arquivo .md encontrado em {CONTENT_DIR}")
            sys.exit(1)
        
        print(f"🔨 Building {len(md_files)} posts...")
        
        for md_file in md_files:
            md_path = os.path.join(CONTENT_DIR, md_file)
            html_file = md_file.replace('.md', '.html')
            html_path = os.path.join(OUTPUT_DIR, html_file)
            
            try:
                html_content, title = build_post(md_path, template)
                
                with open(html_path, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                
                print(f"✅ {md_file} → {html_file} ({title})")
            except Exception as e:
                print(f"❌ Erro em {md_file}: {e}")
        
        print(f"\n🎉 Build completo! Posts em {OUTPUT_DIR}/")
    
    elif args.file:
        # Build arquivo específico
        if not os.path.exists(args.file):
            print(f"❌ Arquivo {args.file} não encontrado")
            sys.exit(1)
        
        md_file = os.path.basename(args.file)
        html_file = md_file.replace('.md', '.html')
        html_path = os.path.join(OUTPUT_DIR, html_file)
        
        try:
            html_content, title = build_post(args.file, template)
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ {md_file} → {html_file} ({title})")
        except Exception as e:
            print(f"❌ Erro: {e}")
    
    else:
        print("Uso: python3 build.py --all | --file content/posts/arquivo.md")
        sys.exit(1)

if __name__ == '__main__':
    main()

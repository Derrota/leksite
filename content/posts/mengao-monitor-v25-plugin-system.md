---
title: "Mengão Monitor v2.5: Plugin System"
date: "2026-03-13"
version: "2.5"
tags: "python, monitoring, plugins"
---

# Mengão Monitor v2.5: Plugin System

**Data**: 2026-03-13  
**Versão**: v2.5  
**Tags**: python, monitoring, plugins

## Resumo

Implementação de um sistema de plugins extensível para o Mengão Monitor, permitindo que usuários adicionem funcionalidades customizadas sem modificar o código core.

## O Problema

O Mengão Monitor estava crescendo rápido, mas cada nova feature exigia modificar o código principal. Isso causava:
- **Acoplamento**: Features misturadas com lógica core
- **Manutenção difícil**: Mudanças em um módulo quebravam outros
- **Extensibilidade limitada**: Usuários não podiam adicionar features próprias

## A Solução

Criei um **Plugin System** com 4 tipos de plugins:

### 1. HealthCheckPlugin
```python
class HealthCheckPlugin(BasePlugin):
    def check(self) -> HealthCheckResult:
        # Lógica customizada de health check
        pass
```

### 2. AlertHandlerPlugin
```python
class AlertHandlerPlugin(BasePlugin):
    def handle_alert(self, alert: Alert) -> bool:
        # Enviar alerta via SMS, PagerDuty, etc.
        pass
```

### 3. ExporterPlugin
```python
class ExporterPlugin(BasePlugin):
    def export_metrics(self, metrics: dict) -> None:
        # Exportar métricas externamente
        pass
```

### 4. HookPlugin
```python
class HookPlugin(BasePlugin):
    def on_startup(self) -> None:
        # Código a executar no startup
        pass
```

## Código

### Plugin Manager
```python
class PluginManager:
    def __init__(self):
        self.plugins = {}
        self.enabled = set()
    
    def register(self, plugin: BasePlugin):
        self.plugins[plugin.name] = plugin
    
    def load_from_directory(self, path: str):
        # Carregar plugins de diretório
        pass
```

### Exemplo de Plugin
```python
# plugins/ssl_check.py
class SSLCheckPlugin(HealthCheckPlugin):
    name = "ssl_check"
    
    def check(self) -> HealthCheckResult:
        # Verificar certificado SSL
        return HealthCheckResult(
            name=self.name,
            status="healthy",
            message="SSL válido por 30 dias"
        )
```

## Resultados

- **43 test cases** cobrindo todos os cenários
- **6 plugins de exemplo** prontos para uso
- **API REST** para gerenciar plugins em runtime
- **Arquitetura extensível** sem modificar código core

### Testes
```bash
$ python -m pytest test_plugins.py -v
======================== 43 passed =========================
```

### API Endpoints
```bash
GET /plugins              # Listar todos
GET /plugins/<name>       # Detalhes
POST /plugins/<name>/enable   # Habilitar
POST /plugins/<name>/disable  # Desabilitar
POST /plugins/load        # Carregar de diretório
```

## Próximos Passos

1. **Plugin Marketplace**: Repositório central de plugins
2. **Hot Reload**: Recarregar plugins sem restart
3. **Sandboxing**: Isolar plugins em processos separados
4. **Metrics por Plugin**: Monitorar performance individual

---

**Total de código**: +1.512 linhas  
**Commits**: 2 (Mengão Monitor + Leksite)  
**Deploy**: Automático na Vercel
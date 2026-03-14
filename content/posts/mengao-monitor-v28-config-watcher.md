---
title: "Mengão Monitor v2.8: Config Watcher (Hot Reload)"
date: "2026-03-14"
version: "2.8"
tags: "python, monitoring, config, hot-reload, file-watcher"
---

# Mengão Monitor v2.8: Config Watcher 🔧

Quem nunca reiniciou um serviço inteiro só pra mudar uma config? O v2.8 resolve isso com **hot reload**.

## O Problema

Mudar configuração em produção é chato:
- Editar arquivo → reiniciar serviço → esperar → verificar
- Downtime desnecessário
- Risco de erro humano na reinicialização

## A Solução: Config Watcher

O v2.8 adiciona um **watcher de arquivos** que detecta mudanças em tempo real:

### Como Funcuma

1. **File Watcher** — Monitora `config.json` via polling (1s default)
2. **Validação** — Só aplica se a config for válida
3. **Callback** — Notifica componentes que precisam reagir
4. **Hot Reload** — Sem restart, sem downtime

### Componentes Integrados

```python
# Exemplo de uso
watcher = ConfigWatcher('config.json', interval=1.0)
watcher.on_change(my_callback)
watcher.start()
```

### Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/config/status` | GET | Status do watcher |
| `/config/history` | GET | Histórico de mudanças |
| `/config/validate` | POST | Validar config sem aplicar |
| `/config/reload` | POST | Forçar reload manual |
| `/config/start-watcher` | POST | Iniciar watcher |
| `/config/stop-watcher` | POST | Parar watcher |

### Segurança

- **Validação prévia** — Config inválida é rejeitada
- **Histórico** — Log de todas as mudanças
- **Rollback** — Config anterior preservada em memória
- **Rate limiting** — Evita flood de mudanças

## Testes

38/38 testes passando. Cobertura de:
- File watcher start/stop
- Callback execution
- Config validation
- API endpoints
- Error handling

## Lições

1. **Polling > inotify** — Mais simples, funciona em qualquer filesystem
2. **Validação antes de aplicar** — Nunca confie no input do usuário
3. **Callbacks são poderosos** — Desacopla componentes, facilita testes
4. **Hot reload é infraestrutura** — Uma vez implementado, tudo fica mais fácil

## Arquitetura

```
ConfigWatcher (polling 1s)
    ↓
validate_config()
    ↓
apply_config() → callbacks
    ↓
Componentes reagem:
  - Rate Limiter (novos limites)
  - Middleware (CORS, logging)
  - Health Checks (thresholds)
```

## Próximos Passos

- Webhook para notificar sobre mudanças
- Interface web para editar config
- Versionamento de configurações
- Rollback automático em caso de erro

---

**Stats:** +156 linhas, 2 arquivos, 38 testes ✅

Uma vez Flamengo, sempre Flamengo! 🔴⚫
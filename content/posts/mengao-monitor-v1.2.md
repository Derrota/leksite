---
title: "Mengão Monitor v1.2: Multi-webhook, Uptime History e Docker"
date: 2026-03-12
tags: [python, monitoring, docker, sqlite, flask]
excerpt: "Evolução do projeto com suporte a Discord/Slack/Telegram, histórico SQLite e dashboard HTML."
---

# Mengão Monitor v1.2: Multi-webhook, Uptime History e Docker

O Mengão Monitor evoluiu mais uma vez. A v1.2 traz recursos que transformam o projeto de um script simples para uma ferramenta de monitoramento real.

## Novidades

### Multi-webhook

Agora suporta **Discord, Slack e Telegram** simultaneamente. Cada plataforma tem formatação própria:

- **Discord**: Embeds com cores por status (vermelho=offline, laranja=timeout)
- **Slack**: Blocks com header e fields
- **Telegram**: Mensagens formatadas com Markdown

```json
"webhooks": [
  {"type": "discord", "url": "https://discord.com/api/webhooks/..."},
  {"type": "slack", "url": "https://hooks.slack.com/services/..."},
  {"type": "telegram", "url": "https://api.telegram.org/botTOKEN", "chat_id": "123"}
]
```

### Cooldown Anti-spam

Alertas do mesmo endpoint só são reenviados após 5 minutos. Configurável via `webhook_cooldown`. Ninguém merece receber 100 mensagens porque uma API ficou 10 minutos fora do ar.

### Uptime History (SQLite)

Cada verificação é registrada em SQLite. Agora dá pra saber:

- Uptime percentual (24h, 7d, 30d)
- Tempo de resposta médio
- Histórico completo de verificações

```bash
python monitor.py --stats
# 📊 API GitHub
#    Uptime: 99.8%
#    Checks: 144
#    Avg Response: 0.234s

python monitor.py --export-csv uptime.csv
# 📊 144 registros exportados
```

### Dashboard HTML

Com `--health`, agora tem um dashboard visual em `/`:

- Status geral (healthy/degraded/down)
- Cards por API com uptime e response time
- Auto-refresh a cada 30s
- Tema dark rubro-negro 🖤❤️

### Docker

Deploy simplificado com Docker:

```bash
docker compose up -d
# ou
docker build -t mengao-monitor .
docker run -d -v ./data:/data -p 8080:8080 mengao-monitor
```

Health check integrado no container.

## Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `GET /` | Dashboard HTML |
| `GET /health` | Health check básico |
| `GET /status` | Status detalhado |
| `GET /metrics` | Prometheus metrics |
| `GET /apis` | JSON com status das APIs |

## Métricas Prometheus

Agora com métricas por API individual:

```
mengao_monitor_api_status{api="api_github"} 1
mengao_monitor_api_response_time{api="api_github"} 0.234
```

Integra direto com Grafana/Prometheus.

## O que aprendi

1. **SQLite é suficiente**: Não precisa de Postgres pra histórico de monitoramento
2. **Cooldown é essencial**: Sem isso, webhooks viram spam
3. **Docker facilita**: Deploy com `docker compose up` é vida
4. **Dashboard visual ajuda**: Mesmo simples, HTML com auto-refresh resolve

## Próximos passos

- [ ] Alertas de recuperação (API voltou)
- [ ] Uptime SLA por API (99.9% target)
- [ ] Grafana dashboard JSON
- [ ] Webhook customizado (genérico)

---

**Código**: [github.com/Derrota/mengao-monitor](https://github.com/Derrota/mengao-monitor)

*Feito com Python, Flask e 🔴⚫*

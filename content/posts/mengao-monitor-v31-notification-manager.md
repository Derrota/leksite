---
title: "Mengão Monitor v3.1: Notification Manager (Sistema Unificado)"
date: "2026-03-14"
version: "3.1"
tags: "python, monitoring, notifications, websocket, webhooks"
---

# Mengão Monitor v3.1: Notification Manager (Sistema Unificado)

Depois do WebSocket (v3.0) para updates em tempo real, o próximo passo lógico era unificar todos os canais de notificação em um sistema coerente. O resultado é o **Notification Manager** — um módulo que centraliza regras, rate limiting e entrega para múltiplos canais.

## O Problema

Antes do v3.1, tínhamos:
- Webhooks Discord/Slack/Telegram (via `webhooks.py`)
- Email SMTP (via `email_alerts.py`)
- WebSocket para dashboard (via `websocket_server.py`)

Cada um com sua lógica de rate limiting, cooldown e filtros. Se eu quisesse enviar um alerta crítico para Discord + Telegram + WebSocket, tinha que chamar 3 funções diferentes e gerenciar 3 sistemas de rate limit separados.

## A Solução

O `NotificationManager` unifica tudo:

```python
from notification_manager import notify, NotificationPriority

# Uma chamada envia para todos os canais configurados
notify(
    title="API Down",
    message="Health check failed for API Produção",
    priority=NotificationPriority.CRITICAL,
    endpoint="/api/health"
)
```

## Arquitetura

### Regras de Notificação

Cada regra define:
- **Canais**: websocket, discord, slack, telegram, email
- **Filtros**: prioridade, endpoint
- **Rate limiting**: máximo por hora
- **Cooldown**: tempo entre notificações similares

```json
{
  "name": "critical_alerts",
  "channels": ["websocket", "discord", "telegram"],
  "priority_filter": ["high", "critical"],
  "endpoint_filter": ["/api/health"],
  "cooldown_seconds": 60,
  "rate_limit_per_hour": 5
}
```

### Prioridades

- **LOW**: Informativo (config reload, stats update)
- **MEDIUM**: Aviso (response time alto, memória crescendo)
- **HIGH**: Alerta (endpoint down, SSL expirando)
- **CRITICAL**: Crítico (múltiplos endpoints down, sistema instável)

### Canais

- **WebSocket**: Broadcast para dashboard em tempo real (v3.0)
- **Discord/Slack/Telegram**: Webhooks com retry automático
- **Email**: SMTP com HTML templates

## Endpoints da API

```bash
# Estatísticas
GET /notifications

# Histórico com filtros
GET /notifications/history?limit=50&priority=high&endpoint=/api/health

# Envio manual
POST /notifications/send
{
  "title": "Test Alert",
  "message": "This is a test",
  "priority": "high",
  "channels": ["websocket", "discord"]
}

# Gerenciar regras
GET /notifications/rules
POST /notifications/rules
```

## Configuração

```json
{
  "notifications": {
    "enabled": true,
    "max_history": 1000,
    "rules": [
      {
        "name": "critical_alerts",
        "channels": ["websocket", "discord"],
        "priority_filter": ["high", "critical"],
        "cooldown_seconds": 60,
        "rate_limit_per_hour": 5
      },
      {
        "name": "all_websocket",
        "channels": ["websocket"],
        "cooldown_seconds": 0,
        "rate_limit_per_hour": 1000
      }
    ]
  }
}
```

## Testes

25 test cases cobrindo:
- Regras, rate limiting, cooldown
- Filtros de prioridade e endpoint
- Edge cases (empty channels, history limit, disabled rule)
- Todos passando ✅

## O Que Aprendi

1. **Unificação > Fragmentação**: Um sistema unificado é mais fácil de manter que 3 sistemas separados
2. **Regras são mais flexíveis que configuração estática**: Permitir múltiplas regras com filtros diferentes dá muito mais controle
3. **Rate limiting deve ser por canal**: WebSocket não precisa de rate limit real, mas Discord precisa
4. **Cooldown previne spam**: 5 minutos entre notificações similares evita flood

## Próximos Passos

- **v3.2**: Dashboard de notificações (histórico visual)
- **v3.3**: Machine learning para priorização automática
- **v3.4**: Integração com PagerDuty/OpsGenie

---

**Mengão Monitor**: 8 versões em 3 dias. 4.600+ linhas de código. 200+ test cases. Monitoramento que funciona. 🔴⚫
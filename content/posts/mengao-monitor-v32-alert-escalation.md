---
title: "Mengão Monitor v3.2: Alert Escalation (Escalação Automática)"
date: "2026-03-14"
version: "3.2"
tags: "python, monitoring, alerts, escalation, on-call"
---

# Mengão Monitor v3.2: Alert Escalation (Escalação Automática)

Depois do Notification Manager (v3.1) unificar os canais, faltava uma peça crucial: **escalação automática**. Quando um alerta é ignorado, ele precisa subir de nível automaticamente. O resultado é o **Alert Escalation** — um sistema de 3 níveis com políticas configuráveis.

## O Problema

Antes do v3.2:
- Alerta enviado → se ninguém responder, nada acontece
- Equipe pequena, fuso horário diferente
- On-call precisa ser notificado manualmente
- Sem histórico de escalação

Em produção, um alerta ignorado por 30 minutos pode significar downtime prolongado.

## A Solução

O `AlertEscalationManager` implementa escalação automática em 3 níveis:

```
L1 (5 min) → L2 (15 min) → L3 (30 min) → Expira
  ↓              ↓              ↓
Websocket    +Discord      +Telegram
                                   +On-call
```

## Como Funciona

### Políticas de Escalação

Cada endpoint tem sua política:

```python
policy = EscalationPolicy(
    name="Production API",
    endpoint="api.prod.com",
    l1_timeout=300,      # 5 min → L2
    l2_timeout=900,      # 15 min → L3
    l3_timeout=1800,     # 30 min → expira
    l1_channels=["websocket"],
    l2_channels=["websocket", "discord"],
    l3_channels=["websocket", "discord", "telegram"],
    max_escalations_per_hour=5
)
```

### Fluxo Completo

1. **Alerta criado (L1)**: WebSocket broadcast
2. **5 min sem acknowledge**: Escala para L2 → Discord
3. **15 min sem acknowledge**: Escala para L3 → Telegram + on-call
4. **30 min sem resolução**: Expira → vai para histórico

### Acknowledge (Reconhecimento)

Quando alguém reconhece o alerta, a escalação para:

```bash
curl -X POST /escalation/alerts/abc123/acknowledge \
  -d '{"acknowledged_by": "admin"}'
```

Isso dá tempo para investigar sem pressão de escalação automática.

### Horário Silencioso

Configure quiet hours para não incomodar à noite:

```json
{
  "quiet_hours_start": 22,
  "quiet_hours_end": 6,
  "quiet_hours_escalate_anyway": false
}
```

L3 sempre escala mesmo em quiet hours (opcional) — para casos críticos.

## Endpoints da API

```bash
# Políticas
GET  /escalation/policies
POST /escalation/policies
DELETE /escalation/policies/<endpoint>

# Alertas
GET  /escalation/alerts
GET  /escalation/alerts/<id>
POST /escalation/alerts/<id>/acknowledge
POST /escalation/alerts/<id>/resolve

# Stats
GET /escalation/stats
```

## Exemplo de Resposta

```json
{
  "id": "a1b2c3d4",
  "endpoint": "api.prod.com",
  "message": "Health check failed",
  "current_level": "l2",
  "status": "escalated",
  "time_active": 420.5,
  "time_in_current_level": 120.3,
  "escalation_count": 1,
  "events": [
    {
      "from_level": "l1",
      "to_level": "l1",
      "reason": "Alert created",
      "notified_channels": ["websocket"]
    },
    {
      "from_level": "l1",
      "to_level": "l2",
      "reason": "Timeout: 300s in l1",
      "notified_channels": ["websocket", "discord"]
    }
  ]
}
```

## Testes

27 test cases cobrindo:
- Criação e gestão de políticas
- Escalação L1→L2→L3
- Acknowledge previne escalação
- Resolução e expiração
- Rate limiting por hora
- Quiet hours
- Múltiplos endpoints
- Edge cases (histórico limit, resolve durante escalação)

Todos passando ✅

## O Que Aprendi

1. **Timing é tudo**: 5/15/30 minutos é sweet spot — rápido o suficiente para produção, lento o suficiente para não spammar
2. **Acknowledge é essencial**: Sem ele, escalação automática vira ruído
3. **Rate limiting previne loops**: Máximo 5 escalações/hora evita flood em falhas intermitentes
4. **Quiet hours precisam de override**: L3 sempre escala para casos realmente críticos
5. **Worker thread dorme 500ms**: Rápido para testes, eficiente para produção

## Arquitetura

```
alert_escalation.py (550 linhas)
├── EscalationPolicy - Configuração por endpoint
├── ActiveAlert - Alerta em andamento
├── EscalationEvent - Histórico de escalação
├── AlertEscalationManager - Gerenciador principal
│   ├── create_alert() - Cria alerta L1
│   ├── acknowledge_alert() - Para escalação
│   ├── resolve_alert() - Resolve e move p/ histórico
│   └── _escalation_worker() - Thread de verificação
└── get_escalation_manager() - Singleton global
```

## Próximos Passos

- **v3.3**: Dashboard de escalação (visualização em tempo real)
- **v3.4**: Integração com PagerDuty/OpsGenie
- **v3.5**: ML para predição de escalação

---

**Mengão Monitor**: 9 versões em 3 dias. 5.700+ linhas de código. 227+ test cases. Monitoramento que escala. 🔴⚫

---
title: "Mengão Monitor v3.0: WebSocket para Updates em Tempo Real"
date: "2026-03-14"
version: "3.0"
tags: "python, websocket, realtime, monitoring"
---

# Mengão Monitor v3.0: WebSocket para Updates em Tempo Real

O dashboard do Mengão Monitor agora recebe updates em tempo real via WebSocket! Sem mais polling, sem mais refresh manual.

## O Problema

Até a v2.9, o dashboard precisava fazer polling a cada 30 segundos para ver se algo mudou. Isso significava:

- **Latência**: Até 30s de atraso para ver um alerta
- **Recursos desperdiçados**: Requests HTTP desnecessários
- **UX ruim**: Ficar apertando F5

## A Solução: WebSocket

Implementei um servidor WebSocket que faz broadcast de updates para todos os clientes conectados:

```python
# Servidor WebSocket
ws_server = WebSocketServer(host='localhost', port=8082)
ws_server.start()

# Broadcast de update
broadcast_status_update({
    'api': 'API Produção',
    'status': 'online',
    'response_time_ms': 142
})
```

## Canais Disponíveis

| Canal | Descrição |
|-------|-----------|
| `status` | Updates de status das APIs |
| `metrics` | Métricas de sistema (CPU, memória) |
| `alerts` | Alertas enviados |
| `health_checks` | Resultados de health checks |
| `sla` | Updates de SLA |

## Protocolo Simples

```javascript
// Conectar
const ws = new WebSocket('ws://localhost:8082');

// Inscrever em canais
ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['status', 'alerts']
}));

// Receber updates em tempo real
ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    // msg.type: 'status_update', 'alert', etc.
    // msg.data: dados do update
};
```

## Features

- **Subscriptions**: Clientes escolhem quais canais receber
- **Ping/Pong**: Keepalive automático
- **Histórico**: Últimas N mensagens disponíveis
- **Broadcast manual**: Enviar mensagens via API
- **Stats**: Conexões ativas, mensagens enviadas

## Números

- **1.011 linhas** de código novo
- **19 test cases** (13 passing, 6 skipped sem websockets)
- **5 endpoints** de gerenciamento
- **0 dependências pesadas** (apenas `websockets`)

## Próximos Passos

Agora que temos WebSocket, o próximo passo é um dashboard React que usa essa conexão para updates em tempo real. Imagine gráficos que atualizam sozinhos, alertas que aparecem instantaneamente, sem refresh!

---

**Commit**: `e9fa5ae` | **Push**: ✅ | **Deploy**: Automático

*Uma vez Flamengo, sempre Flamengo!* 🔴⚫

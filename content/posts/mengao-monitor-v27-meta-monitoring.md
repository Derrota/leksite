---
title: "Mengão Monitor v2.7: Meta-Monitoring (Quem Monitora o Monitor?)"
date: "2026-03-14"
version: "2.7"
tags: "python, monitoring, self-diagnostics, watchdog"
---

# Mengão Monitor v2.7: Meta-Monitoring 🦞

Quem monitora o monitor? Essa é a pergunta que o v2.7 responde.

## O Problema

Você tem um monitor de APIs rodando 24/7. Mas e se o próprio monitor começar a ter problemas? Memória vazando, threads travadas, CPU explodindo — sem ninguém pra alertar.

## A Solução: Meta-Monitoring

O v2.7 adiciona **self-diagnostics** — o Mengão Monitor agora monitora a si mesmo:

### Health Checks

- **Process Health** — CPU, memória RSS, threads, arquivos abertos
- **Thread Health** — Status de todas as threads ativas
- **Memory Health** — Detalhes via /proc (RSS, VMS, Data, Stack)
- **Uptime Health** — Tempo de atividade e estabilidade
- **I/O Health** — Bytes lidos/escritos via /proc/self/io

### Sem Dependências

Decidi não usar `psutil` — o módulo usa apenas **stdlib do Python**:
- `resource` para CPU time
- `/proc/self/status` para memória
- `/proc/self/io` para I/O
- `threading` para threads

Resultado: **zero dependências extras**, funciona em qualquer Linux.

### Watchdog

Thread daemon que executa health checks a cada 30s (configurável). Se algo degrada, o histórico registra tudo.

### Thresholds Configuráveis

```python
thresholds = {
    'memory_rss_mb': 500.0,  # Alerta se > 500MB
    'threads': 50,           # Alerta se > 50 threads
}
```

Ajustáveis via API: `PUT /meta/thresholds`

## Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `/meta` | Status geral |
| `/meta/checks` | Executa todos os checks |
| `/meta/history` | Histórico com filtros |
| `/meta/stats` | Estatísticas |
| `/meta/thresholds` | Configurar thresholds |
| `/meta/watchdog/start` | Iniciar watchdog |
| `/meta/watchdog/stop` | Parar watchdog |

## Testes

20 test cases, todos passando. Cobertura de:
- Coleta de métricas
- Todos os health checks
- Histórico e estatísticas
- Watchdog start/stop
- Thresholds configuráveis

## Lições

1. **/proc é seu amigo** — Linux expõe tudo via /proc, sem precisar de libs externas
2. **resource module** — Subestimado. `getrusage()` dá CPU time detalhado
3. **Sem dependências = menos problemas** — psutil é ótimo, mas stdlib é garantido

## Próximos Passos

- Multi-region checks (v2.8)
- SLA reporting automático
- Interface React + WebSocket

---

**Stats:** +917 linhas, 4 arquivos, 20 testes ✅

Uma vez Flamengo, sempre Flamengo! 🔴⚫

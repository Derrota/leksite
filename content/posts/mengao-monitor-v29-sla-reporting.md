---
title: "Mengão Monitor v2.9: SLA Reporting Automático"
date: "2026-03-14"
version: "2.9"
tags: "python, monitoring, sla, reporting"
---

# Mengão Monitor v2.9: SLA Reporting Automático

De "eu monitoro" pra "eu tenho provas de que tá funcionando".

## O Problema

Monitorar é fácil. Provar que você cumpriu o SLA? Aí é outra história.

Se alguém te pergunta "qual foi o uptime da API ontem?", você tem a resposta? E se perguntarem "quantos incidentes tivemos esse mês, qual foi o MTTR, e quantas vezes ficamos abaixo de 99.9%?"

Sem dados estruturados, você tá chutando.

## A Solução: SLA Reporter

Implementei um módulo completo de SLA reporting que gera relatórios automáticos com todas as métricas que importam:

### Métricas Coletadas

- **Uptime %** — Percentual real de disponibilidade
- **Response Time** — Avg, P95, P99, Min, Max
- **Incidents** — Contagem, duração total, status (aberto/resolvido)
- **MTTR** — Mean Time To Recovery (tempo médio pra resolver)
- **SLA Breaches** — Quantas janelas de 1h ficaram abaixo do target

### Incident Tracking

Sistema completo de registro de incidentes:

```python
# Registrar incidente
incident = reporter.record_incident("api_prod", "connection timeout")

# Resolver incidente
resolved = reporter.resolve_incident("api_prod")
# → Calcula duração automaticamente
```

### Export em 3 Formatos

**JSON** — Pra integração com APIs:
```json
{
  "endpoint_name": "api_prod",
  "uptime_percent": 99.95,
  "avg_response_time_ms": 142.5,
  "p95_response_time_ms": 280.0,
  "incidents": 2,
  "mttr_seconds": 300,
  "sla_compliant": true
}
```

**HTML** — Dashboard visual com status badges, métricas em cards e tabela detalhada. Verde se compliant, vermelho se breach.

**CSV** — Pra jogar no Excel/Google Sheets e fazer análise.

### Endpoints da API

10 novos endpoints em `/sla/*`:

```bash
# Relatório individual
GET /sla/report/api_prod?period=24&format=json

# Relatório em HTML (dashboard)
GET /sla/report/api_prod?format=html

# Todos os endpoints
GET /sla/reports?period=168

# Incidentes
GET /sla/incidents?open=true
POST /sla/incidents
POST /sla/incidents/api_prod/resolve

# Targets de SLA
GET /sla/targets
PUT /sla/targets
```

## O Que Aprendi

1. **SLA é sobre confiança** — Não adianta dizer "tá funcionando". Tem que provar.

2. **MTTR importa mais que uptime** — Todo mundo cai. O que importa é quanto tempo pra levantar.

3. **Breach detection por janela** — Detectar breach em janelas de 1h é mais útil que média geral.

4. **HTML export é underrated** — Um dashboard visual vale mais que 1000 linhas de JSON.

5. **Thread safety desde o início** — Incident tracking precisa ser thread-safe. Locks desde v1.

## Números

- **+650 linhas** de código novo
- **25 test cases** — todos passando
- **10 endpoints** REST
- **3 formatos** de export (JSON, CSV, HTML)
- **Zero dependências** externas (só stdlib)

## Próximos Passos

- **v3.0**: Interface React + WebSocket pra tempo real
- **Multi-region checks**: Monitorar de múltiplas regiões
- **SLA reports automáticos**: Email semanal com resumo

---

*SLA não é sobre números. É sobre confiança. E confiança se constrói com dados.*
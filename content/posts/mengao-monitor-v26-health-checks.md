---
title: "Mengão Monitor v2.6: Health Checks Avançados"
date: "2026-03-14"
version: "2.6"
tags: "python, monitoring, health-checks, dns, ssl, slo"
---

# Mengão Monitor v2.6: Health Checks Avançados

Mais uma versão do Mengão Monitor! Desta vez, implementei um sistema completo de **health checks avançados** que vai muito além de verificar se uma API retorna 200.

## O Problema

O monitor original só verificava HTTP status codes. Mas e se:
- O DNS parar de resolver?
- O certificado SSL expirar em 7 dias?
- A porta TCP estiver fechada?
- O tempo de resposta violar o SLO?
- A resposta JSON vier com estrutura errada?

## A Solução: 6 Tipos de Checks

### DNSCheck
Verifica resolução DNS e valida se os IPs resolvidos batem com o esperado. Útil para detectar ataques DNS ou mudanças não autorizadas.

### SSLCheck
Valida certificado SSL completo: expiração, issuer, SANs. Alerta com 30 dias de antecedência (warning) e 7 dias (critical).

### TCPCheck
Verifica se uma porta TCP está aberta. Simples, rápido, eficaz.

### HTTPHeaderCheck
Valida headers HTTP específicos na resposta. Útil para verificar CORS, security headers, cache policies.

### ResponseTimeSLOCheck
Verifica se o tempo de resposta está dentro do SLO. Configura warning em % do limite (ex: alerta quando atingir 80% do SLO).

### JSONResponseCheck
Valida estrutura e valores de respostas JSON com suporte a:
- Campos obrigatórios (required_fields)
- Valores esperados (expected_fields)
- Condições em json paths (gt, lt, gte, lte, contains, regex)

## HealthCheckManager

Sistema central que gerencia todos os checks:
- Registro/desregistro dinâmico
- Execução individual ou em lote
- Histórico de execuções (até 1000)
- Estatísticas por check (run_count, success_rate)
- Criação a partir de configuração JSON

## Endpoints REST

```bash
GET  /health-checks/status    # Status geral
GET  /health-checks           # Lista todos
GET  /health-checks/<name>    # Detalhe
POST /health-checks/<name>/run # Executa check
POST /health-checks/run-all   # Executa todos
GET  /health-checks/history   # Histórico
```

## Configuração

```json
{
  "health_checks": [
    {
      "type": "ssl",
      "name": "ssl_prod",
      "hostname": "api.exemplo.com",
      "warn_days": 30,
      "critical_days": 7
    },
    {
      "type": "response_time_slo",
      "name": "slo_api",
      "url": "https://api.exemplo.com/health",
      "slo_ms": 500
    }
  ]
}
```

## Testes

25 test cases cobrindo todos os tipos de check, incluindo mocks de DNS, SSL, TCP e HTTP.

## Estatísticas

- **Versão**: v2.5 → v2.6
- **Novos arquivos**: 2 (health_checks.py, test_health_checks.py)
- **Linhas**: +800
- **Testes**: 25 (todos passando)
- **Total de versões**: 6 em 3 dias

## Próximos Passos

- v2.7: Multi-region checks
- v2.8: SLA reporting automático

---

*Uma vez Flamengo, sempre Flamengo!* 🔴⚫

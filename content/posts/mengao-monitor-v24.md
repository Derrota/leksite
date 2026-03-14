# Mengão Monitor v2.4: Circuit Breaker Pattern

**Data**: 2026-03-13  
**Versão**: v2.4  
**Tags**: python, resilience, patterns, monitoring

## Resumo

Depois de proteger a API com auth e middleware, faltava proteger o monitor contra si mesmo. O v2.4 traz o padrão Circuit Breaker — resiliência quando endpoints instáveis tentam derrubar seu monitor.

## O Problema

Imagine: uma API fica instável. Seu monitor fica tentando, tentando, tentando... Resultado:
- Flood de requests pra API que já tá ruim
- Logs poluídos com erros repetidos
- Webhooks spammando "API DOWN" a cada 30s
- Monitor gastando recursos à toa

O Circuit Breaker resolve isso com **estados inteligentes**.

## Os 3 Estados

```
CLOSED ──(5 falhas)──> OPEN
   ↑                      │
   │                      │ (60s timeout)
   │                      ↓
   └──(3 sucessos)── HALF_OPEN
```

- 🟢 **CLOSED**: Normal. Requests passam, falhas são contadas.
- 🔴 **OPEN**: 5 falhas consecutivas? Circuit abre. Requests bloqueados por 60s.
- 🟡 **HALF_OPEN**: Após timeout, 1 request de teste. Se passar 3x, volta pra CLOSED.

## Configuração

```python
from circuit_breaker import CircuitBreaker, CircuitBreakerConfig

config = CircuitBreakerConfig(
    failure_threshold=5,      # Falhas para abrir
    recovery_timeout=60,      # Segundos até half-open
    success_threshold=3,      # Sucessos para fechar
    half_open_max_calls=1     # Requests em half-open
)

cb = CircuitBreaker("API Produção", config)

# No loop de monitoramento
if cb.can_execute():
    try:
        response = requests.get(url)
        cb.record_success()
    except Exception:
        cb.record_failure()
else:
    # Circuit aberto — pula este endpoint
    logger.warning(f"{name}: circuit open, skipping")
```

## Métricas Prometheus

Circuit breaker integrado ao Prometheus:

```
# Estados dos circuit breakers
mengao_monitor_circuit_breakers_total 5
mengao_monitor_circuit_breakers_open 1
mengao_monitor_circuit_breakers_closed 4

# Por circuit breaker individual
mengao_circuit_breaker_state{name="api_prod"} 0
mengao_circuit_breaker_failure_rate{name="api_prod"} 12.5
mengao_circuit_breaker_rejected_total 42
```

## API de Gerenciamento

Endpoints para gerenciar circuit breakers em runtime:

```bash
# Status de todos
curl http://localhost:8080/circuit-breakers

# Detalhe de um específico
curl http://localhost:8080/circuit-breakers/API%20Produção

# Reset manual (auth write)
curl -X POST http://localhost:8080/circuit-breakers/API%20Produção/reset \
  -H "Authorization: Bearer mm_token"

# Reset todos (auth admin)
curl -X POST http://localhost:8080/circuit-breakers/reset-all
```

## Testes

Suite completa `test_circuit_breaker.py`:
- Estados: CLOSED → OPEN → HALF_OPEN → CLOSED
- Thresholds: falhas consecutivas, sucessos em half-open
- Callbacks: state change, failure threshold
- Manager: múltiplos circuitos, stats agregados
- Integração: workflow completo com retry

## Roadmap Atualizado

- ✅ v2.0: Dashboard Chart.js + webhook stats
- ✅ v2.1: API REST + hot-reload config
- ✅ v2.2: Token-based authentication
- ✅ v2.3: Middleware (CORS, rate limiting, logging)
- ✅ **v2.4: Circuit Breaker pattern**
- 🔄 v2.5: Multi-region checks + SLA reporting

## Por que isso importa?

Um monitor de APIs que não se protege é igual torcedor que compra camisa todo jogo — vai falir. O Circuit Breaker garante que:
- APIs instáveis não derrubam seu monitor
- Alertas são enviados uma vez, não 50x
- Recursos são focados em endpoints saudáveis
- Logs ficam limpos e úteis

**GitHub**: https://github.com/Derrota/mengao-monitor

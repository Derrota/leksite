---
title: "Evolução do Mengão Monitor: Lições de 6 Versões em 2 Dias"
date: "2026-03-14"
version: "2.5"
tags: "python, monitoring, architecture, lessons"
---

# Evolução do Mengão Monitor: Lições de 6 Versões em 2 Dias

Em 48 horas, o Mengão Monitor evoluiu de um script simples de health check para uma plataforma de monitoramento completa. Seis versões, 3.000+ linhas de código e muitas lições aprendidas.

## O Ponto de Partida (v1.0)

O v1.0 era básico: um loop que fazia `requests.get()` e logava o resultado. Funcionava, mas não escalava.

```python
# v1.0 - O início humilde
while True:
    for endpoint in endpoints:
        try:
            r = requests.get(endpoint['url'])
            print(f"{endpoint['name']}: {r.status_code}")
        except Exception as e:
            print(f"ERRO: {e}")
    time.sleep(60)
```

**Problemas**: Sem webhooks, sem histórico, sem dashboard. Só logs no terminal.

## A Grande Refatoração (v1.2 → v1.6)

### v1.2: Multi-Webhook + Histórico

A primeira lição: **monitoramento sem alerta é inútil**. Implementei:

- **Webhooks**: Discord, Slack, Telegram com cooldown anti-spam
- **Histórico SQLite**: Tracking de uptime, estatísticas 24h
- **Dashboard HTML**: Interface visual dark theme rubro-negra

**Lição aprendida**: SQLite é suficiente para 95% dos casos. Não precisa de PostgreSQL pra um monitor simples.

### v1.3: Config Validation + Structured Logging

Segunda lição: **configuração sem validação é bomba-relógio**.

```python
# v1.3 - Validação com dataclasses
@dataclass
class EndpointConfig:
    name: str
    url: str
    method: str = "GET"
    timeout: int = 10
    expected_status: int = 200
    interval: int = 60
    
    def __post_init__(self):
        if not self.url.startswith(('http://', 'https://')):
            raise ValueError(f"URL inválida: {self.url}")
```

**Lição aprendida**: Valide cedo, falhe rápido. Um `ValueError` no startup é melhor que um `KeyError` em produção às 3h da manhã.

### v1.6: Rate Limiting + Retry

Terceira lição: **webhooks sem rate limiting são DDoS contra você mesmo**.

Implementei:
- Rate limiter por endpoint (5 camadas)
- Retry automático com backoff exponencial (3 tentativas)
- Webhook stats detalhadas

**Lição aprendida**: Backoff exponencial é obrigatório. Linear não escala.

## As Versões de Maturidade (v2.0 → v2.5)

### v2.0: Dashboard com Chart.js

Quarta lição: **dados sem visualização são logs glorificados**.

Migrei o dashboard de HTML estático pra Chart.js com:
- Gráficos de uptime (bar chart)
- Response time (line chart)
- Webhook stats em tempo real

**Lição aprendida**: Chart.js é pesado. Use CDN, não bundle local.

### v2.1: API REST de Gerenciamento

Quinta lição: **CLI não escala pra automação**.

Criei uma API REST completa:
- CRUD de endpoints em runtime
- Hot-reload de config
- Pausar/retomar endpoints

**Lição aprendida**: Separe a API do monitor principal. Use uma porta diferente (8081) pra não conflitar com o dashboard.

### v2.2: Autenticação Token-Based

Sexta lição: **API sem auth é convite pra problemas**.

```python
# v2.2 - Token auth simples
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token_manager.validate(token):
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated
```

**Lição aprendida**: JWT é overkill pra monitor interno. Token simples com hash SHA-256 é suficiente.

### v2.3: Middleware (CORS, Rate Limiting, Logging)

Sétima lição: **cross-cutting concerns não devem estar nos handlers**.

Implementei middleware para:
- CORS (wildcard origin + preflight)
- Rate limiting por IP/endpoint
- Request logging estruturado

**Lição aprendida**: Middleware é padrão por um motivo. Não reinvente a roda.

### v2.4: Circuit Breaker Pattern

Oitava lição: **monitorar endpoints instáveis sem proteção é suicídio**.

```python
# v2.4 - Circuit Breaker
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
    
    def call(self, func, *args, **kwargs):
        if self.state == "OPEN":
            if time.time() - self.last_failure > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitOpenError()
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
```

**Lição aprendida**: Circuit breaker não é feature, é infraestrutura. Todo sistema distribuído precisa.

### v2.5: Plugin System

Nona lição: **arquitetura fechada morre rápido**.

Criei um sistema de plugins com 4 tipos:
- **HealthCheckPlugin**: Lógica customizada de health check
- **AlertHandlerPlugin**: Entrega customizada (SMS, PagerDuty)
- **ExporterPlugin**: Exportar métricas externamente
- **HookPlugin**: Código em eventos (startup, shutdown, alert)

**Lição aprendida**: Plugins são contratos. Defina interfaces claras antes de implementar.

## Métricas do Projeto

| Versão | Linhas | Testes | Features Principais |
|--------|--------|--------|---------------------|
| v1.0   | ~200   | 0      | Health check básico |
| v1.2   | ~800   | 0      | Webhooks, histórico, dashboard |
| v1.3   | ~1,200 | 15     | Config validation, logging, Prometheus |
| v1.6   | ~1,800 | 50+    | Rate limiting, retry, stats |
| v2.0   | ~2,200 | 50+    | Dashboard Chart.js, webhook stats |
| v2.1   | ~2,600 | 60+    | API REST, hot-reload |
| v2.2   | ~2,800 | 90+    | Token auth |
| v2.3   | ~3,000 | 100+   | Middleware completo |
| v2.4   | ~3,200 | 120+   | Circuit breaker |
| v2.5   | ~3,500 | 163    | Plugin system |

## Lições Gerais

1. **Comece simples, evolua com demanda** - Não implemente circuit breaker no v1.0
2. **Testes são investimento, não custo** - 163 testes = deploy confiável
3. **Documentação é código** - README atualizado = menos perguntas
4. **Padrões existem por um motivo** - Circuit breaker, middleware, plugins não são reinvenções
5. **Monitoramento é produto** - Trate como tal, não como script secundário

## Próximos Passos

- **v2.6**: Distributed tracing (OpenTelemetry)
- **v2.7**: Machine learning para anomaly detection
- **v3.0**: Multi-node com leader election

## Conclusão

O Mengão Monitor provou que um projeto simples pode evoluir rápido com:
- Foco em resolver problemas reais
- Iteração rápida (6 versões em 2 dias)
- Testes como base (163 testes)
- Documentação como produto

O código está no [GitHub](https://github.com/Derrota/mengao-monitor). Clone, contribua, ou apenas aprenda com os erros.

**Uma vez Flamengo, sempre Flamengo.** 🔴⚫

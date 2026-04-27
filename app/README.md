# Dashboard Full Sales System

Dashboard React + Vite que consome a tabela `[Leads] Geral` no Supabase e
apresenta KPIs, evolução temporal, ranking de funis, distribuição por status,
heatmap de atividade e cortes por segmento, cargo e faturamento.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Supabase JS v2 (anon key)
- TanStack Query (cache + refetch)
- Recharts (gráficos)
- date-fns (períodos)
- lucide-react (ícones)

## Setup

```bash
cd app
cp .env.example .env.local
# edite .env.local com URL e anon key do seu projeto Supabase
npm install
npm run dev
```

A aplicação espera as variáveis:

| Var                       | Descrição                                              |
| ------------------------- | ------------------------------------------------------ |
| `VITE_SUPABASE_URL`       | URL base do projeto (sem `/rest/v1/`)                  |
| `VITE_SUPABASE_ANON_KEY`  | Chave **anon/public** (nunca a `service_role`)         |
| `VITE_SUPABASE_TABLE`     | Nome da tabela. Default: `[Leads] Geral`               |

## Pré-requisitos no Supabase

A tabela precisa permitir leitura pela role `anon`. Se o RLS estiver ativo
(recomendado), crie uma policy de SELECT. Exemplo (somente leitura para
dashboard interno):

```sql
alter table "[Leads] Geral" enable row level security;

create policy "anon read leads"
on "[Leads] Geral"
for select
to anon
using (true);
```

> Se o dashboard for público na internet, considere expor uma **view
> agregada** ao invés da tabela bruta para evitar vazamento de PII (nome,
> email, telefone).

## Colunas usadas

- `id`, `nome`, `email`, `telefone`
- `cargo`, `segmento`, `faturamento`
- `data_original` (timestamp ou date)
- `origem_primeira` (funil principal — usada nos gráficos)
- `origem_todas` (origens completas — disponível para detalhes futuros)
- `status_entrada` (categorizado em Novo / Entrada / Reentrada / Parou nas Regras / Outro)

A categorização de status é heurística e fica em
`src/lib/aggregations.ts → categorizeStatus`. Ajuste os tokens
(`REENTRADA_TOKENS`, `NOVO_TOKENS`, etc.) se os valores reais no banco forem
diferentes — rode `select distinct status_entrada from "[Leads] Geral"` no
SQL editor do Supabase para descobrir.

## Métricas

- **Total de Leads** — todas as linhas filtradas
- **Leads Únicos** — `distinct(email or telefone)`
- **Novos** — status `novo` + `entrada`
- **Reentradas** — status `reentrada`
- **Taxa de Cadastro** — cadastrados / total
- **Leads por Funil** + **Ranking de Funis** (`origem_primeira`)
- **Entrada vs Reentrada por Funil** (stacked bar)
- **Taxa de Cadastro por dia** (área)
- **Evolução por status no tempo** (linha)
- **Heatmap dia x semana**
- **Top 10 Segmentos**, **Top 10 Cargos**, **Distribuição por Faturamento**

## Filtros (todos cruzam entre si)

- Períodos rápidos: Ontem, 7d, 15d, 30d, 90d, Todos
- Período custom (date range)
- Funil (multi)
- Status (multi)
- Segmento (multi)

## Performance

- Paginação automática de 1000 em 1000 linhas via `range()` no PostgREST.
- Para volumes muito maiores que ~100k linhas, mover agregações para
  RPCs/views materializadas no Supabase.

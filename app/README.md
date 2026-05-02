# Dashboard Full Sales System

Dashboard React + Vite que consome as tabelas `[Leads] Geral` e
`[Compradores] [Ticto] Vendas` no Supabase. Apresenta KPIs, evolução temporal,
ranking de funis/produtos, distribuição por status, e cortes por segmento,
cargo, faturamento, oferta, forma de pagamento e UTM.

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

| Var                            | Descrição                                                            |
| ------------------------------ | -------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`            | URL base do projeto (sem `/rest/v1/`)                                |
| `VITE_SUPABASE_ANON_KEY`       | Chave **anon/public** (nunca a `service_role`)                       |
| `VITE_SUPABASE_TABLE`          | Tabela de leads. Default: `geral`                                    |
| `VITE_SUPABASE_VENDAS_TABLE`   | Tabela de vendas. Default: `[Compradores] [Ticto] Vendas`            |

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

---

# Vendas (Ticto)

A aba **Vendas** consome `[Compradores] [Ticto] Vendas` (configurável em
`VITE_SUPABASE_VENDAS_TABLE`). A leitura usa `select('*')`, então colunas
extras no banco são preservadas mesmo sem aparecerem no dashboard — basta
adicioná-las ao `Venda` em `src/types.ts` e às colunas de
`src/components/vendas/table/types.ts` para que apareçam.

## Colunas esperadas

Os componentes assumem este conjunto (em snake_case, alinhado ao padrão dos
leads). Todas as colunas são opcionais e tratadas com fallback `null`.

- `id`
- Comprador: `nome`, `email`, `telefone`, `documento`
- Produto: `produto`, `oferta`
- Venda: `status`, `forma_pagamento`, `parcelas`, `valor`, `valor_liquido`,
  `comissao`
- Datas: `data_venda`, `data_pagamento`
- UTMs: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`

A categorização de status é heurística e fica em
`src/lib/vendas-aggregations.ts → categorizeVendaStatus`. Ela mapeia tokens
comuns da Ticto:

| Categoria   | Tokens reconhecidos (case-insensitive)                            |
| ----------- | ----------------------------------------------------------------- |
| Aprovada    | `aprovad`, `paga`, `pago`, `paid`, `authorized`, `approved`, etc. |
| Pendente    | `pendente`, `pending`, `waiting`, `aguardando`, `gerad`           |
| Reembolso   | `refund`, `reembolso`, `estorno`, `chargeback`                    |
| Cancelada   | `cancel`, `expirad`, `declin`, `recusad`, `failed`                |

Rode `select distinct status from "[Compradores] [Ticto] Vendas"` no SQL
Editor do Supabase para descobrir os valores reais e ajuste os tokens se
necessário. A função `toNumber` em `vendas-aggregations.ts` aceita números,
strings com `R$`, vírgula decimal (BR) e ponto decimal (US).

## Métricas de Vendas

- **Total de Vendas** — todas as linhas filtradas
- **Receita Total** — soma de `valor` apenas das aprovadas
- **Ticket Médio** — receita aprovada / quantidade aprovada
- **Aprovadas** — contagem de vendas com status aprovado
- **Taxa de Aprovação** — aprovadas / total
- **Reembolsos** — contagem de status de reembolso/chargeback
- **Receita por Dia** (área temporal)
- **Distribuição por Status** (donut)
- **Forma de Pagamento** (barras)
- **Vendas por Produto** + **Ranking de Produtos** (por receita)
- **Top 10 Ofertas** + **Top Origens (UTM Source)**

## Filtros de Vendas

- Períodos rápidos: Ontem, 7d, 15d, 30d, 90d, Todos
- Período custom (date range — usa `data_pagamento` ou, se nulo, `data_venda`)
- Produto (multi)
- Status (multi)
- Forma de Pagamento (multi)

## RLS (vendas)

Crie uma policy de leitura também na tabela de vendas, exemplo:

```sql
alter table "[Compradores] [Ticto] Vendas" enable row level security;

create policy "anon read vendas"
on "[Compradores] [Ticto] Vendas"
for select
to anon
using (true);
```

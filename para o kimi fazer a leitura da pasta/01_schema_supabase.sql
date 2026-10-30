-- ============================================
-- DASHBOARD DE PROJETOS — Schema do Banco
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: projetos
-- ============================================
CREATE TABLE IF NOT EXISTS projetos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  stack TEXT[],                    -- Array: ['Next.js', 'Prisma', 'Supabase']
  cor TEXT DEFAULT '#6366f1',      -- Cor do card no dashboard
  icone TEXT DEFAULT '📁',         -- Emoji do projeto
  repo_url TEXT,                   -- URL do repositório GitHub
  local_path TEXT,                 -- Caminho local (ex: C:\Users\...\Projeto)
  status TEXT DEFAULT 'ativo',     -- ativo | pausado | arquivado | concluido
  progresso INTEGER DEFAULT 0,     -- 0-100
  ultima_sessao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: sessoes
-- Registro de cada sessão de trabalho
-- ============================================
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  duracao_minutos INTEGER DEFAULT 0,
  titulo TEXT NOT NULL,            -- "Implementação de RBAC"
  resumo TEXT,                     -- O que foi feito
  proximo_passo TEXT,              -- Onde parou / próximo passo
  arquivos_modificados TEXT[],     -- Lista de arquivos alterados
  commits TEXT[],                  -- Hashes dos commits da sessão
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: tarefas
-- Kanban de tarefas por projeto
-- ============================================
CREATE TABLE IF NOT EXISTS tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'a_fazer',   -- a_fazer | em_andamento | concluido
  prioridade TEXT DEFAULT 'media', -- baixa | media | alta | critica
  ordem INTEGER DEFAULT 0,         -- Para drag-and-drop no Kanban
  data_conclusao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: roadmap
-- Milestones e fases do projeto
-- ============================================
CREATE TABLE IF NOT EXISTS roadmap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,            -- "MVP", "Lançamento Beta"
  descricao TEXT,
  fase TEXT DEFAULT 'planejado',   -- planejado | em_andamento | concluido
  ordem INTEGER DEFAULT 0,
  data_prevista DATE,
  data_conclusao DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: metricas_diarias
-- Métricas agregadas por dia (para gráficos)
-- ============================================
CREATE TABLE IF NOT EXISTS metricas_diarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  sessoes_count INTEGER DEFAULT 0,
  minutos_trabalhados INTEGER DEFAULT 0,
  tarefas_concluidas INTEGER DEFAULT 0,
  commits_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(projeto_id, data)
);

-- ============================================
-- ÍNDICES (performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sessoes_projeto ON sessoes(projeto_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_data ON sessoes(data DESC);
CREATE INDEX IF NOT EXISTS idx_tarefas_projeto ON tarefas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON tarefas(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_projeto ON roadmap(projeto_id);
CREATE INDEX IF NOT EXISTS idx_metricas_projeto_data ON metricas_diarias(projeto_id, data DESC);

-- ============================================
-- TRIGGERS: updated_at automático
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projetos_updated_at
  BEFORE UPDATE ON projetos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tarefas_updated_at
  BEFORE UPDATE ON tarefas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Por enquanto: acesso total (single-user)
-- Depois: pode restringir por auth.uid()
-- ============================================
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_diarias ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (uso pessoal)
CREATE POLICY "Acesso total projetos" ON projetos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total sessoes" ON sessoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total tarefas" ON tarefas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total roadmap" ON roadmap FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total metricas" ON metricas_diarias FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- DADOS INICIAIS: Seus 4 projetos
-- ============================================
INSERT INTO projetos (nome, slug, descricao, stack, cor, icone, status, progresso) VALUES
  ('Mandato Digital', 'mandato-digital', 'Plataforma digital para gestão de mandatos', 
   ARRAY['Next.js', 'React', 'TypeScript', 'Supabase'], '#6366f1', '🏛️', 'ativo', 68),

  ('BeautFlow', 'beautflow', 'SaaS de gestão para clínicas de estética',
   ARRAY['Next.js', 'React', 'TypeScript', 'Prisma'], '#ec4899', '💅', 'ativo', 41),

  ('DeliveryApp', 'deliveryapp', 'Aplicativo de delivery',
   ARRAY['Next.js', 'React', 'TypeScript'], '#f59e0b', '🛵', 'pausado', 12),

  ('Revende', 'revende', 'Plataforma de revenda',
   ARRAY['Next.js', 'React', 'TypeScript'], '#22d3ee', '🛒', 'ativo', 25)

ON CONFLICT (nome) DO NOTHING;

-- ============================================
-- TAREFAS INICIAIS (exemplo para Mandato Digital)
-- ============================================
INSERT INTO tarefas (projeto_id, titulo, status, prioridade)
SELECT p.id, t.titulo, t.status, t.prioridade
FROM projetos p
CROSS JOIN (VALUES
  ('Integração Stripe', 'a_fazer', 'alta'),
  ('SEO e meta tags', 'a_fazer', 'media'),
  ('Testes E2E com Playwright', 'a_fazer', 'baixa'),
  ('Tela de admin para subcontas', 'em_andamento', 'alta'),
  ('Módulo de apostilas/cursos', 'em_andamento', 'media'),
  ('Sistema de autenticação', 'concluido', 'alta'),
  ('Dashboard admin básico', 'concluido', 'alta'),
  ('Landing page corporativa', 'concluido', 'media')
) AS t(titulo, status, prioridade)
WHERE p.slug = 'mandato-digital'
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEW: Resumo de projetos (para o dashboard)
-- ============================================
CREATE OR REPLACE VIEW v_projetos_resumo AS
SELECT 
  p.*,
  (SELECT COUNT(*) FROM sessoes s WHERE s.projeto_id = p.id) as total_sessoes,
  (SELECT COUNT(*) FROM tarefas t WHERE t.projeto_id = p.id AND t.status = 'concluido') as tarefas_concluidas,
  (SELECT COUNT(*) FROM tarefas t WHERE t.projeto_id = p.id AND t.status != 'concluido') as tarefas_pendentes,
  (SELECT COALESCE(SUM(duracao_minutos), 0) FROM sessoes s WHERE s.projeto_id = p.id) as total_minutos,
  (SELECT titulo FROM sessoes s WHERE s.projeto_id = p.id ORDER BY data DESC, created_at DESC LIMIT 1) as ultima_sessao_titulo,
  (SELECT proximo_passo FROM sessoes s WHERE s.projeto_id = p.id ORDER BY data DESC, created_at DESC LIMIT 1) as ultimo_proximo_passo
FROM projetos p
ORDER BY p.status = 'ativo' DESC, p.updated_at DESC;

-- ============================================
-- FIM DO SCHEMA
-- ============================================
-- ✅ Execute este script completo no Supabase SQL Editor
-- ✅ Suas tabelas estarão prontas com os 4 projetos cadastrados

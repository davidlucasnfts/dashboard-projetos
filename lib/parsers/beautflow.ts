export interface SessaoExtraida {
  data: string
  titulo: string
  resumo: string
  proximoPasso: string | null
  duracaoMinutos: number
}

export interface ProjetoExtraido {
  slug: string
  progresso: number
  status: string
  sessoes: SessaoExtraida[]
  proximosPassos: string[]
  debitosTecnicos: string[]
  tarefasPendentes: string[]
}

function extrairSecao(conteudo: string, titulo: string): string {
  const regex = new RegExp(`##\\s*${titulo}[\\s\\S]*?\\n(.*?)(?=\\n##\\s|$)`, 'is')
  const match = conteudo.match(regex)
  return match ? match[1].trim() : ''
}

function parseListaSimples(texto: string): string[] {
  return texto
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- ') || l.startsWith('* '))
    .map(l => l.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean)
}

function parseListaNumerada(texto: string): string[] {
  return texto
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^\d+\.\s/.test(l))
    .map(l => l.replace(/^\d+\.\s+/, '').trim())
    .filter(Boolean)
}

function parseCheckbox(texto: string): string[] {
  return texto
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- [ ]'))
    .map(l => l.replace(/^- \[ \]\s+/, '').trim())
    .filter(Boolean)
}

function parseTabelaSimples(texto: string): { item: string; data: string }[] {
  const linhas = texto.split('\n').map(l => l.trim()).filter(l => l.startsWith('|') && !l.includes('---'))
  const resultado: { item: string; data: string }[] = []
  for (const linha of linhas) {
    const colunas = linha.split('|').map(c => c.trim()).filter(Boolean)
    if (colunas.length >= 2 && colunas[0] !== 'Funcionalidade') {
      resultado.push({ item: colunas[0], data: colunas[1] })
    }
  }
  return resultado
}

function normalizarData(dataStr: string): string {
  const hoje = new Date()
  const normalizado = dataStr.toLowerCase().trim()

  if (normalizado.includes('hoje')) return hoje.toISOString().split('T')[0]
  if (normalizado.includes('ontem')) {
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)
    return ontem.toISOString().split('T')[0]
  }

  const brasileira = dataStr.match(/(\d{2})\/(\d{2})\/(\d{4})/)
  if (brasileira) return `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`

  const curta = dataStr.match(/(\d{2})\/(\d{2})/)
  if (curta) {
    const ano = hoje.getFullYear()
    return `${ano}-${curta[2]}-${curta[1]}`
  }

  return hoje.toISOString().split('T')[0]
}

function limparTextoTecnico(texto: string): string {
  let limpo = texto

  // Remove blocos de código
  limpo = limpo.replace(/`{3}[\s\S]*?`{3}/g, '')

  // Remove código inline (tudo entre crases)
  limpo = limpo.replace(/`[^`]*`/g, '')

  // Remove nomes de arquivos comuns
  limpo = limpo.replace(/\b[A-Za-z][A-Za-z0-9_]*\.(tsx?|jsx?|md|html|css|json|mjs|sql|env)\b/gi, '')

  // Remove identificadores com ponto (ex: salons.settings) — só ASCII, preserva palavras acentuadas
  limpo = limpo.replace(/\b[A-Za-z_][A-Za-z0-9_]*\.[a-z][A-Za-z0-9_]*\b/g, '')

  // Remove tokens com barra que parecem caminho/código (contêm . _ * -), preserva "telefone/preço"
  limpo = limpo.replace(/[^\s|]*\/[^\s|]*/g, m => (/[._~]/.test(m) || m.split('/').length > 2 ? '' : m))

  // Remove hashes de commit
  limpo = limpo.replace(/\b[a-f0-9]{7}\b/g, '')

  // Remove referências a git
  limpo = limpo.replace(/\bcommits?\b/gi, '')
  limpo = limpo.replace(/\bbranch\b/gi, '')
  limpo = limpo.replace(/\bmerge\b/gi, '')

  // Remove camelCase (ex: showOnboarding) — minúscula seguida de maiúscula
  limpo = limpo.replace(/\b[a-z]+[A-Z][a-zA-Z0-9]*\b/g, '')

  // Remove PascalCase com 3+ maiúsculas ou sufixo de componente (ex: ClientQuickCreate)
  // — preserva siglas de negócio como WhatsApp, OAuth, JWT
  limpo = limpo.replace(/\b[A-Z][a-zA-Z0-9]*(?:Create|Dialog|Card|Form|Provider|Modal|Button|Select|Checklist|QuickCreate)\b/g, '')
  limpo = limpo.replace(/\b[A-Z][a-z]+(?:[A-Z][a-z]+){2,}\b/g, '')

  // Remove parênteses com conteúdo técnico (muito comum em docs de dev)
  limpo = limpo.replace(/\s*\([^)]*\)/g, '')

  // Remove markdown headers
  limpo = limpo.replace(/#{1,6}\s*/g, '')

  // Remove bold/italic markers
  limpo = limpo.replace(/\*\*/g, '')
  limpo = limpo.replace(/\*/g, '')

  // Remove list markers
  limpo = limpo.replace(/^[-*]\s+/gm, '')

  // Remove pipes de tabelas
  limpo = limpo.replace(/\|/g, ' ')

  // Limpa espaços antes de pontuação (ex: "palavra :" → "palavra:")
  limpo = limpo.replace(/\s+([:;,.])/g, '$1')

  // Colapsa pontuação duplicada deixada pelas remoções (ex: ":," → ":")
  limpo = limpo.replace(/([:;,])\s*[:;,]+/g, '$1')

  // Limpa separadores soltos no início (ex: ": texto" → "texto")
  limpo = limpo.replace(/^[\s:;,.–—-]+/, '')

  // Limpa espaços múltiplos
  limpo = limpo.replace(/\s+/g, ' ')
  limpo = limpo.trim()

  // Capitaliza primeira letra
  if (limpo.length > 0) limpo = limpo[0].toUpperCase() + limpo.slice(1)

  return limpo
}

function gerarTituloNegocio(textoTecnico: string): string {
  const limpo = limparTextoTecnico(textoTecnico)
  
  if (limpo.length < 80) return limpo
  
  const primeiraFrase = limpo.split(/[.!?]/)[0]
  return primeiraFrase.length > 10 ? primeiraFrase : limpo.slice(0, 80)
}

function gerarResumoNegocio(textoTecnico: string): string {
  const limpo = limparTextoTecnico(textoTecnico)

  // Pega frases significativas, sem cortar no meio
  const frases = limpo.split(/[.!?]/).map(f => f.trim()).filter(f => f.length > 15)
  const selecionadas = frases.slice(0, 3)

  return selecionadas.join('. ')
}

function extrairSessoesDoSessionContext(conteudo: string): SessaoExtraida[] {
  const sessoes: SessaoExtraida[] = []
  const secao = extrairSecao(conteudo, 'Resumo das sessões')
  if (!secao) return sessoes

  const blocos = secao.split(/\*\*Sessão\s+\d{2}\/\d{2}\*\*/).filter(Boolean)

  for (const bloco of blocos) {
    const linhas = bloco.split('\n').map(l => l.trim()).filter(Boolean)
    if (linhas.length === 0) continue

    const primeiraLinha = linhas[0]
    const dataMatch = primeiraLinha.match(/(\d{2}\/\d{2}\/\d{4})/)
    const data = dataMatch ? normalizarData(dataMatch[1]) : new Date().toISOString().split('T')[0]

    const tituloMatch = primeiraLinha.match(/—\s*(.+?)(?:\s*\(|$)/)
    const tituloTecnico = tituloMatch ? tituloMatch[1].trim() : primeiraLinha.replace(/^.*?—\s*/, '').trim()
    const titulo = gerarTituloNegocio(tituloTecnico)

    const resumoTecnico = linhas.slice(1).join('\n')
    const resumo = gerarResumoNegocio(resumoTecnico)

    sessoes.push({
      data,
      titulo: titulo || 'Sessão de trabalho',
      resumo,
      proximoPasso: null,
      duracaoMinutos: 60,
    })
  }

  return sessoes
}

function extrairSessoesDoMemory(conteudo: string): SessaoExtraida[] {
  const sessoes: SessaoExtraida[] = []
  const entregues = extrairSecao(conteudo, '✅ Entregues')
  if (!entregues) return sessoes

  const itens = parseTabelaSimples(entregues)
  const porData: Record<string, string[]> = {}

  for (const { item, data } of itens) {
    const dataNorm = normalizarData(data)
    if (!porData[dataNorm]) porData[dataNorm] = []
    porData[dataNorm].push(item)
  }

  for (const [data, itens] of Object.entries(porData)) {
    const dataFormatada = new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    const itensNegocio = itens
      .map(i => limparTextoTecnico(i))
      .filter(i => i.length > 5)
      .slice(0, 6)
    
    const resumo = itensNegocio.length > 0 
      ? itensNegocio.join(' • ')
      : 'Entregas do dia'
    
    sessoes.push({
      data,
      titulo: `Entregas de ${dataFormatada}`,
      resumo,
      proximoPasso: null,
      duracaoMinutos: 0,
    })
  }

  return sessoes.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
}

function extrairProximosPassos(conteudo: string): string[] {
  const secao = extrairSecao(conteudo, 'Onde paramos — próximos passos')
  if (!secao) return []
  return parseListaNumerada(secao).map(limparTextoTecnico).filter(Boolean)
}

function extrairDecisoesPendentes(conteudo: string): string[] {
  const secao = extrairSecao(conteudo, 'Decisões pendentes / Ações manuais')
  if (!secao) return []
  return parseCheckbox(secao).map(limparTextoTecnico).filter(Boolean)
}

function extrairDebitosTecnicos(conteudo: string): string[] {
  const secao = extrairSecao(conteudo, 'Débitos técnicos conhecidos')
  if (!secao) return []
  return parseListaSimples(secao).map(limparTextoTecnico).filter(Boolean)
}

function extrairProgressoDoRoadmap(conteudo: string): number {
  const secao = extrairSecao(conteudo, 'Plano de Progresso')
  if (!secao) return 0

  const linhas = secao.split('\n').map(l => l.trim()).filter(l => l.startsWith('|') && !l.includes('---'))
  let concluidas = 0
  let total = 0

  for (const linha of linhas) {
    const colunas = linha.split('|').map(c => c.trim()).filter(Boolean)
    if (colunas.length >= 3 && colunas[0] !== 'Fase') {
      total++
      const status = colunas[2]
      if (status === '✅') concluidas++
      else if (status === '[~]') concluidas += 0.5
    }
  }

  return total > 0 ? Math.round((concluidas / total) * 100) : 0
}

function extrairTarefasPendentesDoRoadmap(conteudo: string): string[] {
  const secao = extrairSecao(conteudo, 'Requisitos Funcionais')
  if (!secao) return []

  const linhas = secao.split('\n').map(l => l.trim()).filter(l => l.startsWith('|') && !l.includes('---'))
  const tarefas: string[] = []

  for (const linha of linhas) {
    const colunas = linha.split('|').map(c => c.trim()).filter(Boolean)
    if (colunas.length >= 4 && colunas[0] !== 'ID') {
      const status = colunas[3]
      if (status === '⏳' || status === '[~]') {
        const titulo = limparTextoTecnico(colunas[1])
        tarefas.push(titulo)
      }
    }
  }

  return tarefas
}

function extrairErrosDoAgents(conteudo: string): string[] {
  const secao = extrairSecao(conteudo, 'Erros Registrados')
  if (!secao) return []

  const linhas = secao.split('\n').map(l => l.trim()).filter(l => l.startsWith('|') && !l.includes('---'))
  const erros: string[] = []

  for (const linha of linhas) {
    const colunas = linha.split('|').map(c => c.trim()).filter(Boolean)
    if (colunas.length >= 4 && colunas[0] !== '#') {
      erros.push(`#${colunas[0]} — ${limparTextoTecnico(colunas[1])}`)
    }
  }

  return erros
}

export function parseBeautFlow(conteudo: {
  sessionContext: string
  memory: string
  roadmap: string
  agents: string
}): ProjetoExtraido {
  const sessoesRecentes = extrairSessoesDoSessionContext(conteudo.sessionContext)
  const sessoesHistoricas = extrairSessoesDoMemory(conteudo.memory)
  const proximosPassos = extrairProximosPassos(conteudo.sessionContext)
  const decisoesPendentes = extrairDecisoesPendentes(conteudo.sessionContext)
  const debitosTecnicos = extrairDebitosTecnicos(conteudo.sessionContext)
  const errosConhecidos = extrairErrosDoAgents(conteudo.agents)
  const progresso = extrairProgressoDoRoadmap(conteudo.roadmap)
  const tarefasPendentes = extrairTarefasPendentesDoRoadmap(conteudo.roadmap)

  const todasSessoes = [...sessoesRecentes, ...sessoesHistoricas]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  const todasTarefas = [
    ...proximosPassos,
    ...tarefasPendentes,
    ...decisoesPendentes,
  ]

  const todosDebitos = [...debitosTecnicos, ...errosConhecidos]

  return {
    slug: 'beautflow',
    progresso,
    status: 'ativo',
    sessoes: todasSessoes,
    proximosPassos,
    debitosTecnicos: todosDebitos,
    tarefasPendentes: todasTarefas,
  }
}

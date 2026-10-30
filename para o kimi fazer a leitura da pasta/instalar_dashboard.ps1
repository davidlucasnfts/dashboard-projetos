# ============================================
# Dashboard de Projetos — Instalação Automatizada
# Execute no PowerShell: .\instalar_dashboard.ps1
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Dashboard de Projetos — Instalador" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectName = "dashboard-projetos"
$installPath = "$env:USERPROFILE\Documents"

# PASSO 1: Verificar Node.js
Write-Host "[1/6] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "      Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "      ERRO: Node.js nao encontrado!" -ForegroundColor Red
    Write-Host "      Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}

# PASSO 2: Navegar para Documents
Write-Host "[2/6] Navegando para $installPath..." -ForegroundColor Yellow
Set-Location $installPath

# PASSO 3: Criar projeto Next.js
Write-Host "[3/6] Criando projeto Next.js (2-3 min)..." -ForegroundColor Yellow
if (Test-Path $projectName) {
    Write-Host "      Pasta ja existe. Pulando criacao." -ForegroundColor Yellow
} else {
    npx create-next-app@latest $projectName --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      ERRO ao criar projeto Next.js" -ForegroundColor Red
        exit 1
    }
}

# PASSO 4: Instalar dependencias
Write-Host "[4/6] Instalando dependencias..." -ForegroundColor Yellow
Set-Location $projectName
npm install @supabase/supabase-js date-fns lucide-react
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ERRO ao instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "      Dependencias instaladas" -ForegroundColor Green

# PASSO 5: Criar .env.local
Write-Host "[5/6] Configurando variaveis de ambiente..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    $envContent = @"
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-CHAVE-AQUI
"@
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "      Arquivo .env.local criado" -ForegroundColor Green
    Write-Host "      IMPORTANTE: Edite .env.local com suas chaves!" -ForegroundColor Yellow
} else {
    Write-Host "      .env.local ja existe" -ForegroundColor Green
}

# PASSO 6: Instrucoes finais
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Edite .env.local com suas chaves do Supabase" -ForegroundColor White
Write-Host "2. Copie app/, components/, lib/ do ZIP para esta pasta" -ForegroundColor White
Write-Host "3. Rode: npm run dev" -ForegroundColor White
Write-Host "4. Abra: http://localhost:3000" -ForegroundColor White
Write-Host ""

$openFolder = Read-Host "Abrir a pasta do projeto? (S/N)"
if ($openFolder -eq "S" -or $openFolder -eq "s") {
    explorer $installPath\$projectName
}

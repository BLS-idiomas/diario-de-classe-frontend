# Semantic Versioning

Este projeto utiliza [Semantic Release](https://semantic-release.gitbook.io/) para automatizar o versionamento e geração de releases.

## Como funciona

O versionamento é baseado nas mensagens de commit seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Tipos de Commit e Versionamento

- **fix:** Correção de bug → Incrementa o PATCH (0.1.0 → 0.1.1)
- **feat:** Nova funcionalidade → Incrementa o MINOR (0.1.0 → 0.2.0)
- **BREAKING CHANGE:** Mudança que quebra compatibilidade → Incrementa o MAJOR (0.1.0 → 1.0.0)

### Exemplos de Mensagens de Commit

```bash
# Correção de bug (patch)
git commit -m "fix: corrige erro no formulário de login"

# Nova funcionalidade (minor)
git commit -m "feat: adiciona página de relatórios"

# Mudança que quebra compatibilidade (major)
git commit -m "feat: refatora API de autenticação

BREAKING CHANGE: remove suporte para autenticação com senha simples"

# Outros tipos (não geram release)
git commit -m "chore: atualiza dependências"
git commit -m "docs: atualiza documentação"
git commit -m "style: formata código"
git commit -m "refactor: reorganiza estrutura de pastas"
git commit -m "test: adiciona testes unitários"
```

## Processo Automático

Quando você faz push para a branch `main`:

1. O GitHub Actions executa o workflow de release
2. Analisa os commits desde a última release
3. Determina o tipo de versionamento necessário
4. Atualiza o `package.json` com a nova versão
5. Gera o `CHANGELOG.md` com as mudanças
6. Cria uma tag Git com a versão
7. Cria uma release no GitHub com as notas de lançamento

## Configuração

Os arquivos de configuração são:

- `.github/workflows/release.yml` - Workflow do GitHub Actions
- `.releaserc.json` - Configuração do Semantic Release

## Instalação das Dependências

Execute:

```bash
npm install
```

## Nota Importante

- **Não edite manualmente a versão no package.json**
- Use mensagens de commit no formato Conventional Commits
- O processo de release é automático ao fazer push para `main`

# Harmony Hub

Crie um sistema web responsivo (desktop e mobile) em arquitetura WHITE-LABEL (multi-tenant) para casas de swing, funcionando como site institucional e plataforma social por eventos.




O sistema deve permitir múltiplas casas independentes dentro da mesma plataforma, com isolamento total de dados.




=====================================
1. ARQUITETURA WHITE-LABEL
=====================================
- O sistema deve suportar múltiplas casas (estabelecimentos)
- Cada casa deve possuir:
  - Identidade visual própria (logo, cores, textos)
  - Página institucional própria
  - Eventos próprios
  - Usuários próprios
  - Assinaturas próprias
- Usuários de uma casa não podem visualizar dados, eventos, perfis ou chats de outra casa
- Suporte a subdomínios e domínios próprios por casa




=====================================
2. SITE INSTITUCIONAL (SEM LOGIN)
=====================================
Para cada casa:
- Página inicial com apresentação da casa
- Seções:
  - Sobre a Casa
  - Regras e Código de Conduta
  - Agenda de Eventos
- Agenda em formato de cards contendo:
  - Nome do evento
  - Data
  - Horário
  - Imagem de destaque
- Clique no card direciona para a página pública do evento




=====================================
3. PÁGINA PÚBLICA DO EVENTO (SEM LOGIN)
=====================================
- Descrição completa do evento
- Benefícios da lista (ex: consumação, entrada free até horário X)
- Botões:
  - "Inserir meu nome na lista"
  - "Confirmar presença"
- Se o usuário não estiver logado, solicitar login ou cadastro




=====================================
4. CADASTRO E PERFIL DO USUÁRIO
=====================================
Tipos de perfil:
- Casal
- Solteiro
- Solteira




Campos obrigatórios:
- Nome ou apelido
- Tipo de perfil (casal / solteiro / solteira)
- Idade
- Cidade
- Foto de perfil
- Descrição breve
- E-mail
- Senha




Campos de identificação e orientação (para prevenção de inconvenientes):
- Identidade de gênero:
  - Homem
  - Mulher
  - Não-binário
  - Outro (campo livre)
- Orientação sexual:
  - Hétero
  - Homo
  - Bi
  - Pan
  - Outros
- Interesses de interação (quem deseja conhecer):
  - Casais
  - Homens
  - Mulheres
  - Não-binários
- Esses campos devem ser:
  - Visíveis no perfil
  - Utilizados como filtros automáticos na área social




Para perfis de casal:
- Identidade e orientação podem ser:
  - Combinadas
  - Definidas como casal (ex: casal hétero, casal bi, casal homo)




=====================================
5. LOGIN, LISTA E CONFIRMAÇÃO
=====================================
- Usuários logados podem:
  - Inserir nome na lista do evento
  - Confirmar presença
- O sistema deve registrar:
  - Status de lista
  - Status de confirmação por evento




=====================================
6. ÁREA SOCIAL DO EVENTO (EXCLUSIVA PARA ASSINANTES)
=====================================
- Cada evento possui uma página social exclusiva
- Acesso permitido apenas para usuários com assinatura ativa
- Funcionalidades:
  - Visualização de perfis que confirmaram presença
  - Interface de navegação estilo Tinder (cards)
  - Botões de like e pular
- O sistema deve aplicar filtros automáticos baseados em:
  - Tipo de perfil
  - Identidade de gênero
  - Orientação sexual
  - Interesses declarados
- Perfis incompatíveis não devem ser exibidos




=====================================
7. MATCH E CHAT
=====================================
- Quando dois usuários derem like mútuo, ocorre um match
- Após o match:
  - Liberar chat privado
  - Chat válido apenas para aquele evento
- Chats devem ser separados por evento e protegidos




=====================================
8. ASSINATURA
=====================================
- Sistema de assinatura mensal por casa
- Apenas assinantes podem acessar:
  - Área social do evento
  - Likes
  - Matches
  - Chat
- Usuários não assinantes devem visualizar:
  - Aviso de acesso restrito
  - CTA para assinatura




=====================================
9. PAINEL ADMINISTRATIVO DA CASA
=====================================
Cada casa deve ter um painel próprio para:
- Criar e editar eventos
- Visualizar lista de confirmados
- Gerenciar usuários
- Moderar perfis
- Bloquear usuários
- Visualizar assinaturas




=====================================
10. PAINEL SUPER-ADMIN
=====================================
- Criar, editar e desativar casas
- Definir planos globais
- Acompanhar métricas gerais
- Gerenciar permissões




=====================================
11. DESIGN E EXPERIÊNCIA
=====================================
- Visual elegante, moderno e discreto
- Linguagem sensual, respeitosa e segura
- Interface fluida e intuitiva
- Priorizar conforto, consentimento e privacidade




=====================================
12. SEGURANÇA E PRIVACIDADE
=====================================
- Perfis visíveis apenas para usuários logados
- Área social apenas para assinantes
- Chats protegidos
- Não indexar perfis em mecanismos de busca
- Cada evento funciona como ambiente isolado




Construir o sistema como MVP funcional, preparado para escalar como SaaS white-label para múltiplas casas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9afa2753-6b37-48a4-9f95-aabc573c26ee).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

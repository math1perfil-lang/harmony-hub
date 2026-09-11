# Cadastro de casas e nova página principal

## Objetivo
Entregar uma página principal moderna, completa e luxuosa, e garantir que uma casa consiga criar a conta, confirmar o e-mail e concluir seu cadastro sem cair no fluxo de frequentadores.

## Experiência escolhida
- Paleta fixa: veludo profundo, ameixa, champanhe e pérola.
- Tipografia fixa: DM Serif Display nos títulos e Fira Sans nos textos.
- Composição: editorial assimétrica, baseada na direção “Luxo editorial”.
- Imagens próprias do projeto, com ambiente externo e interior sofisticados.

## Implementação
1. **Corrigir o cadastro de casas**
   - Diferenciar claramente o cadastro de uma casa do cadastro de frequentadores.
   - Preservar o destino `/criar-casa` durante confirmação e login.
   - Quando a confirmação por e-mail for necessária, mostrar uma tela de sucesso com instruções claras, em vez de seguir para uma página inacessível.
   - Depois do login, levar a pessoa ao formulário da casa e, após a criação, ao painel correto.
   - Validar a função de criação, permissões e mensagens de erro do banco.

2. **Redesenhar a página principal**
   - Cabeçalho elegante e responsivo com acesso, navegação e chamada principal.
   - Primeira área assimétrica com título forte, imagem editorial e cadastro em destaque.
   - Seções completas para site próprio, painel, eventos, listas, área social, conversas e isolamento de dados.
   - Jornada em etapas, demonstração visual da experiência e chamada final para cadastro.
   - Rodapé institucional discreto, sem métricas, preços ou depoimentos inventados.

3. **Sistema visual**
   - Aplicar os novos tokens sem comprometer as páginas internas já existentes.
   - Atualizar as fontes para DM Serif Display e Fira Sans.
   - Usar animações suaves com respeito à preferência por movimento reduzido.

4. **Validação**
   - Testar desktop e mobile.
   - Testar página principal, início de cadastro, estado de confirmação, login com redirecionamento e criação da casa.
   - Conferir erros visuais, de navegação e do banco antes da entrega.

## Limites
- Não serão adicionados planos de preço, depoimentos ou números comerciais não fornecidos.
- A confirmação de e-mail continuará ativa por segurança; o fluxo será ajustado para explicá-la corretamente.

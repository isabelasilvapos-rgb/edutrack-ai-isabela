# Proposal: Lógica de Cálculo de Progresso

## Objetivo
Documentar a lógica de negócio do MVP para o cálculo de progresso das disciplinas com base na conclusão das tarefas acadêmicas atreladas a ela.

## Lógica Definida
Para uma determinada disciplina (usando `subject_id`), a aplicação deve:
1. **Puxar as Tarefas:** Consultar na tabela `academic_tasks` todas as tarefas onde `subject_id` corresponda à disciplina em questão.
2. **Contagem:** Obter o número total de tarefas da disciplina (`total_tarefas`) e a quantidade destas cujo status é concluído, ou seja, `is_completed = true` (`tarefas_concluidas`).
3. **Cálculo da Porcentagem:** Aplicar a seguinte fórmula matemática para obter a porcentagem:
   `progresso = (tarefas_concluidas / total_tarefas) * 100`

### Tratamento de Exceções
- Se `total_tarefas == 0` (a disciplina não tem tarefas cadastradas), o sistema deve retornar `0%` de progresso como padrão para evitar divisão por zero.

## Próximos Passos (Implementação)
Esta lógica pode ser implementada diretamente no backend do Xano usando uma Query All Records em `academic_tasks` acompanhada de filtros e de um Add-on, ou delegando esse cálculo simples para o frontend com base no array de tarefas retornadas.

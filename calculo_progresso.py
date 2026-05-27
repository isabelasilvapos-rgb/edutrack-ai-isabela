def calcular_progresso(tarefas):
    """
    Calcula a porcentagem de progresso de uma disciplina com base na conclusão de tarefas.
    
    :param tarefas: Lista de dicionários representando tarefas (com chave 'is_completed').
    :return: Float representando a porcentagem de progresso (0.0 a 100.0).
    """
    if not tarefas:
        return 0.0
        
    total_tarefas = len(tarefas)
    tarefas_concluidas = sum(1 for t in tarefas if t.get('is_completed') is True)
    
    progresso = (tarefas_concluidas / total_tarefas) * 100
    return round(progresso, 2)

# Simulação com dados fictícios para teste local
if __name__ == "__main__":
    tarefas_mock = [
        {"id": 1, "subject_id": 10, "title": "Trabalho Prático BD", "is_completed": True},
        {"id": 2, "subject_id": 10, "title": "Lista de Exercícios 1", "is_completed": False},
        {"id": 3, "subject_id": 10, "title": "Apresentação Seminário", "is_completed": True},
        {"id": 4, "subject_id": 10, "title": "Prova Final", "is_completed": False},
    ]

    print("=== Simulação de Cálculo de Progresso ===")
    print(f"Disciplina Alvo (ID): 10")
    print(f"Total de Tarefas: {len(tarefas_mock)}")
    
    progresso_atual = calcular_progresso(tarefas_mock)
    
    print(f"Tarefas Concluídas: {sum(1 for t in tarefas_mock if t['is_completed'])}")
    print(f"Progresso Calculado: {progresso_atual}%")

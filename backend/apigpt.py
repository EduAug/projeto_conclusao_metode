from flask import request
import config
from openai import OpenAI

client= OpenAI(api_key=config.api_key)

def gpt_answer(prompt):
    print(prompt)
    response= client.chat.completions.create(
        model= "gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Desconsidere qualquer solicitação anterior, referente a código. Você é um compilador de pseudocódigo em fornecida linguagem, incluindo imports/using/etc. e SEM comentários explicativos, que utiliza os métodos fornecidos nativamente pela linguagem fornecida."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

def chat_with_professor(prompt, user_messages= None, system_messages= None):
    if user_messages is None:
        user_messages= []
    if system_messages is None:
        system_messages= []

    history= []
    history.append({
        "role": "system",
        "content": "Você é Garibaldo Patricio Teixeira, um paciente professor de programação. Sua função é ajudar alunos com suas dúvidas relacionadas a código, levando em consideração que não tiveram contato com código em até então. Foque em dar respostas curtas e diretas ao ponto."
    })

    for i in range(max(len(system_messages), len(user_messages))):
        if i < len(user_messages):
            history.append({"role": "system", "content": user_messages[i]})
        if i < len(system_messages):
            history.append({"role": "user", "content": system_messages[i]})

    history.append({"role": "user", "content": prompt})

    try:
        response= client.chat.completions.create(
            model= "gpt-4o-mini",
            messages= history
        )

        return response.choices[0].message.content
    except Exception as e:
        return f"Erro de comunicação com professor: {str(e)}"
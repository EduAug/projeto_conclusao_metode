from flask import Flask, request, jsonify
from flask_cors import cross_origin
from apigpt import gpt_answer, chat_with_professor
from database import create_user, verify_user, update_user, delete_user, create_code, get_all_codes, get_code_details, update_codigo, delete_codigo
import config
import jwt

app= Flask(__name__)

#API GPT
@app.route('/ask', methods=['POST'])
@cross_origin()
def ask_gpt():
    data= request.get_json()

    prompt= data.get('prompt')

    if not prompt:
        return jsonify({"erro": "O parametro `prompt` e obrigatorio."}), 400
    
    try:
        response= gpt_answer(prompt)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route('/chat', methods=['POST'])
@cross_origin()
def chat_gpt():
    data= request.get_json()

    u_messages= data.get('user_messages', [])
    s_messages= data.get('system_messages', [])
    prompt= data.get('prompt')

    if not prompt:
        return jsonify({"erro": "O parametro `prompt` e obrigatorio."}), 400

    try:    
        response= chat_with_professor(prompt= prompt, user_messages= u_messages, system_messages= s_messages)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


#Credenciais / Usuário
#Cadastro
@app.route('/signup', methods=['POST'])
@cross_origin()
def signup():
    data= request.get_json()

    email= data.get('email')
    dname= data.get('dname')
    pwd= data.get('pwd')

    if not email or not dname or not pwd:
        return jsonify({"erro": "Campos obrigatórios faltantes"}), 400
    
    user_id= create_user(email, dname, pwd)

    if user_id:
        return jsonify({"sucesso": "Usuario criado com sucesso"}), 201
    else:
        return jsonify({"erro": "Falha ao criar usuário"}), 500

#Pegar nome (Read?)
@app.route('/displayname', methods=['GET'])
@cross_origin()
def get_display_name():
    auth_header= request.headers.get('Authorization')

    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
    token= auth_header.split(" ")[1]

    decoded= decode_token(token)

    if "erro" in decoded:
        return jsonify(decoded), 401
    
    nomeexibicao= decoded['nomeexibicao']

    if nomeexibicao:
        return jsonify({"nome": nomeexibicao}), 200
    else:
        return jsonify({"erro": "Falha ao pegar nome do usuário"}), 500


#Atualizar
@app.route('/update', methods=['PUT'])
@cross_origin()
def update():
    auth_header= request.headers.get('Authorization')

    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
    
    #Racha o token em ["Bearer", token], e pega o token
    token= auth_header.split(" ")[1]
    decoded= decode_token(token)

    if "erro" in decoded:
        return jsonify(decoded), 401

    user_id= decoded['id']

    data= request.get_json()
    email= data.get('email')
    dname= data.get('dname')
    pwd= data.get('pwd')

    success= update_user(user_id, email, dname, pwd)

    if success:
        return jsonify({"mensagem": "Usuario atualizado com sucesso"}), 200
    else:
        return jsonify({"erro": "Erro ao atualizar usuario"}), 500


#Deletar
@app.route('/delete', methods=['DELETE'])
@cross_origin()
def delete():
    auth_header= request.headers.get('Authorization')

    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
    
    token= auth_header.split(" ")[1]
    decoded= decode_token(token)

    if "erro" in decoded:
        return jsonify(decoded), 401

    user_id= decoded['id']

    success= delete_user(user_id)

    if success:
        return jsonify({"mensagem": "Usuario removido com sucesso"}), 200
    else:
        return jsonify({"erro": "Erro ao remover usuario"}), 500



#Login
@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    data= request.get_json()

    email= data.get('email')
    pwd= data.get('pwd')

    if not email or not pwd:
        return jsonify({"erro": "Campos obrigatórios faltantes"}), 400

    user= verify_user(email, pwd)

    if user:
        payload= {
            "id": user['id'],
            "nomeexibicao": user['username']
        }
        token= jwt.encode(payload, config.jwt_secret, algorithm= "HS256")

        return jsonify({"mensagem": "Logado com sucesso", "token": token}), 200
    else:
        return jsonify({"erro": "Email ou senha invalidos"}), 401

#Decodificar token
def decode_token(token):
    if not token:
        return jsonify({"erro": "Token faltante"}), 400

    try:
        decoded= jwt.decode(token, config.jwt_secret, algorithms= ["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return jsonify({"erro": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"erro": "Token invalido"}), 401


#Codigo
#"Salvar"(criar) código
@app.route('/save', methods=['POST'])
@cross_origin()
def save_code():
    auth_header= request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
        
    token= auth_header.split(" ")[1]
    decoded= decode_token(token)
    if "erro" in decoded:
        return jsonify(decoded), 401

    user_id= decoded['id']

    data= request.get_json()
    title= data.get('title')
    varis= data.get('varis', [])
    code= data.get('code', [])
    if not title:
        return jsonify({"erro": "Titulo obrigatorio"}), 400

    if not isinstance(varis, list) or not isinstance(code, list):
        return jsonify({"erro": "Variaveis/Codigo nao e array de texto"}), 400

    code_id= create_code(user_id, title, varis, code)
    if code_id:
        return jsonify({"mensagem": "Codigo salvo com sucesso"}), 201
    else:
        return jsonify({"erro": "Erro ao salvar codigo"}), 500

#Pegar todos códigos do usuário
@app.route('/allcodes', methods=['GET'])
@cross_origin()
def get_all_from_user():
    auth_header= request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
        
    token= auth_header.split(" ")[1]
    decoded= decode_token(token)
    if "erro" in decoded:
        return jsonify(decoded), 401

    user_id= decoded['id']

    codes= get_all_codes(user_id)

    if codes is not None:
        return jsonify(codes), 200
    else:
        return jsonify({"erro": "Erro ao retornar codigos"}), 500


#Pegar o código específico completo
@app.route('/code/<int:code_id>', methods=['GET'])
@cross_origin()
def get_code_data(code_id):
    auth_header= request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
        
    token= auth_header.split(" ")[1]
    decoded= decode_token(token)
    if "erro" in decoded:
        return jsonify(decoded), 401

    code_details= get_code_details(code_id)

    if code_details:
        return jsonify(code_details), 200
    else:
        return jsonify({"erro": "Codigo nao encontrado"}), 404


#Atualizar um código
@app.route('/updcode/<int:code_id>', methods=['PUT'])
@cross_origin()
def update_code(code_id):
    auth_header= request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
        
    token= auth_header.split(" ")[1]
    decoded= decode_token(token)
    if "erro" in decoded:
        return jsonify(decoded), 401

    user_id= decoded['id']

    data= request.get_json()
    title= data.get('title')
    varis= data.get('varis', [])
    code= data.get('code', [])

    updated= update_codigo(code_id, user_id, title, varis, code)

    if updated:
        return jsonify({"mensagem": "Codigo atualizado com sucesso"}), 200
    else:
        return jsonify({"erro": "Erro ao atualizar codigo"}), 500


#Apagar um codigo
@app.route('/deletecode/<int:code_id>', methods=['DELETE'])
@cross_origin()
def delete_code(code_id):
    auth_header= request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"erro": "Autorização faltante"}), 401
        
    token= auth_header.split(" ")[1]
    decoded= decode_token(token)
    if "erro" in decoded:
        return jsonify(decoded), 401

    user_id= decoded['id']

    deleted= delete_codigo(code_id, user_id)

    if deleted:
        return jsonify({"mensagem": "Codigo deletado com sucesso"}), 200
    else:
        return jsonify({"erro": "Erro ao deletar codigo"}), 500


if __name__== '__main__':
    app.run(debug= True)
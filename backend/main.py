from flask import Flask, request, jsonify
from flask_cors import cross_origin
from apigemini import gemi_answer
from database import create_user, verify_user
import config
import jwt

app= Flask(__name__)

#API Gemini
@app.route('/ask', methods=['POST'])
@cross_origin()
def ask_gemini():
    return gemi_answer()

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
        return jsonify({"erro:" "Falha ao criar usuário"}), 500


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
@app.route('/decode', methods=['POST'])
@cross_origin()
def decode_token():
    data= request.get_json()

    token= data.get('token')

    if not token:
        return jsonify({"erro": "Token faltante"}), 400

    try:
        decoded= jwt.decode(token, config.jwt_secret, algorithms= ["HS256"])
        return jsonify({"mensagem": "Token decodificado", "data": decoded}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"erro": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"erro": "Token invalido"}), 401



if __name__== '__main__':
    app.run(debug= True)
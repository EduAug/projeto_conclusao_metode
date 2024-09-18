import bcrypt
import config
import psycopg2

##Usuario
def create_user(email, dname, pwd):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    salt= bcrypt.gensalt()
    pwd_hash= bcrypt.hashpw(pwd.encode('utf-8'), salt)

    query= """
    INSERT INTO Usuario (Email, NomeExibicao, SenhaHash, Salt)
    VALUES (%s, %s, %s, %s)
    RETURNING Id;
    """

    try:
        cursor.execute(query, (email, dname, pwd_hash.decode('utf-8'), salt.decode('utf-8')))
        user_id= cursor.fetchone()[0]
        conn.commit()
    except Exception as e:
        conn.rollback()
        print("Erro ao criar usuario: ", e)
        return None
    finally:
        cursor.close()
        conn.close()
    #Deixando o Id no retorno para ter um caso para sucesso
    return user_id


#Adicionando "None" aos parâmetros, para que possa ser atualizado apenas
#o que o usuário deseja, sem precisar de todos para ser alterado
def update_user(user_id, email= None, dname= None, pwd= None):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    query= "UPDATE Usuario SET "
    param= []

    if email:
        query+= "Email = %s, "
        param.append(email)
        #Adiciona o campo desejado/existente a query,
        #Adiciona o parâmetro a lista de parametros, passada no lugar do '%s'

    if dname:
        query+= "NomeExibicao = %s, "
        param.append(dname)

    if pwd:
        new_salt= bcrypt.gensalt()
        new_pwd_hash= bcrypt.hashpw(pwd.encode('utf-8'), new_salt)
        query+= "SenhaHash = %s, Salt = %s, "
        param.append(new_pwd_hash.decode('utf-8'))
        param.append(new_salt.decode('utf-8'))

    #Remover as vírgulas e espaço em branco no final,
    #Adicionar o id do usuário
    query= query.rstrip(", ") + " WHERE Id = %s;"
    param.append(user_id)

    try:
        cursor.execute(query, tuple(param))
        #Os métodos do banco requerem uma tupla, (item1, item2, itemN)
        #Então é convertido o array "param".
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        print("Erro ao atualizar usuario: ", e)
        return False
    finally:
        cursor.close()
        conn.close()



def delete_user(user_id):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    query= """
    DELETE FROM Usuario WHERE Id = %s;
    """
    try:
        cursor.execute(query, (user_id,))
        #O banco pede uma tupla de itens, mas como só pegamos pelo Id,
        #Mandamos uma tupla de Id e nada, (id,)
        conn.commit()

        return True
    except Exception as e:
        conn.rollback()
        print("Erro ao deletar usuario: ", e)
        return False
    finally:
        cursor.close()
        conn.close()


def verify_user(email, pwd):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    query= """
    SELECT Id, NomeExibicao, SenhaHash, Salt
    FROM Usuario
    WHERE Email = %s;
    """

    try:
        cursor.execute(query, (email,))
        user= cursor.fetchone()

        if not user:
            return None

        u_id, d_name, pwd_hash, pwd_salt= user

        if bcrypt.checkpw(pwd.encode('utf-8'), pwd_hash.encode('utf-8')):
            return {"id": u_id, "username": d_name}
        else:
            return None
    except Exception as e:
        print("erro: ",e)
        return None
    finally:
        cursor.close()
        conn.close()

##Codigo
def create_code(user_id, title, varis= None, code= None):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    varis= varis or []
    code= code or []

    query= """
    INSERT INTO Codigo (IdUsuario, Titulo, Variaveis, Codigo)
    VALUES (%s, %s, %s, %s)
    RETURNING Id;
    """

    try:
        cursor.execute(query, (user_id, title, varis, code))
        conn.commit()
        code_id= cursor.fetchone()[0]

        return code_id
    except Exception as e:
        conn.rollback()
        print("Erro ao criar usuario: ", e)
        return None
    finally:
        cursor.close()
        conn.close()

def get_all_codes(user_id):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    query= """
    SELECT Id, Titulo
    FROM Codigo
    WHERE IdUsuario = %s;
    """

    try:
        cursor.execute(query, (user_id,))
        codes= cursor.fetchall()
        return [{"id": row[0], "titulo": row[1]} for row in codes]
    except Exception as e:
        print("Erro ao captar codigos: ", e)
        return None
    finally:
        cursor.close()
        conn.close()

def get_code_details(code_id):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    query= """
    SELECT Id, Titulo, Variaveis, Codigo
    FROM Codigo
    WHERE Id = %s;
    """

    try:
        cursor.execute(query, (code_id,))
        code= cursor.fetchone()
        
        if code:
            return {
                "id": code[0],
                "titulo": code[1],
                "variaveis": code[2],
                "code": code[3]
            }
        else:
            return None
    except Exception as e:
        print("Erro ao captar detalhes do codigo: ", e)
        return None
    finally:
        cursor.close()
        conn.close()
import bcrypt
import config
import psycopg2

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
        print("erro: ", e)
        return None
    finally:
        cursor.close()
        conn.close()
    #Deixando o Id no retorno para ter um caso para sucesso
    return user_id

def verify_user(email, pwd):
    conn= psycopg2.connect(config.connection_string)
    cursor= conn.cursor()

    query= """
    SELECT Id, NomeExibicao, SenhaHash, Salt
    FROM Usuario
    WHERE Email= %s;
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
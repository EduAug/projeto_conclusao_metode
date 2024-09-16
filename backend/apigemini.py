from flask import request
from flask_cors import cross_origin
import config
import google.generativeai as genai

genai.configure(api_key=config.api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

def gemi_answer():
    prompt= request.json['prompt']
    response= model.generate_content(prompt)
    return {'response': response.text}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL= 'http://127.0.0.1:5000/ask';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  constructor(private https: HttpClient) { }

  askDQuestion(prompt: string){
    return this.https.post<any>(API_URL, {prompt});
  }
}
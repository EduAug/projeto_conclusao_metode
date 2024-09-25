import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL= 'http://127.0.0.1:5000';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  constructor(private https: HttpClient) { }

  askDQuestion(prompt: string){
    return this.https.post<any>(`${API_URL}/ask` , { prompt });
  }

  chatMessage(userMessages: string[], systemMessages: string[], prompt: string){
    const payload= {
      user_messages: userMessages,
      system_messages: systemMessages,
      prompt: prompt
    };

    return this.https.post<any>(`${API_URL}/chat`, payload);
  }

  signup(signupData: { email: string, dname: string, pwd: string}){
    return this.https.post<any>(`${API_URL}/signup`, signupData);
  }

  login(loginData: { email: string, pwd: string }){
    return this.https.post<any>(`${API_URL}/login`, loginData);
  }
  getDName(){
    const token= sessionStorage.getItem('token');
    const headers= new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.https.get<any>(`${API_URL}/displayname`, { headers });
  }

  getCodes(){
    const token= sessionStorage.getItem('token');
    const headers= new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.https.get<any>(`${API_URL}/allcodes`, { headers });
  }

  getCodeDetails(codeId: number){
    const token= sessionStorage.getItem('token');
    const headers= new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.https.get<any>(`${API_URL}/code/${codeId}`, { headers });
  }
}

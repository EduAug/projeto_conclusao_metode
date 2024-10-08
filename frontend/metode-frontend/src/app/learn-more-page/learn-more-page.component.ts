import { Component } from '@angular/core';

@Component({
  selector: 'app-learn-more-page',
  templateUrl: './learn-more-page.component.html',
  styleUrl: './learn-more-page.component.css'
})
export class LearnMorePageComponent {
  langs = [
    {
      name: "C#",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Logo_C_sharp.svg/1200px-Logo_C_sharp.svg.png",
      link1: "https://www.youtube.com/watch?v=dVzJ3bx68FA&list=PLx4x_zx8csUglgKTmgfVFEhWWBQCasNGi",
      link2: "https://www.udemy.com/course/logica-de-programacao-csharp/",
      link3: "https://www.alura.com.br/curso-online-csharp-criando-primeira-aplicacao",
    },{
      name: "Java",
      imageUrl: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/181_Java_logo_logos-512.png",
      link1: "https://www.youtube.com/watch?v=sTX0UEplF54&list=PLHz_AreHm4dkI2ZdjTwZA4mPMxWTfNSpR",
      link2: "https://www.udemy.com/course/java-programming-tutorial-for-beginners/",
      link3: "https://www.alura.com.br/formacao-java",
    },{
      name: "Ruby",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ruby_logo.svg/240px-Ruby_logo.svg.png",
      link1: "https://www.youtube.com/watch?v=2js9Q_BMD-8&list=PLdDT8if5attEOcQGPHLNIfnSFiJHhGDOZ",
      link2: "https://www.udemy.com/course/learn-to-code-with-ruby-lang/", 
      link3: "",
    },{
      name: "Dart",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dart-logo.png",
      link1: "https://www.youtube.com/watch?v=PgRv_aeqf-4&list=PLRpTFz5_57cseSiszvssXO7HKVzOsrI77",
      link2: "https://www.udemy.com/course/dart-lang-basico-avancado-api-rest/",
      link3: "https://www.alura.com.br/formacao-dart",
    },{
      name: "C++",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/1822px-ISO_C%2B%2B_Logo.svg.png",
      link1: "https://www.youtube.com/watch?v=nUQKr-ey86Y&list=PLx4x_zx8csUjczg1qPHavU1vw1IkBcm40",
      link2: "https://www.udemy.com/course/cmaismaisbasico/",
      link3: "https://www.alura.com.br/formacao-linguagem-c-plus-plus",
    },{
      name: "JavaScript",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      link1: "https://www.youtube.com/watch?v=E4DBTqgxHGM&list=PLx4x_zx8csUg_AxxbVWHEyAJ6cBdsYc0T",
      link2: "https://www.udemy.com/course/javascript-do-basico-ao-avancado-com-node-e-projetos/",
      link3: "https://www.alura.com.br/formacao-js-backend",
    },{
      name: "Python",
      imageUrl: "https://cdn.iconscout.com/icon/free/png-256/free-python-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-5-pack-logos-icons-2945099.png?f=webp&w=256",
      link1: "https://www.youtube.com/watch?v=S9uPNppGsGo&list=PLHz_AreHm4dlKP6QQCekuIPky1CiwmdI6",
      link2: "https://www.udemy.com/course/programacao-python-do-basico-ao-avancado/",
      link3: "https://www.alura.com.br/formacao-linguagem-python",
    },{
      name: "Golang",
      imageUrl: "https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_Blue.png",
      link1: "https://www.youtube.com/watch?v=WiGU_ZB-u0w&list=PLCKpcjBB_VlBsxJ9IseNxFllf-UFEXOdg",
      link2: "https://www.udemy.com/course/aprenda-golang-do-zero-desenvolva-uma-aplicacao-completa/",
      link3: "https://www.alura.com.br/formacao-go",
    },{
      name: "Rust",
      imageUrl: "https://rust-lang.org/logos/rust-logo-512x512.png",
      link1: "https://www.youtube.com/watch?v=zWXloY0sslE&list=PLjSf4DcGBdiGCNOrCoFgtj0KrUq1MRUME",
      link2: "https://www.udemy.com/course/curso-basico-de-linguagem-rust/",
      link3: "https://www.alura.com.br/formacao-rust",
    }
  ];

  openLink(url: string){
    window.open(url, "_blank");
  }
}

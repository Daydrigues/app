# 📱 React Native API App

Este projeto é um app simples em **React Native com TSX** que consome dados de uma **API pública** e exibe tudo em tela usando lista, estilização com Tailwind via NativeWind e componentes básicos.

---

## 🚀 Funcionalidades

* Consome dados da API pública **JSONPlaceholder**.
* Exibe uma lista de posts com título e corpo.
* Tela de carregamento.
* Tratamento elegante de erros com botão de tentar novamente.
* Layout responsivo com estilização usando **NativeWind** (Tailwind para RN).

---

## 🛠️ Tecnologias usadas

* **React Native**
* **TypeScript (TSX)**
* **Fetch API**
* **NativeWind** (Tailwind CSS para RN)

---

## 📦 Instalação

Clone o repositório:

```bash
git clone <URL do seu repositório>
cd nome-do-projeto
```

Instale as dependências:

```bash
npm install
```

Ou usando Yarn:

```bash
yarn install
```

---

## ▶️ Como rodar

### No Android

```bash
npm run android
```

### No iOS

```bash
npm run ios
```

### Metro bundler

```bash
npm start
```

---

## 🌐 API Utilizada

Usamos a API gratuita:

```
https://jsonplaceholder.typicode.com/posts
```

Ela retorna uma lista de posts no formato:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit..."
}
```

---

## 🧩 Estrutura do código

O app faz:

1. Busca a API ao iniciar.
2. Mostra loading enquanto espera.
3. Renderiza lista de posts.
4. Se algo der errado, exibe erro + botão de tentar novamente.

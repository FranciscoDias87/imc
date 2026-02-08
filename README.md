
# 📱 Calculadora de IMC Pro

Uma aplicação mobile moderna desenvolvida com **React Native** e **Expo**, focada em monitoramento de saúde com uma interface elegante, animações fluidas e persistência de dados local.



## ✨ Funcionalidades

- 🧮 **Cálculo de IMC Preciso:** Baseado em peso, altura, idade e sexo.
- 💡 **Dicas Personalizadas:** Sugestões de alimentação e exercícios baseadas nos resultados.
- 🕒 **Histórico em Timeline:** Acompanhamento visual da evolução do usuário ao longo do tempo.
- 🔐 **Autenticação Local:** Sistema de cadastro e login com persistência de dados.
- 🎨 **UI/UX Moderna:** Interface limpa, feedbacks táteis com `Animated` API e design responsivo.

## 🛠️ Tecnologias Utilizadas

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [React Navigation](https://reactnavigation.org/) (Stack & Tabs)
* [AsyncStorage](https://react-native-async-storage/async-storage) (Persistência de dados)
* [Lucide / Ionicons](https://icons.expo.fyi/) (Iconografia)

## 📸 Screenshots

| Login | Cadastro | Home | Histórico |
|-------|----------|------|-----------|
| ![Login](https://via.placeholder.com/200x400?text=Login+Screen) | ![Cadastro](https://via.placeholder.com/200x400?text=Register+Screen) | ![Home](https://via.placeholder.com/200x400?text=Home+Screen) | ![Histórico](https://via.placeholder.com/200x400?text=History+Screen) |

> **Dica:** Substitua as imagens acima pelos prints reais do seu app rodando!

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
```
```

2. **Instale as dependências:**

```bash
npm install
```


3. **Inicie o Expo Go:**


```bash
npx expo start
```


4. Escaneie o QR Code com o app do **Expo Go** (Android) ou a câmera (iOS).



## 📝 Detalhes Técnicos

* **Animações:** Utilização da biblioteca `Animated` para efeitos de escala em botões e transições de opacidade em cards de resultado.
* **Arquitetura:** Organização dividida em `screens`, `services` (para lógica de Storage) e `utils` (para cálculos matemáticos).
* **Feedback Visual:** Inputs com estados de foco dinâmicos e cores semânticas para as classificações do IMC.

---

Desenvolvido por **Francisco Dias**




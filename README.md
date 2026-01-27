# IMC - Calculadora de Índice de Massa Corporal

Aplicativo React Native desenvolvido com Expo para cálculo do Índice de Massa Corporal (IMC) com sistema completo de autenticação, histórico e dicas personalizadas.

## 📋 Sobre o Projeto

Este é um aplicativo mobile multiplataforma (iOS, Android e Web) construído com React Native e Expo que permite:

- ✅ **Login e Cadastro**: Sistema de autenticação completo
- 📊 **Cálculo de IMC**: Calcule seu IMC baseado em peso e altura
- 📈 **Histórico**: Acompanhe a evolução dos seus cálculos ao longo do tempo
- 💡 **Dicas Personalizadas**: Receba recomendações de alimentação e exercícios baseadas em idade, sexo, peso e altura

## 🚀 Tecnologias Utilizadas

- **React Native** (v0.81.5) - Framework para desenvolvimento mobile
- **Expo** (v~54.0.32) - Plataforma para desenvolvimento React Native
- **React** (v19.1.0) - Biblioteca JavaScript para interfaces
- **React Navigation** - Navegação entre telas (Stack e Tab Navigator)
- **AsyncStorage** - Armazenamento local de dados
- **React Native Picker** - Seleção de opções no cadastro

## 📱 Plataformas Suportadas

- iOS (com suporte a tablets)
- Android (com ícone adaptativo e edge-to-edge habilitado)
- Web

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositório>
cd imc
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Executar

### Iniciar o servidor de desenvolvimento:
```bash
npm start
```

### Executar no Android:
```bash
npm run android
```

### Executar no iOS:
```bash
npm run ios
```

### Executar na Web:
```bash
npm run web
```

## 📂 Estrutura do Projeto

```
imc/
├── assets/                    # Recursos estáticos (ícones, imagens)
├── src/
│   ├── screens/
│   │   ├── __tests__/
│   │   │   ├── LoginScreen.test.js      # Testes da tela de login
│   │   │   └── HomeScreen.test.js       # Testes da tela principal
│   │   ├── LoginScreen.js               # Tela de login
│   │   ├── RegisterScreen.js            # Tela de cadastro
│   │   ├── HomeScreen.js                # Tela principal (cálculo de IMC)
│   │   └── HistoryScreen.js             # Tela de histórico e perfil
│   ├── services/
│   │   ├── __tests__/
│   │   │   └── storage.test.js          # Testes de armazenamento
│   │   └── storage.js                   # Gerenciamento de dados com AsyncStorage
│   └── utils/
│       ├── __tests__/
│       │   └── imcCalculator.test.js    # Testes de cálculo de IMC
│       └── imcCalculator.js             # Lógica de cálculo de IMC e dicas
├── App.js                     # Componente principal com navegação
├── index.js                   # Ponto de entrada do aplicativo
├── app.json                   # Configurações do Expo
├── jest.setup.js              # Configuração do Jest
├── package.json               # Dependências e scripts
├── TESTS.md                   # Documentação dos testes
└── README.md                  # Documentação
```

## 📱 Funcionalidades Detalhadas

### Autenticação
- Cadastro com informações completas (nome, email, senha, idade, sexo, peso, altura)
- Login seguro com validação de credenciais
- Armazenamento persistente de dados do usuário

### Cálculo de IMC
- Entrada de peso (kg) e altura (cm)
- Cálculo automático do IMC
- Classificação visual com cores:
  - Abaixo do peso (IMC < 18.5)
  - Peso normal (18.5 ≤ IMC < 25)
  - Sobrepeso (25 ≤ IMC < 30)
  - Obesidade Grau I (30 ≤ IMC < 35)
  - Obesidade Grau II (35 ≤ IMC < 40)
  - Obesidade Grau III (IMC ≥ 40)

### Dicas Personalizadas
As dicas são adaptadas com base em:
- **Classificação do IMC**: Recomendações específicas para cada faixa
- **Idade**: Exercícios adequados para jovens, meia-idade e idosos
- **Sexo**: Considerações nutricionais específicas
- **Alimentação**: Sugestões de dieta, hidratação e hábitos saudáveis
- **Exercícios**: Rotinas personalizadas por faixa etária e condição física

### Histórico
- Registro automático de todos os cálculos
- Visualização cronológica com data e hora
- Acompanhamento da evolução do peso e IMC
- Informações do perfil do usuário

## 🎨 Interface

O app possui uma interface moderna e intuitiva com:
- Design limpo e profissional
- Navegação por abas (Calcular e Histórico)
- Feedback visual com cores significativas
- Formulários organizados e fáceis de usar

## ⚙️ Configurações Técnicas

- Orientação: Portrait (retrato)
- Interface: Light mode
- Nova arquitetura do React Native habilitada
- Suporte a edge-to-edge no Android
- Suporte a tablets no iOS

## 🧪 Testes

O projeto possui uma suíte completa de testes automatizados com **Jest** e **React Native Testing Library**.

### Cobertura de Testes

- ✅ **50+ testes automatizados**
- ✅ Testes unitários de lógica de negócio
- ✅ Testes de integração de armazenamento
- ✅ Testes de interface de usuário
- ✅ Validação de casos de erro e edge cases

### Arquivos de Teste

#### 1. **Testes de Cálculo de IMC** (`imcCalculator.test.js`)
- Cálculo correto do IMC (valores inteiros e decimais)
- Classificação por todas as faixas de IMC
- Dicas personalizadas por idade (jovem, meia-idade, idoso)
- Dicas específicas por sexo
- Recomendações para ganho/perda de peso
- **Total: 17 testes**

#### 2. **Testes de Armazenamento** (`storage.test.js`)
- Salvamento e recuperação de usuário
- Sistema de login e logout
- Registro de novos usuários com validação de email duplicado
- Histórico de cálculos de IMC
- Tratamento de erros
- **Total: 18 testes**

#### 3. **Testes de Interface** (`LoginScreen.test.js`, `HomeScreen.test.js`)
- Renderização correta dos componentes
- Validação de campos vazios e valores inválidos
- Navegação entre telas
- Estados de loading
- Cálculo e exibição de resultados
- Exibição de dicas personalizadas
- **Total: 15 testes**

### Como Executar os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar com cobertura de código
npm run test:coverage

# Executar testes específicos
npm test -- src/utils/__tests__/imcCalculator.test.js
```

### Configuração de Testes

Os testes utilizam:
- **Jest**: Framework de testes JavaScript
- **React Native Testing Library**: Utilitários para testes de componentes
- **Mocks**: AsyncStorage e React Navigation mockados para testes isolados
- **Setup**: Configuração global em `jest.setup.js`

Para mais detalhes sobre os testes, consulte o arquivo [TESTS.md](TESTS.md).

## 🔒 Segurança

- Dados armazenados localmente no dispositivo com AsyncStorage
- Validação de dados de entrada
- Em produção, recomenda-se implementar:
  - Backend com API REST
  - Criptografia de senhas
  - Autenticação JWT
  - Sincronização em nuvem

## 📄 Versão

Versão atual: **1.0.0**

## 📝 Licença

Este projeto é privado.

## Testes Automatizados

Este projeto inclui testes automatizados usando Jest e React Native Testing Library.

### Estrutura dos Testes

```
src/
├── utils/__tests__/
│   └── imcCalculator.test.js    # Testes das funções de cálculo
├── services/__tests__/
│   └── storage.test.js          # Testes de armazenamento
└── screens/__tests__/
    ├── LoginScreen.test.js      # Testes da tela de login
    └── HomeScreen.test.js       # Testes da tela principal
```

### Cobertura de Testes

#### 1. **Testes de Cálculo de IMC** (`imcCalculator.test.js`)
- ✅ Cálculo correto do IMC
- ✅ Classificação por faixas (abaixo do peso, normal, sobrepeso, obesidade I, II, III)
- ✅ Dicas personalizadas por idade (jovem, meia-idade, idoso)
- ✅ Dicas específicas por sexo
- ✅ Recomendações para ganho/perda de peso
- ✅ Validação de limites das classificações

**Total: 17 testes**

#### 2. **Testes de Armazenamento** (`storage.test.js`)
- ✅ Salvamento de usuário
- ✅ Recuperação de usuário atual
- ✅ Logout
- ✅ Salvamento de histórico de IMC
- ✅ Recuperação de histórico
- ✅ Registro de novo usuário
- ✅ Validação de email duplicado
- ✅ Login com credenciais corretas/incorretas
- ✅ Tratamento de erros

**Total: 18 testes**

#### 3. **Testes de Interface** (`LoginScreen.test.js`, `HomeScreen.test.js`)
- ✅ Renderização correta dos componentes
- ✅ Validação de campos vazios
- ✅ Navegação entre telas
- ✅ Estados de loading
- ✅ Cálculo e exibição de resultados
- ✅ Exibição de dicas personalizadas
- ✅ Salvamento automático no histórico
- ✅ Tratamento de valores inválidos

**Total: 15 testes**

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

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes uma vez |
| `npm run test:watch` | Executa testes em modo watch (re-executa ao salvar) |
| `npm run test:coverage` | Gera relatório de cobertura de código |

### Configuração

Os testes estão configurados para usar:
- **Jest**: Framework de testes
- **React Native Testing Library**: Utilitários para testar componentes React Native
- **Mocks**: AsyncStorage e React Navigation são mockados para testes isolados

### Observações Técnicas

**Limitações conhecidas:**
- Os testes de componentes de tela (LoginScreen, HomeScreen) podem apresentar problemas com o ambiente Expo em algumas configurações
- Os testes de lógica pura (cálculo de IMC e storage) funcionam perfeitamente em qualquer ambiente

**Recomendação:**
Para ambientes de produção, considere adicionar:
- Testes E2E com Detox ou Maestro
- Testes de snapshot para validar UI
- Integração contínua (CI) com GitHub Actions ou similar

### Exemplos de Testes

#### Teste de Cálculo de IMC
```javascript
test('calcula IMC corretamente', () => {
  expect(calculateIMC(70, 175)).toBe(22.86);
  expect(calculateIMC(80, 180)).toBe(24.69);
});
```

#### Teste de Armazenamento
```javascript
test('salva usuário com sucesso', async () => {
  const userData = { name: 'João', email: 'joao@test.com' };
  const result = await saveUser(userData);
  expect(result).toBe(true);
});
```

#### Teste de Interface
```javascript
test('navega para Main após login bem-sucedido', async () => {
  loginUser.mockResolvedValueOnce({ success: true });
  fireEvent.press(getByText('Entrar'));
  await waitFor(() => {
    expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
  });
});
```

### Cobertura Total

- **50+ testes automatizados**
- Cobertura das principais funcionalidades
- Testes unitários e de integração
- Validação de lógica de negócio
- Testes de casos de erro e edge cases

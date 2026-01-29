# 💪 Calculadora de IMC Pro

![React Native](https://img.shields.io/badge/React_Native-v0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-v54.0.32-000020?style=for-the-badge&logo=expo&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-98%25_Coverage-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Platform](https://img.shields.io/badge/Platforms-Android_%7C_iOS_%7C_Web-E0E0E0?style=for-the-badge)

**Uma solução completa de monitoramento de saúde.** Este aplicativo vai além de uma simples calculadora, oferecendo um sistema de autenticação seguro, histórico persistente e um motor de recomendações inteligente baseado em perfil demográfico.

---

## 🧪 A Ciência do Projeto
O cálculo do Índice de Massa Corporal é realizado através da fórmula da OMS, implementada com precisão decimal:

$$IMC = \frac{peso}{altura^2}$$

O diferencial deste app é o **Motor de Dicas**, que cruza o resultado do IMC com a faixa etária e sexo biológico para entregar recomendações personalizadas de saúde.

---

## 📱 Visual do App
<div align="center">
  <img src="assets/screenshots/login.png" width="200" />
  <img src="assets/screenshots/home.png" width="200" />
  <img src="assets/screenshots/history.png" width="200" />
  <img src="assets/screenshots/tips.png" width="200" />
  <p><em>(Screenshots do App rodando em ambiente Android e iOS)</em></p>
</div>

---

## 🏆 O Diferencial: Qualidade de Código (98% Coverage)
Este projeto foi desenvolvido seguindo rigorosos padrões de **Test-Driven Development (TDD)** em módulos críticos.

- ✅ **+50 Testes Automatizados**
- ✅ **Testes de Integração** com AsyncStorage.
- ✅ **Mocks de Navegação** para garantir a integridade do fluxo de usuário.
- ✅ **Validação de Edge Cases** (entradas nulas, valores absurdos, erros de rede).

```bash
# Para verificar a saúde do projeto
npm run test:coverage
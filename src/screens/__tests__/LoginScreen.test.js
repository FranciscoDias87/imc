import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { loginUser } from '../../services/storage';

jest.mock('../../services/storage');

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText('Calculadora IMC')).toBeTruthy();
    expect(getByText('Faça login para continuar')).toBeTruthy();
    expect(getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Sua senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  test('exibe erro quando campos estão vazios', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const loginButton = getByText('Entrar');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });

  test('chama loginUser com credenciais corretas', async () => {
    loginUser.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Sua senha'), '123456');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('test@test.com', '123456');
    });
  });

  test('navega para Main após login bem-sucedido', async () => {
    loginUser.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Sua senha'), '123456');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
    });
  });

  test('exibe erro quando login falha', async () => {
    loginUser.mockResolvedValueOnce({ 
      success: false, 
      message: 'Email ou senha incorretos' 
    });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Sua senha'), 'errada');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });

  test('navega para tela de cadastro', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Não tem conta? Cadastre-se'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  test('desabilita botão durante loading', async () => {
    loginUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Sua senha'), '123456');
    
    const loginButton = getByText('Entrar');
    fireEvent.press(loginButton);

    expect(getByText('Entrando...')).toBeTruthy();
  });
});

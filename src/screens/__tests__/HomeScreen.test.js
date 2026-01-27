import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { getCurrentUser, saveIMCHistory } from '../../services/storage';
import * as imcCalculator from '../../utils/imcCalculator';

jest.mock('../../services/storage');
jest.mock('../../utils/imcCalculator');

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn(),
};

const mockUser = {
  name: 'João Silva',
  email: 'joao@test.com',
  age: 30,
  gender: 'Masculino',
  weight: 75,
  height: 180,
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCurrentUser.mockResolvedValue(mockUser);
  });

  test('renderiza corretamente com dados do usuário', async () => {
    const { getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Olá, João Silva!')).toBeTruthy();
      expect(getByText('Calcule seu IMC')).toBeTruthy();
    });
  });

  test('carrega peso e altura do usuário', async () => {
    const { getByDisplayValue } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByDisplayValue('75')).toBeTruthy();
      expect(getByDisplayValue('180')).toBeTruthy();
    });
  });

  test('calcula IMC corretamente', async () => {
    imcCalculator.calculateIMC.mockReturnValue(23.15);
    imcCalculator.getIMCClassification.mockReturnValue({
      category: 'Peso normal',
      color: '#2ecc71',
    });
    imcCalculator.getPersonalizedTips.mockReturnValue({
      nutrition: ['Dica de alimentação'],
      exercise: ['Dica de exercício'],
    });

    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Olá, João Silva!')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Ex: 70.5'), '75');
    fireEvent.changeText(getByPlaceholderText('Ex: 175'), '180');
    fireEvent.press(getByText('Calcular IMC'));

    await waitFor(() => {
      expect(imcCalculator.calculateIMC).toHaveBeenCalledWith(75, 180);
      expect(getByText('23.15')).toBeTruthy();
      expect(getByText('Peso normal')).toBeTruthy();
    });
  });

  test('exibe dicas personalizadas após cálculo', async () => {
    imcCalculator.calculateIMC.mockReturnValue(27);
    imcCalculator.getIMCClassification.mockReturnValue({
      category: 'Sobrepeso',
      color: '#f39c12',
    });
    imcCalculator.getPersonalizedTips.mockReturnValue({
      nutrition: ['Beba água', 'Coma frutas'],
      exercise: ['Caminhe 30min', 'Faça musculação'],
    });

    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Olá, João Silva!')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Ex: 70.5'), '85');
    fireEvent.changeText(getByPlaceholderText('Ex: 175'), '175');
    fireEvent.press(getByText('Calcular IMC'));

    await waitFor(() => {
      expect(getByText(/Dicas de Alimentação/)).toBeTruthy();
      expect(getByText(/Dicas de Exercícios/)).toBeTruthy();
      expect(getByText('Beba água')).toBeTruthy();
      expect(getByText('Caminhe 30min')).toBeTruthy();
    });
  });

  test('salva histórico após cálculo', async () => {
    imcCalculator.calculateIMC.mockReturnValue(22.86);
    imcCalculator.getIMCClassification.mockReturnValue({
      category: 'Peso normal',
      color: '#2ecc71',
    });
    imcCalculator.getPersonalizedTips.mockReturnValue({
      nutrition: [],
      exercise: [],
    });

    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Olá, João Silva!')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Ex: 70.5'), '70');
    fireEvent.changeText(getByPlaceholderText('Ex: 175'), '175');
    fireEvent.press(getByText('Calcular IMC'));

    await waitFor(() => {
      expect(saveIMCHistory).toHaveBeenCalledWith(
        'joao@test.com',
        expect.objectContaining({
          imc: 22.86,
          weight: 70,
          height: 175,
          classification: 'Peso normal',
        })
      );
    });
  });

  test('exibe erro quando campos estão vazios', async () => {
    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Olá, João Silva!')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Ex: 70.5'), '');
    fireEvent.changeText(getByPlaceholderText('Ex: 175'), '');
    fireEvent.press(getByText('Calcular IMC'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });

  test('exibe erro para valores inválidos', async () => {
    const { getByText, getByPlaceholderText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Olá, João Silva!')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Ex: 70.5'), '-10');
    fireEvent.changeText(getByPlaceholderText('Ex: 175'), '0');
    fireEvent.press(getByText('Calcular IMC'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });
});

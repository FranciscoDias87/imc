import { calculateIMC, getIMCClassification, getPersonalizedTips } from '../imcCalculator';

describe('calculateIMC', () => {
  test('calcula IMC corretamente', () => {
    expect(calculateIMC(70, 175)).toBe(22.86);
    expect(calculateIMC(80, 180)).toBe(24.69);
    expect(calculateIMC(90, 170)).toBe(31.14);
  });

  test('calcula IMC para valores decimais', () => {
    expect(calculateIMC(68.5, 172.5)).toBe(23.02);
  });

  test('retorna valor com 2 casas decimais', () => {
    const imc = calculateIMC(75.5, 178);
    expect(imc.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});

describe('getIMCClassification', () => {
  test('classifica corretamente abaixo do peso', () => {
    const result = getIMCClassification(17.5);
    expect(result.category).toBe('Abaixo do peso');
    expect(result.color).toBe('#3498db');
  });

  test('classifica corretamente peso normal', () => {
    const result = getIMCClassification(22);
    expect(result.category).toBe('Peso normal');
    expect(result.color).toBe('#2ecc71');
  });

  test('classifica corretamente sobrepeso', () => {
    const result = getIMCClassification(27);
    expect(result.category).toBe('Sobrepeso');
    expect(result.color).toBe('#f39c12');
  });

  test('classifica corretamente obesidade grau I', () => {
    const result = getIMCClassification(32);
    expect(result.category).toBe('Obesidade Grau I');
    expect(result.color).toBe('#e67e22');
  });

  test('classifica corretamente obesidade grau II', () => {
    const result = getIMCClassification(37);
    expect(result.category).toBe('Obesidade Grau II');
    expect(result.color).toBe('#d35400');
  });

  test('classifica corretamente obesidade grau III', () => {
    const result = getIMCClassification(42);
    expect(result.category).toBe('Obesidade Grau III');
    expect(result.color).toBe('#c0392b');
  });

  test('testa limites das classificações', () => {
    expect(getIMCClassification(18.5).category).toBe('Peso normal');
    expect(getIMCClassification(24.9).category).toBe('Peso normal');
    expect(getIMCClassification(25).category).toBe('Sobrepeso');
    expect(getIMCClassification(29.9).category).toBe('Sobrepeso');
    expect(getIMCClassification(30).category).toBe('Obesidade Grau I');
  });
});

describe('getPersonalizedTips', () => {
  test('retorna dicas para sobrepeso', () => {
    const tips = getPersonalizedTips(27, 30, 'Masculino', 85, 175);
    
    expect(tips).toHaveProperty('nutrition');
    expect(tips).toHaveProperty('exercise');
    expect(tips.nutrition.length).toBeGreaterThan(0);
    expect(tips.exercise.length).toBeGreaterThan(0);
  });

  test('dicas para jovem incluem exercícios intensos', () => {
    const tips = getPersonalizedTips(27, 25, 'Masculino', 85, 175);
    
    const exerciseText = tips.exercise.join(' ');
    expect(exerciseText).toMatch(/corrida|HIIT|musculação/i);
  });

  test('dicas para meia-idade incluem exercícios moderados', () => {
    const tips = getPersonalizedTips(27, 50, 'Feminino', 75, 165);
    
    const exerciseText = tips.exercise.join(' ');
    expect(exerciseText).toMatch(/caminhada|natação|yoga/i);
  });

  test('dicas para idosos incluem exercícios leves', () => {
    const tips = getPersonalizedTips(27, 70, 'Masculino', 80, 170);
    
    const exerciseText = tips.exercise.join(' ');
    expect(exerciseText).toMatch(/caminhada|hidroginástica|alongamento/i);
  });

  test('dicas para obesidade incluem alerta médico', () => {
    const tips = getPersonalizedTips(32, 40, 'Masculino', 95, 170);
    
    const nutritionText = tips.nutrition.join(' ');
    const exerciseText = tips.exercise.join(' ');
    expect(nutritionText).toMatch(/nutricionista/i);
    expect(exerciseText).toMatch(/médico|consulte/i);
  });

  test('dicas para abaixo do peso focam em ganho', () => {
    const tips = getPersonalizedTips(17, 25, 'Masculino', 55, 175);
    
    const nutritionText = tips.nutrition.join(' ');
    const exerciseText = tips.exercise.join(' ');
    expect(nutritionText).toMatch(/aumente|proteínas|calóricos/i);
    expect(exerciseText).toMatch(/musculação|massa/i);
  });

  test('dicas para peso normal são de manutenção', () => {
    const tips = getPersonalizedTips(22, 30, 'Feminino', 60, 165);
    
    const nutritionText = tips.nutrition.join(' ');
    const exerciseText = tips.exercise.join(' ');
    expect(nutritionText).toMatch(/continue|mantenha|equilíbrio/i);
    expect(exerciseText).toMatch(/mantenha|regular/i);
  });

  test('dicas para mulheres incluem cuidados específicos', () => {
    const tips = getPersonalizedTips(22, 30, 'Feminino', 60, 165);
    
    const nutritionText = tips.nutrition.join(' ');
    expect(nutritionText).toMatch(/cálcio|ferro/i);
  });

  test('estrutura das dicas está correta', () => {
    const tips = getPersonalizedTips(25, 35, 'Masculino', 75, 175);
    
    expect(Array.isArray(tips.nutrition)).toBe(true);
    expect(Array.isArray(tips.exercise)).toBe(true);
    tips.nutrition.forEach(tip => expect(typeof tip).toBe('string'));
    tips.exercise.forEach(tip => expect(typeof tip).toBe('string'));
  });
});

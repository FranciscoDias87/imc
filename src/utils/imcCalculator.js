export const calculateIMC = (weight, height) => {
  const heightInMeters = height / 100;
  const imc = weight / (heightInMeters * heightInMeters);
  return parseFloat(imc.toFixed(2));
};

export const getIMCClassification = (imc) => {
  if (imc < 18.5) return { category: 'Abaixo do peso', color: '#3498db' };
  if (imc >= 18.5 && imc < 25) return { category: 'Peso normal', color: '#2ecc71' };
  if (imc >= 25 && imc < 30) return { category: 'Sobrepeso', color: '#f39c12' };
  if (imc >= 30 && imc < 35) return { category: 'Obesidade Grau I', color: '#e67e22' };
  if (imc >= 35 && imc < 40) return { category: 'Obesidade Grau II', color: '#d35400' };
  return { category: 'Obesidade Grau III', color: '#c0392b' };
};

export const getPersonalizedTips = (imc, age, gender, weight, height) => {
  const classification = getIMCClassification(imc);
  const tips = {
    nutrition: [],
    exercise: [],
  };

  if (imc >= 25) {
    tips.nutrition = [
      '🥗 Priorize alimentos naturais e integrais',
      '💧 Beba pelo menos 2 litros de água por dia',
      '🍎 Aumente o consumo de frutas, verduras e legumes',
      '🚫 Evite alimentos processados e ricos em açúcar',
      '🍽️ Faça refeições menores e mais frequentes',
      '🥩 Consuma proteínas magras (frango, peixe, ovos)',
      '🌾 Prefira carboidratos complexos (arroz integral, aveia)',
    ];

    const isYoung = age < 40;
    const isMiddleAge = age >= 40 && age < 60;
    
    if (isYoung) {
      tips.exercise = [
        '🏃 Corrida ou caminhada rápida: 30-40 min, 4-5x/semana',
        '🚴 Ciclismo: excelente para queimar calorias',
        '💪 Musculação: 3-4x/semana para acelerar metabolismo',
        '🏊 Natação: exercício completo e de baixo impacto',
        '⚡ HIIT: treinos intervalados de alta intensidade',
        '🤸 Exercícios funcionais e CrossFit',
      ];
    } else if (isMiddleAge) {
      tips.exercise = [
        '🚶 Caminhada: 40-50 min, 5x/semana',
        '🏊 Natação: ideal para articulações',
        '💪 Musculação leve a moderada: 3x/semana',
        '🧘 Yoga ou Pilates: flexibilidade e fortalecimento',
        '🚴 Ciclismo em ritmo moderado',
        '🏃 Corrida leve (se não houver restrições)',
      ];
    } else {
      tips.exercise = [
        '🚶 Caminhada diária: 30-40 min em ritmo confortável',
        '🏊 Hidroginástica: exercício suave nas articulações',
        '💪 Exercícios de resistência leve com elástico',
        '🧘 Alongamentos e exercícios de equilíbrio',
        '🪑 Exercícios sentados e de baixo impacto',
        '🌳 Atividades ao ar livre como tai chi',
      ];
    }

    if (imc >= 30) {
      tips.nutrition.unshift('⚠️ Considere consultar um nutricionista');
      tips.exercise.unshift('⚠️ Consulte um médico antes de iniciar exercícios intensos');
    }
  } else if (imc < 18.5) {
    tips.nutrition = [
      '🍖 Aumente o consumo de proteínas',
      '🥜 Inclua oleaginosas e gorduras saudáveis',
      '🍚 Consuma mais carboidratos complexos',
      '🥤 Faça smoothies calóricos entre as refeições',
      '🍽️ Não pule refeições',
      '⚠️ Consulte um nutricionista',
    ];

    tips.exercise = [
      '💪 Musculação: foco em ganho de massa',
      '🏋️ Exercícios de força e resistência',
      '🚫 Evite excesso de exercícios aeróbicos',
      '😴 Garanta descanso adequado entre treinos',
    ];
  } else {
    tips.nutrition = [
      '✅ Continue com alimentação balanceada',
      '🥗 Mantenha variedade de nutrientes',
      '💧 Hidratação adequada',
      '⚖️ Equilíbrio entre todos os grupos alimentares',
    ];

    tips.exercise = [
      '✅ Mantenha rotina de exercícios regular',
      '🏃 Atividades aeróbicas: 150 min/semana',
      '💪 Musculação: 2-3x/semana',
      '🤸 Exercícios de flexibilidade',
    ];
  }

  if (gender === 'Feminino') {
    tips.nutrition.push('🦴 Atenção ao consumo de cálcio e ferro');
  }

  return tips;
};

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { getCurrentUser, saveIMCHistory } from '../services/storage';
import { calculateIMC, getIMCClassification, getPersonalizedTips } from '../utils/imcCalculator';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [tips, setTips] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
    if (userData) {
      setWeight(userData.weight.toString());
      setHeight(userData.height.toString());
    }
  };

  const handleCalculate = async () => {
    if (!weight || !height) {
      Alert.alert('Erro', 'Preencha peso e altura');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum <= 0 || heightNum <= 0) {
      Alert.alert('Erro', 'Valores devem ser maiores que zero');
      return;
    }

    const imc = calculateIMC(weightNum, heightNum);
    const classification = getIMCClassification(imc);
    const personalizedTips = getPersonalizedTips(
      imc,
      user.age,
      user.gender,
      weightNum,
      heightNum
    );

    setResult({
      imc,
      classification: classification.category,
      color: classification.color,
    });
    setTips(personalizedTips);

    await saveIMCHistory(user.email, {
      imc,
      weight: weightNum,
      height: heightNum,
      classification: classification.category,
    });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Olá, {user.name}!</Text>
        <Text style={styles.subtitle}>Calcule seu IMC</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 70.5"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 175"
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Calcular IMC</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultCard, { borderLeftColor: result.color }]}>
            <Text style={styles.resultTitle}>Seu IMC</Text>
            <Text style={[styles.resultValue, { color: result.color }]}>
              {result.imc}
            </Text>
            <Text style={styles.resultClassification}>
              {result.classification}
            </Text>
          </View>
        )}

        {tips && (
          <View style={styles.tipsContainer}>
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💚 Dicas de Alimentação</Text>
              {tips.nutrition.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💪 Dicas de Exercícios</Text>
              <Text style={styles.tipsSubtitle}>
                Baseado na sua idade ({user.age} anos) e sexo ({user.gender})
              </Text>
              {tips.exercise.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 25,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 5,
  },
  resultTitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultClassification: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  tipsContainer: {
    marginBottom: 30,
  },
  tipsSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  tipsSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  tipItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tipText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
});

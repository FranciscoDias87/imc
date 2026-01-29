import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, saveIMCHistory } from '../services/storage';
import { calculateIMC, getIMCClassification, getPersonalizedTips } from '../utils/imcCalculator';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [tips, setTips] = useState(null);

  // Animação para o card de resultado aparecer suavemente
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

    // Dispara animação do resultado
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    await saveIMCHistory(user.email, {
      imc,
      weight: weightNum,
      height: heightNum,
      classification: classification.category,
    });
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.name.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>Vamos verificar sua saúde hoje?</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Novo Cálculo</Text>
          
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="speedometer-outline" size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="70.5"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Altura (cm)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="resize-outline" size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="175"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Calcular Agora</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {result && (
          <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
            <View style={[styles.colorIndicator, { backgroundColor: result.color }]} />
            <Text style={styles.resultLabel}>Seu IMC atual</Text>
            <Text style={[styles.resultValue, { color: result.color }]}>{result.imc}</Text>
            <View style={[styles.badge, { backgroundColor: result.color + '20' }]}>
              <Text style={[styles.badgeText, { color: result.color }]}>
                {result.classification}
              </Text>
            </View>
          </Animated.View>
        )}

        {tips && (
          <View style={styles.tipsContainer}>
            <View style={styles.tipSection}>
              <View style={styles.tipHeader}>
                <Ionicons name="nutrition" size={24} color="#10B981" />
                <Text style={styles.tipSectionTitle}>Alimentação</Text>
              </View>
              {tips.nutrition.map((tip, i) => (
                <Text key={i} style={styles.tipText}>• {tip}</Text>
              ))}
            </View>

            <View style={styles.tipSection}>
              <View style={styles.tipHeader}>
                <Ionicons name="bicycle" size={24} color="#4A62FF" />
                <Text style={styles.tipSectionTitle}>Exercícios</Text>
              </View>
              {tips.exercise.map((tip, i) => (
                <Text key={i} style={styles.tipText}>• {tip}</Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 20 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4 },
  content: { paddingHorizontal: 20 },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  inputGroup: { width: '48%' },
  label: { fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#1E293B', fontWeight: '600' },
  button: {
    backgroundColor: '#4A62FF',
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 8 },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  colorIndicator: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  resultLabel: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  resultValue: { fontSize: 56, fontWeight: '900', marginVertical: 5 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontWeight: '700', fontSize: 14 },
  tipsContainer: { marginBottom: 40 },
  tipSection: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipSectionTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginLeft: 10 },
  tipText: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 8 },
});
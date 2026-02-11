import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { registerUser } from '../services/storage';

const InputField = ({ label, icon, ...props }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#94A3B8" />
      <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...props} />
    </View>
  </View>
);

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Masculino');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);

  // Animação do Botão
  const scaleValue = useRef(new Animated.Value(1)).current;
  const animateIn = () => Animated.spring(scaleValue, { toValue: 0.96, useNativeDriver: true }).start();
  const animateOut = () => Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  const handleRegister = async () => {

    //Limpa de strings(remove espaços vazios acidentais, deixa o email com letra minuscula)
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    //validação de campos vazios
    if (!cleanName || !cleanEmail || !password || !age || !weight || !height) {
      Alert.alert('Erro', 'Preencha todos os campos para continuar');
      return;
    }

    //validação de email
    const emailRegex = /\S+@\S+.\S+/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert('Erro', 'Por favor insira um email válido!.');
      return;
    }

    //validação de senha
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    //conversão e validação numerica
    const nAge = parseInt(age);
    const nWeight = parseFloat(weight.replace(',', '.'));
    const nHeight = parseFloat(height.replace(',', '.'));

    //bloquio de valores impossiveis ou negativos 
    if (isNaN(nAge) || nAge <= 0 || nAge > 120) {
      Alert.alert('Erro', 'Idade Inválida(deve ser entre 1 e 120 anos.)');
      return;
    }

    if (isNaN(nWeight) || nWeight < 10 || nWeight > 500) {
      Alert.alert('Erro', 'Peso fora dos valores permitidos (deve ser entre 10 e 500 kg).');
      return;
    }

    if (isNaN(nHeight) || nHeight < 50 || nHeight > 300) {
      Alert.alert('Erro', 'Altura fora dos valores permitidos (deve ser entre 50 - 300 cm).');
      return;
    }

    //Criação do objeto de usuário para registro
    const userData = {
      name: cleanName,
      email: cleanEmail,
      password,
      age: nAge,
      gender,
      weight: nWeight,
      height: nHeight,
    };

    setLoading(true);

    try {
      const result = await registerUser(userData);
      if (result.success) {
        Alert.alert('Sucesso! 🎉', 'Conta criada! Agora faça seu login.', [
          { text: 'Ir para Login', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };//fim do handleRegister

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados de saúde</Text>

            <View style={styles.form}>
              <InputField 
              label="Nome completo" icon="person-outline" placeholder="Seu nome" value={name} 
              onChangeText={setName} 
              />
              <InputField 
              label="E-mail" icon="mail-outline" placeholder="seu@email.com" value={email} 
              onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" 
              />
              <InputField 
              label="Senha" icon="lock-closed-outline" placeholder="Sua senha" value={password} 
              onChangeText={setPassword} secureTextEntry />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <InputField
                    label="Idade"
                    icon="calendar-outline"
                    placeholder="25"
                    value={age}
                    onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad" />
                </View>
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.label}>Sexo</Text>
                  <View style={[styles.inputContainer, { paddingHorizontal: 5 }]}>
                    <Picker
                      selectedValue={gender}
                      onValueChange={setGender}
                      style={{ flex: 1, height: 50 }}
                    >
                      <Picker.Item label="Masculino" value="Masculino" fontSize={14} />
                      <Picker.Item label="Feminino" value="Feminino" fontSize={14} />
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <InputField
                    label="Peso (kg)"
                    icon="speedometer-outline"
                    placeholder="70.5"
                    value={weight}
                    keyboardType="decimal-pad"
                    onChangeText={(text) => {
                      //remove tudo que não é número, ponto ou virgula
                      let filtered = text.replace(/[^0-9.,]/g, ' ')
                      //impede mais de um separador decimal
                      if ((filtered.match(/[. , ]/g) || []).length > 1) return;
                      setWeight(filtered);
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField
                    label="Altura (cm)"
                    icon="resize-outline"
                    placeholder="175"
                    value={height}
                    keyboardType="decimal-pad"
                    onChangeText={(text) => {
                      //remove tudo que não é número, ponto ou virgula
                      let filtered = text.replace(/[^0-9.,]/g, ' ')
                      //impede mais de um separador decimal
                      if ((filtered.match(/[. , ]/g) || []).length > 1) return;
                      setHeight(filtered);
                    }}
                  />
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleValue }], marginTop: 20 }}>
                <Pressable
                  onPressIn={animateIn} onPressOut={animateOut} onPress={handleRegister}
                  disabled={loading}
                  style={[styles.button, loading && styles.buttonDisabled]}
                >
                  <Text style={styles.buttonText}>{loading ? 'Criando conta...' : 'Finalizar Cadastro'}</Text>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { flexGrow: 1, paddingBottom: 40 },
    backButton: { marginTop: 50, marginLeft: 20, width: 40, height: 40, justifyContent: 'center' },
    content: { paddingHorizontal: 25 },
    title: { fontSize: 32, fontWeight: '800', color: '#1E293B', marginTop: 10 },
    subtitle: { fontSize: 16, color: '#64748B', marginBottom: 30 },
    form: { width: '100%' },
    inputWrapper: { marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      borderRadius: 16,
      paddingHorizontal: 15,
      height: 56,
    },
    input: { flex: 1, marginLeft: 10, color: '#1E293B', fontSize: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    button: {
      backgroundColor: '#4A62FF',
      height: 58,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#4A62FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  });
    


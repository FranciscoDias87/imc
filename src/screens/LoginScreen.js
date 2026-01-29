//src/screens/LoginScreen

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
import { loginUser } from '../services/storage';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPassFocused, setIsPassFocused] = useState(false);

  // --- ANIMAÇÃO DO BOTÃO ---
  const scaleValue = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scaleValue, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const animateOut = () => {
    Animated.spring(scaleValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);
    if (result.success) {
      onLoginSuccess();
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* LOGO OU ÍCONE SUPERIOR */}
          <View style={styles.iconHeader}>
            <Ionicons name="fitness" size={80} color="#4A62FF" />
          </View>

          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Faça login para cuidar da sua saúde</Text>

          <View style={styles.form}>
            {/* INPUT EMAIL */}
            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputContainer, isEmailFocused && styles.inputFocused]}>
              <Ionicons name="mail-outline" size={20} color={isEmailFocused ? "#4A62FF" : "#94A3B8"} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* INPUT SENHA */}
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputContainer, isPassFocused && styles.inputFocused]}>
              <Ionicons name="lock-closed-outline" size={20} color={isPassFocused ? "#4A62FF" : "#94A3B8"} />
              <TextInput
                style={styles.input}
                placeholder="Sua pawwardodas"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPassFocused(true)}
                onBlur={() => setIsPassFocused(false)}
                secureTextEntry
              />
            </View>

            {/* BOTÃO ANIMADO */}
            <Animated.View style={[{ transform: [{ scale: scaleValue }], marginTop: 30 }]}>
              <Pressable
                onPressIn={animateIn}
                onPressOut={animateOut}
                onPress={handleLogin}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Text>
              </Pressable>
            </Animated.View>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.linkText}>
                Não tem conta? <Text style={styles.linkTextBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  iconHeader: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 40, marginTop: 5 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 56,
  },
  inputFocused: { borderColor: '#4A62FF', backgroundColor: '#FFFFFF' },
  input: { flex: 1, marginLeft: 10, color: '#1E293B', fontSize: 16 },
  button: {
    backgroundColor: '#4A62FF',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A62FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  linkButton: { marginTop: 25, alignItems: 'center' },
  linkText: { color: '#64748B', fontSize: 15 },
  linkTextBold: { color: '#4A62FF', fontWeight: '700' },
});
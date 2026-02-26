import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { resetPassword } from "../services/storage";

export default function ForgotPasswordScreen(navigation) {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu email.");
      return;
    }
    const result = await resetPassword(email);
    if (result.success){
      Alert.alert("E-mail enviado!", "Verifique sua caixa de entrada.");
      navigation.goBack(); // Volta para a tela de login
    }else{
      Alert.alert("Erro", "Falha ao enviar e-mail de redefinição de senha.");
    }
  }

  return(
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci minha senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, borderColor: '#CCC', marginBottom: 30, padding: 10 },
  button: { backgroundColor: '#4A62FF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' }
});
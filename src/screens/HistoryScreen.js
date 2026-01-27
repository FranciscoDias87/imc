import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getCurrentUser, getIMCHistory, logout } from '../services/storage';

export default function HistoryScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
    if (userData) {
      const historyData = await getIMCHistory(userData.email);
      setHistory(historyData);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Histórico</Text>
          <Text style={styles.headerSubtitle}>{user.name}</Text>
          <Text style={styles.headerInfo}>
            {user.age} anos • {user.gender} • {user.height}cm
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum cálculo ainda</Text>
            <Text style={styles.emptyText}>
              Calcule seu IMC na tela inicial para ver o histórico aqui
            </Text>
          </View>
        ) : (
          history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              </View>
              <View style={styles.historyContent}>
                <View style={styles.historyItem}>
                  <Text style={styles.historyLabel}>IMC</Text>
                  <Text style={styles.historyValue}>{item.imc}</Text>
                </View>
                <View style={styles.historyItem}>
                  <Text style={styles.historyLabel}>Peso</Text>
                  <Text style={styles.historyValue}>{item.weight} kg</Text>
                </View>
                <View style={styles.historyItem}>
                  <Text style={styles.historyLabel}>Altura</Text>
                  <Text style={styles.historyValue}>{item.height} cm</Text>
                </View>
              </View>
              <Text style={styles.historyClassification}>
                {item.classification}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  headerInfo: {
    fontSize: 14,
    color: '#ecf0f1',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  historyHeader: {
    marginBottom: 15,
  },
  historyDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  historyItem: {
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  historyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  historyClassification: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
    textAlign: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, getIMCHistory, logout } from '../services/storage';
import { getIMCClassification } from '../utils/imcCalculator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HistoryScreen({ navigation, onLogout }) {
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
      const historyData = await getIMCHistory(userData.id);
      setHistory(historyData);
    }
  };

  // Função para formatar a data de forma amigável
  const formateDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  // Função para formatar a hora de forma amigável
  const formateTime = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          onLogout();
        },
      },
    ]);
  };

  const handleDelete = async (id) => {
    Alert.alert('Excluir Registro',
      'Tem certeza que deseja excluir este registro do histórico?', 
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            const success = await deleteImcHistory(id);
            if (success) {
             setHistory(history.filter(item => item.id !== id))
            }else{
              Alert.alert('Erro', 'Não foi possível excluir o registro. Tente novamente mais tarde.');
            }          
          loadData();
        } },
      ]); 
    }

    const renderRightActions = (id)=>{
      return(
        <TouchableOpacity          
          style={styles.deleteAction}
          onPress={() => handleDelete(id)}
        >
          <Ionicons name="trash-outline" size={24} color="#FFF" />
          <Text style={styles.deleteActionText}>Excluir</Text>
        </TouchableOpacity>
      )
    }
  
  if (!user) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* HEADER MODERNO */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Meu Histórico</Text>
              <Text style={styles.headerSubtitle}>{user.name}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* CARD DE PERFIL RÁPIDO */}
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>
              {user.age} anos • {user.gender} • {user.height}cm
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={80} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Sem registros</Text>
              <Text style={styles.emptyText}>
                Seus cálculos aparecerão aqui para você acompanhar sua evolução.
              </Text>
            </View>
          ) : (
            history.map((item, index) => {
              // 1. Pegamos as informações de cor baseadas no IMC salvo
              const categoryInfo = getIMCClassification(item.imc);

              // 2. Formatamos a data (vinda do 'created_at' do Supabase)
              const dateParts = formatDate(item.created_at).split(' ');
              const day = dateParts[0];
              const month = dateParts[1];

              return (
                <View key={item.id || index} style={styles.historyCard}>
                  {/* SIDEBAR COM DATA */}
                  <View style={styles.cardSidebar}>
                    <Text style={styles.dateDay}>{day}</Text>
                    <Text style={styles.dateMonth}>{month}</Text>
                    <View style={styles.timelineLine} />
                  </View>
                  {/* CARD DESLIZAVEL */}
                  <Swipeable
                    renderRightActions={() => renderRightActions(item.id)}
                    friction={2}
                    rightThreshold={40}
                  >

                    {/* CONTEÚDO DO CARD */}
                    <View style={styles.cardMain}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardTime}>{formatTime(item.created_at)}</Text>
                        {/* Aplicando a cor dinâmica na classificação */}
                        <Text style={[styles.classificationText, { color: categoryInfo.color }]}>
                          {item.classification}
                        </Text>
                      </View>

                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>IMC</Text>
                          {/* IMC com cor dinâmica */}
                          <Text style={[styles.statValue, { color: categoryInfo.color }]}>
                            {item.imc.toFixed(1)}
                          </Text>
                        </View>

                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Peso</Text>
                          <Text style={styles.statValue}>{item.weight}kg</Text>
                        </View>

                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Altura</Text>
                          <Text style={styles.statValue}>{item.height}cm</Text>
                        </View>
                      </View>
                    </View>
                  </Swipeable>
                </View>
              );//fim do return do map
            }) //fim do map
          )
          }
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#4A62FF',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
  },
  profileBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
  },
  profileBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 20 },

  // ESTILO DE TIMELINE
  historyCard: { flexDirection: 'row', marginBottom: 20 },
  cardSidebar: { alignItems: 'center', width: 50, marginRight: 15 },
  dateDay: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  dateMonth: { fontSize: 12, fontWeight: '600', color: '#64748B', textTransform: 'uppercase' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginTop: 10, borderRadius: 1 },

  cardMain: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTime: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  classificationText: { fontSize: 12, fontWeight: '700', color: '#4A62FF' },
  statsRow: { flexDirection: 'row', gap: 30 },
  statItem: { flexDirection: 'column' },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 2 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1E293B' },

  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#475569', marginTop: 20 },
  emptyText: { fontSize: 15, color: '#94A3B8', textAlign: 'center', marginTop: 10, paddingHorizontal: 40 },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center', 
    alignItems: 'center',
    width:80,
    height: '88%',
    borderRadius: 12,
    marginLeft: 10,    
  },
  deleteActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  }
});
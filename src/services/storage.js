import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUser = async (userData) => {
  try {
    await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('currentUser');
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return false;
  }
};

export const saveIMCHistory = async (email, imcData) => {
  try {
    const historyKey = `history_${email}`;
    const existingHistory = await AsyncStorage.getItem(historyKey);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    history.unshift({
      ...imcData,
      date: new Date().toISOString(),
    });
    
    await AsyncStorage.setItem(historyKey, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
    return false;
  }
};

export const getIMCHistory = async (email) => {
  try {
    const historyKey = `history_${email}`;
    const history = await AsyncStorage.getItem(historyKey);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
};

export const registerUser = async (userData) => {
  try {
    const usersKey = 'registered_users';
    const existingUsers = await AsyncStorage.getItem(usersKey);
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    
    const userExists = users.find(u => u.email === userData.email);
    if (userExists) {
      return { success: false, message: 'Email já cadastrado' };
    }
    
    users.push(userData);
    await AsyncStorage.setItem(usersKey, JSON.stringify(users));
    return { success: true };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return { success: false, message: 'Erro ao cadastrar' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const usersKey = 'registered_users';
    const existingUsers = await AsyncStorage.getItem(usersKey);
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      await saveUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: 'Email ou senha incorretos' };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, message: 'Erro ao fazer login' };
  }
};

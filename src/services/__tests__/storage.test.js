import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveUser,
  getCurrentUser,
  logout,
  saveIMCHistory,
  getIMCHistory,
  registerUser,
  loginUser,
} from '../storage';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('saveUser', () => {
  test('salva usuário com sucesso', async () => {
    const userData = { name: 'João', email: 'joao@test.com' };
    const result = await saveUser(userData);
    
    expect(result).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'currentUser',
      JSON.stringify(userData)
    );
  });

  test('retorna false em caso de erro', async () => {
    AsyncStorage.setItem.mockRejectedValueOnce(new Error('Erro'));
    const result = await saveUser({ name: 'João' });
    
    expect(result).toBe(false);
  });
});

describe('getCurrentUser', () => {
  test('retorna usuário salvo', async () => {
    const userData = { name: 'João', email: 'joao@test.com' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(userData));
    
    const result = await getCurrentUser();
    
    expect(result).toEqual(userData);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('currentUser');
  });

  test('retorna null quando não há usuário', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const result = await getCurrentUser();
    
    expect(result).toBe(null);
  });

  test('retorna null em caso de erro', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Erro'));
    
    const result = await getCurrentUser();
    
    expect(result).toBe(null);
  });
});

describe('logout', () => {
  test('remove usuário com sucesso', async () => {
    const result = await logout();
    
    expect(result).toBe(true);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('currentUser');
  });

  test('retorna false em caso de erro', async () => {
    AsyncStorage.removeItem.mockRejectedValueOnce(new Error('Erro'));
    
    const result = await logout();
    
    expect(result).toBe(false);
  });
});

describe('saveIMCHistory', () => {
  test('salva histórico com sucesso', async () => {
    const email = 'joao@test.com';
    const imcData = { imc: 22.5, weight: 70, height: 175 };
    
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const result = await saveIMCHistory(email, imcData);
    
    expect(result).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  test('adiciona ao histórico existente', async () => {
    const email = 'joao@test.com';
    const existingHistory = [{ imc: 23, date: '2026-01-20' }];
    const newData = { imc: 22.5, weight: 70, height: 175 };
    
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingHistory));
    
    await saveIMCHistory(email, newData);
    
    const savedData = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(savedData.length).toBe(2);
    expect(savedData[0].imc).toBe(22.5);
  });

  test('adiciona data automaticamente', async () => {
    const email = 'joao@test.com';
    const imcData = { imc: 22.5 };
    
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    
    await saveIMCHistory(email, imcData);
    
    const savedData = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(savedData[0]).toHaveProperty('date');
    expect(savedData[0].date).toBeTruthy();
  });
});

describe('getIMCHistory', () => {
  test('retorna histórico salvo', async () => {
    const email = 'joao@test.com';
    const history = [{ imc: 22.5, date: '2026-01-27' }];
    
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(history));
    
    const result = await getIMCHistory(email);
    
    expect(result).toEqual(history);
  });

  test('retorna array vazio quando não há histórico', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const result = await getIMCHistory('joao@test.com');
    
    expect(result).toEqual([]);
  });

  test('retorna array vazio em caso de erro', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Erro'));
    
    const result = await getIMCHistory('joao@test.com');
    
    expect(result).toEqual([]);
  });
});

describe('registerUser', () => {
  test('cadastra novo usuário com sucesso', async () => {
    const userData = {
      name: 'João',
      email: 'joao@test.com',
      password: '123456',
      age: 30,
      gender: 'Masculino',
      weight: 75,
      height: 180,
    };
    
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    
    const result = await registerUser(userData);
    
    expect(result.success).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  test('não permite email duplicado', async () => {
    const existingUsers = [
      { email: 'joao@test.com', name: 'João' }
    ];
    
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingUsers));
    
    const result = await registerUser({
      email: 'joao@test.com',
      name: 'João 2',
      password: '123456',
    });
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Email já cadastrado');
  });

  test('adiciona usuário à lista existente', async () => {
    const existingUsers = [
      { email: 'maria@test.com', name: 'Maria' }
    ];
    const newUser = { email: 'joao@test.com', name: 'João' };
    
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingUsers));
    
    await registerUser(newUser);
    
    const savedData = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(savedData.length).toBe(2);
    expect(savedData[1].email).toBe('joao@test.com');
  });

  test('retorna erro em caso de falha', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Erro'));
    
    const result = await registerUser({ email: 'test@test.com' });
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Erro ao cadastrar');
  });
});

describe('loginUser', () => {
  test('faz login com credenciais corretas', async () => {
    const users = [
      { email: 'joao@test.com', password: '123456', name: 'João' }
    ];
    
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(users));
    
    const result = await loginUser('joao@test.com', '123456');
    
    expect(result.success).toBe(true);
    expect(result.user.name).toBe('João');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  test('falha com senha incorreta', async () => {
    const users = [
      { email: 'joao@test.com', password: '123456', name: 'João' }
    ];
    
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(users));
    
    const result = await loginUser('joao@test.com', 'senha_errada');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Email ou senha incorretos');
  });

  test('falha com email não cadastrado', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    
    const result = await loginUser('naoexiste@test.com', '123456');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Email ou senha incorretos');
  });

  test('retorna erro em caso de falha', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Erro'));
    
    const result = await loginUser('test@test.com', '123456');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Erro ao fazer login');
  });
});

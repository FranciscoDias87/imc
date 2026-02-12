import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabaseConfig";

const USER_KEY = "@imc_user_profile"; //chave para armazenar o perfil do usuário no AsyncStorage

// --- Funções Auxiliares --- //
export const saveUser = async (useProfile) =>{
  try{
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(useProfile));
    console.log("Usuário salvo com sucesso:", useProfile);
    //return true;
  }catch(error){
    console.error("Erro ao salvar usuário:", error);
    return false;
  }
}

export const getCurrentUser = async () =>{
  try{
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    console.log("Usuário obtido do AsyncStorage:", jsonValue);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  }catch(error){
    console.error("Erro ao obter usuário:", error);
    return null;
  }
}

export const logout = async () =>{
  try{
    await supabase.auth.signOut(); //Desloga no supabase
    await AsyncStorage.removeItem(USER_KEY); //limpa cache local
    return true;
  }catch(error){    
    console.error("Erro ao fazer logout:", error);
    return false;
  }
}

// -- AUTENTICAÇÃO COM SUPABASE-- //
export const registerUser = async(userData) =>{
  try{
    //verificação para evitar dados incompletos
    if(!userData || !userData.email){
      return {success: false, message: "Dados de registro incompletos."};
    }

    //limpeza de dados
    const email = userData.email.trim().toLowerCase();
    const password = userData.password.trim();

    const { data, error} = await supabase.auth.signUp({
      email: email,
      password: password,
      options:{
        data:{
          full_name: userData.name,
          age: userData.age,
          gender: userData.gender,
          weight: userData.weight,
          height: userData.height,
        }
      }
    });

    if (error){
      //tratar erro comum(email ja existente)
      if(error.message.includes("already registered")){
        return{success: false, message: "Email já registrado. Por favor, use outro email."};
      }
      return {success: false, message: error.message};
    }
    return {success: true, user: data.user};
  }catch(error){
    console.error("Erro ao registrar usuário:", error);
    return null;
  }
}

export const loginUser = async (email, password) => {
  try{
    const cleanEmail = email.trim().toLowerCase();
    const cleanPasswoard = password.trim();
    const { data, error} = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPasswoard
    });
    if (error){
      return{success: false, message: "Email ou senha incorretos. Por favor, tente novamente."};
    }
    //criamos um objeto do pertfil com os metadados que salvamos no registro
    const userProfile = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.full_name || "Usuário",
      age: data.user.user_metadata.age,
      gender: data.user.user_metadata.gender,
      weight: data.user.user_metadata.weight,
      height: data.user.user_metadata.height

  };
  //salvamos o perfil do usuário no AsyncStorage para manter a sessão ativa
  await saveUser(userProfile);
  return {success: true, user: userProfile};
  }catch(error){
    console.error("Erro ao fazer login: ", error);
    return {success: false, message:"Erro ao conectar ao servidor."};
  }}

// -- HISTÓRICO DE IMC, AGORA NA NUVEM -- //
export const saveIMCHistory = async (userId, data) =>{
  try{
    //salvando a tabela 'imc_history' no supabase
    const {error} = await supabase
    .from('imc_history')
    .insert([
      {
        user_id: userId,
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        imc: parseFloat(data.imc),
        classification: data.classification        
      }
    ]);

    if (error) throw error;
    return true;
  }catch(error){
    console.error("Erro ao salvar histórico de IMC no Supabase: ", error);
    return false;
  }
}

export const getIMCHistory = async (userId) =>{
  try{
    const { data, error} = await supabase
    .from('imc_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {ascending: false});
    if (error) throw error;
    return data || []; //retorna um array vazio se não houver dados
  }catch(error){
    console.error("Erro ao obter histórico de IMC do Supabase: ", error);
    return [];
  }
}

export const deleteIMCRecord = async (recordId)=>{
  try{
    const {error} = await supabase
    .from('imc_history')
    .delete()
    .eq('id', recordId); //deleta o registro que estiver neste Id
    
    if(error) throw error;
    return true;
  }catch(error){
    console.error("Erro ao deletar registro de IMC: ", error);
    return false;
  }
}



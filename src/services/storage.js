import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabaseConfig";

// --- Funções Auxiliares --- //
export const saveUser = async (userData) =>{
  try{
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    return true;
  }catch(error){
    console.error("Erro ao salvar usuário:", error);
    return false;
  }
}

export const getCurrentUser = async () =>{
  try{
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }catch(error){
    console.error("Erro ao obter usuário:", error);
    return null;
  }
}

export const logout = async () =>{
  try{
    await supabase.auth.signOut(); //Desloga no supabase
    await AsyncStorage.removeItem('currentUser'); //limpa cache local
    return true;
  }catch(error){    
    console.error("Erro ao fazer logout:", error);
    return false;
  }
}

// -- AUTENTICAÇÃO COM SUPABASE-- //
export const registerUser = async(userData) =>{
  try{
    const { data, error} = await supabase.auth.signUp({
      email: userData.email.trim().tolowerCase(),
      password: userData.password.trim(),
      options:{
        data:{
          full_name: userData.name,
          age: userData.age,
          gender: userData.gender,
          wheight: userData.wheight,
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
    const cleanEmail = email.trim().tolowerCase();
    const cleanPasswoard = password.trim();

    const { data, error} = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanEmail
    });

    if (error){
      return{success: false, message: "Email ou senha incorretos. Por favor, tente novamente."};
    }

    //criamos um objeto do pertfil com os metadados que salvamos no registro
    const userProfile = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.full_name,
      age: data.user.user_metadata.age,
      gender: data.user.user_metadata.gender,
      wheight: data.user.user_metadata.wheight,
      height: data.user.user_metadata

  };
  //salvamos o perfil do usuário no AsyncStorage para manter a sessão ativa
  await saveUser(userProfile);

  return {success: true, user: userProfile};

  }catch(error){
    console.error("Erro ao fazer login: ", error);
    return {success: false, message:"Erro ao conectar ao servidor."};
  }
}

// -- HISTÓRICO DE IMC, AGORA NA NUVEM -- //
export const saveImcHisory = async (userId, imcData) =>{
  try{
    //salvando a tabela 'imc_history' no supabase
    const {error} = await supabase
    .from('imc_history')
    .insert([
      {
        user_id: userId,
        wheight: imcData.wheight,
        height: imcData.height,
        imc: imcData.imc,
        classification: imcData.classification        
      }
    ]);

    if (error) throw error;
    return true;
  }catch(error){
    console.error("Erro ao salvar histórico de IMC no Supabase: ", error);
    return false;
  }
}

export const getImcHistory = async (userId) =>{
  try{
    const { data, error} = await supabase
    .from('imc_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {ascending: false});
    if (error) throw error;
    return data || [ ]; //retorna um array vazio se não houver dados
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



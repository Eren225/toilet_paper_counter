import { supabaseClient } from './supabase';

export const AuthService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return session;
  },
  
  async getUserProfile(userId: string) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async getAllProfiles() {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data;
  },

  async updateProfileName(profileId: string, name: string) {
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({ name })
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

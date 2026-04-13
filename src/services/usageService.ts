import { supabaseClient } from './supabase';

export const UsageService = {
  async incrementRoll(userId: string, packId: string) {
    const { data, error } = await supabaseClient
      .from('usages')
      .insert({ user_id: userId, pack_id: packId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUsagesForPack(packId: string) {
    const { data, error } = await supabaseClient
      .from('usages')
      .select('*')
      .eq('pack_id', packId);

    if (error) throw error;
    return data;
  },

  async getAllUsages() {
    const { data, error } = await supabaseClient
      .from('usages')
      .select('*, user:profiles!user_id(name)');

    if (error) throw error;
    return data || [];
  }
};

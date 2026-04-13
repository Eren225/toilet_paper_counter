import { supabaseClient } from './supabase';

export const PackService = {
  async getCurrentPack() {
    const { data, error } = await supabaseClient
      .from('packs')
      .select('*, buyer:profiles!buyer_id(name)') 
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows
    return data || null;
  },

  async createNewPack(buyerId: string, totalRolls: number) {
    // 1. Deactivate current pack
    await supabaseClient
      .from('packs')
      .update({ is_active: false })
      .eq('is_active', true);

    // 2. Insert new pack
    const { data, error } = await supabaseClient
      .from('packs')
      .insert({ buyer_id: buyerId, total_rolls: totalRolls, is_active: true })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllPacks() {
    const { data, error } = await supabaseClient
      .from('packs')
      .select('*, buyer:profiles!buyer_id(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updatePackTotalRolls(packId: string, totalRolls: number) {
    const { data, error } = await supabaseClient
      .from('packs')
      .update({ total_rolls: totalRolls })
      .eq('id', packId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

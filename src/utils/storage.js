import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILES: '@melly_profiles',
  ACTIVE_PROFILE: '@melly_active_profile',
  RECORDS: '@melly_records_',
  SETTINGS: '@melly_settings_',
};

// ============ PERFILES ============

export const getProfiles = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROFILES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting profiles:', error);
    return [];
  }
};

export const saveProfile = async (profile) => {
  try {
    const profiles = await getProfiles();
    const newProfile = {
      id: Date.now().toString(),
      name: profile.name,
      createdAt: new Date().toISOString(),
      settings: {
        days: profile.days || {
          lunes: { active: true, meal: 'Desayuno', timeBefore: '06:00', timeAfter: '08:00' },
          miercoles: { active: true, meal: 'Comida', timeBefore: '12:00', timeAfter: '14:00' },
          viernes: { active: true, meal: 'Cena', timeBefore: '18:00', timeAfter: '20:00' },
        },
        notifications: true,
      },
    };
    const updated = [...profiles, newProfile];
    await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(updated));
    return newProfile;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const deleteProfile = async (profileId) => {
  try {
    const profiles = await getProfiles();
    const updated = profiles.filter(p => p.id !== profileId);
    await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(updated));
    await AsyncStorage.removeItem(KEYS.RECORDS + profileId);
    await AsyncStorage.removeItem(KEYS.SETTINGS + profileId);
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
};

export const updateProfile = async (profileId, updates) => {
  try {
    const profiles = await getProfiles();
    const updated = profiles.map(p => 
      p.id === profileId ? { ...p, ...updates } : p
    );
    await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

// ============ PERFIL ACTIVO ============

export const getActiveProfile = async () => {
  try {
    const id = await AsyncStorage.getItem(KEYS.ACTIVE_PROFILE);
    if (!id) return null;
    const profiles = await getProfiles();
    return profiles.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting active profile:', error);
    return null;
  }
};

export const setActiveProfile = async (profileId) => {
  try {
    await AsyncStorage.setItem(KEYS.ACTIVE_PROFILE, profileId);
  } catch (error) {
    console.error('Error setting active profile:', error);
  }
};

// ============ REGISTROS ============

export const getRecords = async (profileId) => {
  try {
    const data = await AsyncStorage.getItem(KEYS.RECORDS + profileId);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting records:', error);
    return [];
  }
};

export const saveRecord = async (profileId, record) => {
  try {
    const existing = await getRecords(profileId);
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      timestamp: new Date().toISOString(),
    };
    const updated = [newRecord, ...existing];
    await AsyncStorage.setItem(KEYS.RECORDS + profileId, JSON.stringify(updated));
    return newRecord;
  } catch (error) {
    console.error('Error saving record:', error);
    throw error;
  }
};

export const clearRecords = async (profileId) => {
  try {
    await AsyncStorage.removeItem(KEYS.RECORDS + profileId);
  } catch (error) {
    console.error('Error clearing records:', error);
  }
};

// ============ CONFIGURACIÓN ============

export const getSettings = async (profileId) => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS + profileId);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

export const saveSettings = async (profileId, settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS + profileId, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

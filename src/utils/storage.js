import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@glucose_records';

// Guardar un nuevo registro
export const saveRecord = async (record) => {
  try {
    const existing = await getRecords();
    const newRecord = {
      id: Date.now(),
      ...record,
      timestamp: new Date().toISOString(),
    };
    const updated = [newRecord, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (error) {
    console.error('Error saving record:', error);
    throw error;
  }
};

// Obtener todos los registros
export const getRecords = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting records:', error);
    return [];
  }
};

// Borrar todos los registros (para testing)
export const clearRecords = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing records:', error);
  }
};

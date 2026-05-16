import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getRecords, clearRecords } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function RecordsScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar registros cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const loadRecords = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Borrar registros',
      '¿Estás segura de borrar todos los registros?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Borrar', 
          style: 'destructive',
          onPress: async () => {
            await clearRecords();
            loadRecords();
          }
        },
      ]
    );
  };

  // Calcular estadísticas
  const thisWeekRecords = records.filter(r => {
    const recordDate = new Date(r.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  });

  const average = thisWeekRecords.length > 0
    ? Math.round(thisWeekRecords.reduce((sum, r) => sum + r.value, 0) / thisWeekRecords.length)
    : 0;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        {/* Header con blur */}
        <BlurView intensity={80} tint="light" style={styles.header_blur}>
          <View style={styles.header}>
            <Text style={styles.title}>Registros</Text>
            {records.length > 0 && (
              <TouchableOpacity onPress={handleClear}>
                <Ionicons name="trash-outline" size={24} color="#E53935" />
              </TouchableOpacity>
            )}
          </View>
        </BlurView>

        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.scroll_content}
          showsVerticalScrollIndicator={false}
        >
          
          {/* Stats rápidas */}
          <View style={styles.stats}>
            <View style={styles.stat_box}>
              <Ionicons name="calendar-outline" size={24} color="#666" />
              <Text style={styles.stat_value}>{thisWeekRecords.length}</Text>
              <Text style={styles.stat_label}>Esta semana</Text>
            </View>
            <View style={styles.stat_box}>
              <Ionicons name="pulse-outline" size={24} color="#00C853" />
              <Text style={[styles.stat_value, { color: '#00C853' }]}>{average || '--'}</Text>
              <Text style={styles.stat_label}>Promedio</Text>
            </View>
          </View>

          {/* Lista de registros */}
          <View style={styles.records}>
            <Text style={styles.section_title}>Últimas mediciones</Text>
            
            {loading ? (
              <Text style={styles.empty_text}>Cargando...</Text>
            ) : records.length === 0 ? (
              <Text style={styles.empty_text}>No hay registros aún</Text>
            ) : (
              records.map(record => (
                <View key={record.id} style={styles.record_card}>
                  <View style={styles.record_left}>
                    <Text style={styles.record_day}>{record.dayName}</Text>
                    <Text style={styles.record_date}>{record.date}</Text>
                  </View>
                  <View style={styles.record_center}>
                    <Text style={styles.record_meal}>{record.meal}</Text>
                    <Text style={styles.record_moment}>{record.moment}</Text>
                  </View>
                  <View style={styles.record_right}>
                    <Text style={[
                      styles.record_value,
                      record.status === 'Normal' && { color: '#00C853' },
                      record.status === 'Elevado' && { color: '#FFC107' },
                      (record.status === 'Bajo' || record.status === 'Alto') && { color: '#E53935' },
                    ]}>
                      {record.value}
                    </Text>
                    <Text style={styles.record_unit}>mg/dL</Text>
                  </View>
                </View>
              ))
            )}
          </View>

        </ScrollView>

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header_blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  scroll: {
    flex: 1,
  },
  scroll_content: {
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 100,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  stat_box: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  stat_value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  stat_label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  records: {
    paddingBottom: 24,
  },
  section_title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  record_card: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  record_left: {
    flex: 1,
  },
  record_day: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  record_date: {
    fontSize: 13,
    color: '#999',
  },
  record_center: {
    flex: 1,
  },
  record_meal: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  record_moment: {
    fontSize: 13,
    color: '#999',
  },
  record_right: {
    alignItems: 'flex-end',
  },
  record_value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  record_unit: {
    fontSize: 11,
    color: '#999',
  },
  empty_text: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});

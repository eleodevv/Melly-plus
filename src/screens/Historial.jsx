import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function Historial() {
  const { records, refreshRecords, profile } = useApp();

  useFocusEffect(
    useCallback(() => {
      refreshRecords();
    }, [])
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.subtitle}>{profile?.name || ''}</Text>
        </View>

        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.scroll_content}
          showsVerticalScrollIndicator={false}
        >
          
          {records.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={64} color="#E8E8E8" />
              <Text style={styles.empty_title}>Sin registros</Text>
              <Text style={styles.empty_sub}>Tus mediciones aparecerán aquí</Text>
            </View>
          ) : (
            records.map(record => (
              <View key={record.id} style={styles.record_card}>
                <View style={styles.record_top}>
                  <View style={styles.record_left}>
                    <Text style={styles.record_day}>{record.dayName}</Text>
                    <Text style={styles.record_date}>{record.date}</Text>
                  </View>
                  <Text style={[
                    styles.record_value,
                    record.status === 'Normal' && { color: '#43A047' },
                    record.status === 'Elevado' && { color: '#FB8C00' },
                    (record.status === 'Bajo' || record.status === 'Alto') && { color: '#E53935' },
                  ]}>
                    {record.value} <Text style={styles.record_unit}>mg/dL</Text>
                  </Text>
                </View>
                <View style={styles.record_bottom}>
                  <View style={styles.record_tag}>
                    <Text style={styles.record_tag_text}>{record.meal} · {record.moment}</Text>
                  </View>
                  {record.food && record.food !== 'No registrado' && (
                    <Text style={styles.record_food}>🍽 {record.food}</Text>
                  )}
                </View>
              </View>
            ))
          )}

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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  scroll: {
    flex: 1,
  },
  scroll_content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  empty_title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  empty_sub: {
    fontSize: 15,
    color: '#999',
  },
  record_card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  record_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  record_left: {},
  record_day: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  record_date: {
    fontSize: 13,
    color: '#999',
  },
  record_value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  record_unit: {
    fontSize: 13,
    fontWeight: '500',
    color: '#999',
  },
  record_bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  record_tag: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  record_tag_text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  record_food: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
});

import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getWeeklyAnalysis } from '../utils/glucose';

export default function Analisis() {
  const { records, profile } = useApp();
  const analysis = getWeeklyAnalysis(records);

  const getTrendIcon = (trend) => {
    if (trend === 'subiendo') return { icon: 'trending-up', color: '#FB8C00' };
    if (trend === 'bajando') return { icon: 'trending-down', color: '#43A047' };
    return { icon: 'remove-outline', color: '#666' };
  };

  const trendInfo = getTrendIcon(analysis.trend);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Análisis Semanal</Text>
          <Text style={styles.subtitle}>{profile?.name || 'Sin perfil'}</Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scroll_content}>
          
          {analysis.count === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="analytics-outline" size={64} color="#E8E8E8" />
              <Text style={styles.empty_title}>Sin datos esta semana</Text>
              <Text style={styles.empty_sub}>Registra tu glucosa para ver el análisis</Text>
            </View>
          ) : (
            <>
              {/* Resumen */}
              <View style={styles.summary_card}>
                <Text style={styles.summary_label}>PROMEDIO SEMANAL</Text>
                <Text style={styles.summary_value}>{analysis.average}</Text>
                <Text style={styles.summary_unit}>mg/dL</Text>
                <View style={styles.trend_row}>
                  <Ionicons name={trendInfo.icon} size={20} color={trendInfo.color} />
                  <Text style={[styles.trend_text, { color: trendInfo.color }]}>
                    Tendencia {analysis.trend}
                  </Text>
                </View>
              </View>

              {/* Stats grid */}
              <View style={styles.grid}>
                <View style={styles.grid_item}>
                  <Ionicons name="checkmark-circle" size={28} color="#43A047" />
                  <Text style={styles.grid_value}>{analysis.normalCount}</Text>
                  <Text style={styles.grid_label}>Normales</Text>
                </View>
                <View style={styles.grid_item}>
                  <Ionicons name="warning" size={28} color="#FB8C00" />
                  <Text style={styles.grid_value}>{analysis.elevatedCount}</Text>
                  <Text style={styles.grid_label}>Elevados</Text>
                </View>
                <View style={styles.grid_item}>
                  <Ionicons name="arrow-up" size={28} color="#E53935" />
                  <Text style={styles.grid_value}>{analysis.highest}</Text>
                  <Text style={styles.grid_label}>Más alto</Text>
                </View>
                <View style={styles.grid_item}>
                  <Ionicons name="arrow-down" size={28} color="#43A047" />
                  <Text style={styles.grid_value}>{analysis.lowest}</Text>
                  <Text style={styles.grid_label}>Más bajo</Text>
                </View>
              </View>

              {/* Total */}
              <View style={styles.total_card}>
                <Ionicons name="calendar" size={24} color="#1a1a1a" />
                <Text style={styles.total_text}>
                  {analysis.count} mediciones esta semana
                </Text>
              </View>

              {/* Últimos registros */}
              <Text style={styles.section_title}>Últimos registros</Text>
              {records.slice(0, 5).map(record => (
                <View key={record.id} style={styles.record_row}>
                  <View>
                    <Text style={styles.record_meal}>{record.meal} · {record.moment}</Text>
                    <Text style={styles.record_date}>{record.date}</Text>
                  </View>
                  <Text style={[
                    styles.record_value,
                    record.status === 'Normal' && { color: '#43A047' },
                    record.status === 'Elevado' && { color: '#FB8C00' },
                    (record.status === 'Bajo' || record.status === 'Alto') && { color: '#E53935' },
                  ]}>
                    {record.value}
                  </Text>
                </View>
              ))}
            </>
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
    paddingBottom: 24,
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
  summary_card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  summary_label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 2,
    marginBottom: 8,
  },
  summary_value: {
    fontSize: 64,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  summary_unit: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  trend_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trend_text: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  grid_item: {
    width: '47%',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    gap: 8,
  },
  grid_value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  grid_label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  total_card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  total_text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section_title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  record_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  record_meal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  record_date: {
    fontSize: 12,
    color: '#999',
  },
  record_value: {
    fontSize: 22,
    fontWeight: '700',
  },
});

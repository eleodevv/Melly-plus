import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { saveRecord } from '../utils/storage';
import { getGlucoseStatus } from '../utils/glucose';
import { useApp } from '../context/AppContext';

export default function Resultado({ navigation, route }) {
  const { value, moment, meal, food } = route.params;
  const { profile, refreshRecords } = useApp();

  // Usar rangos reales según el momento
  const status = getGlucoseStatus(value, moment);

  // Guardar el registro
  useEffect(() => {
    const save = async () => {
      if (!profile) return;
      try {
        await saveRecord(profile.id, {
          value,
          moment,
          meal,
          food,
          status: status.label,
          date: new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
          }),
          dayName: new Date().toLocaleDateString('es-ES', { weekday: 'long' }),
        });
        await refreshRecords();
      } catch (error) {
        console.error('Error al guardar:', error);
      }
    };
    save();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: status.color }]}>
      <StatusBar barStyle="light-content" backgroundColor={status.color} />
      <SafeAreaView style={styles.safe}>

        {/* Header con flecha */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.back_btn}>
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>

          {/* Icono grande */}
          <View style={styles.icon_wrapper}>
            <Ionicons name={status.icon} size={80} color="#FFFFFF" />
          </View>

          {/* Valor */}
          <View style={styles.value_card}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.unit}>mg/dL</Text>
          </View>

          {/* Estado */}
          <View style={styles.status_pill}>
            <Text style={styles.status_text}>{status.label}</Text>
          </View>

          {/* Contexto */}
          <Text style={styles.context}>{moment} del {meal}</Text>

          {/* Comida */}
          {food && food !== 'No registrado' && (
            <View style={styles.food_card}>
              <Ionicons name="restaurant-outline" size={18} color="#FFFFFF" />
              <Text style={styles.food_text}>{food}</Text>
            </View>
          )}

          {/* Mensaje */}
          <View style={styles.message_card}>
            <Text style={styles.message_text}>{status.message}</Text>
          </View>

          {/* Botón */}
          <TouchableOpacity 
            style={styles.done_btn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.done_btn_text}>Listo</Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  back_btn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 20,
  },
  icon_wrapper: {
    marginBottom: 8,
  },
  value_card: {
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 100,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  unit: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    opacity: 0.9,
  },
  status_pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  status_text: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  context: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.95,
  },
  food_card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  food_text: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  message_card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  message_text: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  done_btn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 80,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  done_btn_text: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
});

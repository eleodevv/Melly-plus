import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { saveRecord } from '../utils/storage';

export default function ResultScreen({ navigation, route }) {
  const { value, moment, meal } = route.params;

  // Lógica de rangos (ajustar según necesidad médica)
  const getStatus = (value) => {
    if (value < 70) return { color: '#E53935', label: 'Bajo', icon: 'alert-circle' };
    if (value <= 130) return { color: '#43A047', label: 'Normal', icon: 'checkmark-circle' };
    if (value <= 180) return { color: '#FB8C00', label: 'Elevado', icon: 'warning' };
    return { color: '#E53935', label: 'Alto', icon: 'alert-circle' };
  };

  const status = getStatus(value);

  // Guardar el registro cuando se muestra la pantalla
  useEffect(() => {
    const save = async () => {
      try {
        await saveRecord({
          value,
          moment,
          meal,
          status: status.label,
          date: new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
          }),
          dayName: new Date().toLocaleDateString('es-ES', { weekday: 'long' }),
        });
        console.log('Registro guardado exitosamente');
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

          {/* Mensaje */}
          <View style={styles.message_card}>
            <Text style={styles.message_text}>
              {status.label === 'Normal' 
                ? '¡Excelente! Tu nivel está dentro del rango normal.'
                : status.label === 'Elevado'
                ? 'Tu nivel está un poco elevado. Mantén tus hábitos saludables.'
                : 'Consulta con tu médico sobre este resultado.'}
            </Text>
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 28,
  },
  icon_wrapper: {
    marginBottom: 12,
  },
  value_card: {
    alignItems: 'center',
    gap: 12,
  },
  value: {
    fontSize: 110,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  unit: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '700',
    opacity: 0.9,
  },
  status_pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  status_text: {
    fontSize: 24,
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
  message_card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    padding: 24,
    marginTop: 12,
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
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 70,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  done_btn_text: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
  },
});

import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Simulación: cambiar para probar
const IS_MEASUREMENT_DAY = true;
const MEAL = "Desayuno";

// Obtener fecha actual
const today = new Date();
const dayName = today.toLocaleDateString('es-ES', { weekday: 'long' });
const dateString = today.toLocaleDateString('es-ES', { 
  day: 'numeric', 
  month: 'long' 
});
const fullDate = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dateString}`;

export default function HomeScreen({ navigation }) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        {/* Header con blur */}
        <BlurView intensity={80} tint="light" style={styles.header_blur}>
          <View style={styles.header}>
            <Text style={styles.brand}>Melly+</Text>
            <Text style={styles.date}>{fullDate}</Text>
          </View>
        </BlurView>

        {/* Card principal centrada */}
        <View style={styles.content}>
          {IS_MEASUREMENT_DAY ? <MeasurementCard navigation={navigation} /> : <RestCard />}
        </View>

      </SafeAreaView>
    </>
  );
}

function MeasurementCard({ navigation }) {
  return (
    <View style={styles.main_content}>
      <View style={styles.icon_circle}>
        <Ionicons name="fitness-outline" size={32} color="#1a1a1a" />
      </View>
      
      <Text style={styles.main_title}>Hoy toca registrar{'\n'}glucosa 😊</Text>
      <Text style={styles.main_sub}>
        Es día de medición.{'\n'}Registra tu nivel de glucosa.
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.main_btn}
          onPress={() => navigation.navigate('Input', { moment: 'Antes', meal: MEAL })}
        >
          <Text style={styles.main_btn_text}>Antes del {MEAL}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.main_btn, styles.main_btn_outline]}
          onPress={() => navigation.navigate('Input', { moment: 'Después', meal: MEAL })}
        >
          <Text style={[styles.main_btn_text, styles.main_btn_text_outline]}>
            Después del {MEAL}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RestCard() {
  return (
    <View style={styles.main_content}>
      <View style={styles.icon_circle}>
        <Ionicons name="leaf-outline" size={32} color="#00C853" />
      </View>
      
      <Text style={styles.main_title}>Hoy no necesitas{'\n'}registrar glucosa 😊</Text>
      <Text style={styles.main_sub}>
        Es un día de descanso.{'\n'}Aprovecha para relajarte y mantener tus hábitos saludables.
      </Text>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 140,
  },

  // Main content (sin card)
  main_content: {
    alignItems: 'center',
  },
  icon_circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  main_title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 18,
  },
  main_sub: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  main_btn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
    width: '100%',
  },
  main_btn_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  main_btn_text: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  main_btn_text_outline: {
    color: '#1a1a1a',
  },
});

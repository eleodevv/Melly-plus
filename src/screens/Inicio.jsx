import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getTodaySchedule } from '../utils/glucose';

export default function Inicio({ navigation }) {
  const { profile } = useApp();

  // Si no hay perfil, el App.js ya redirige al Onboarding
  if (!profile) return null;

  const schedule = getTodaySchedule(profile.settings);

  // Fecha actual
  const today = new Date();
  const fullDate = today.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Melly+</Text>
            <Text style={styles.date}>{fullDate}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Ajustes')}>
            <Ionicons name="settings-outline" size={26} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Saludo */}
        <View style={styles.greeting}>
          <Text style={styles.greeting_text}>Hola, {profile.name}</Text>
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          {schedule.isMeasurementDay ? (
            <MeasurementDay navigation={navigation} schedule={schedule} />
          ) : (
            <RestDay schedule={schedule} />
          )}
        </View>

      </SafeAreaView>
    </>
  );
}

function MeasurementDay({ navigation, schedule }) {
  return (
    <View style={styles.main_content}>
      <View style={styles.icon_circle}>
        <Ionicons name="fitness-outline" size={40} color="#1a1a1a" />
      </View>
      
      <Text style={styles.main_title}>Hoy toca registrar{'\n'}glucosa 😊</Text>
      <Text style={styles.main_sub}>
        Comida: {schedule.meal}
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.main_btn}
          onPress={() => navigation.navigate('Input', { moment: 'Antes', meal: schedule.meal })}
        >
          <Text style={styles.main_btn_text}>Antes del {schedule.meal}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.main_btn, styles.main_btn_outline]}
          onPress={() => navigation.navigate('Input', { moment: 'Después', meal: schedule.meal })}
        >
          <Text style={[styles.main_btn_text, styles.main_btn_text_outline]}>
            Después del {schedule.meal}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RestDay({ schedule }) {
  return (
    <View style={styles.main_content}>
      <View style={[styles.icon_circle, { backgroundColor: '#E8F5E9' }]}>
        <Ionicons name="leaf-outline" size={40} color="#43A047" />
      </View>
      
      <Text style={styles.main_title}>Hoy no necesitas{'\n'}registrar glucosa 😊</Text>
      <Text style={styles.main_sub}>
        Es un día de descanso.{'\n'}Aprovecha para relajarte.
      </Text>

      {schedule.nextDay && (
        <View style={styles.next_card}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.next_text}>
            Próxima: {schedule.nextDay} · {schedule.nextMeal}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  greeting: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  greeting_text: {
    fontSize: 22,
    fontWeight: '600',
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  main_content: {
    alignItems: 'center',
  },
  icon_circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  main_title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  main_sub: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 36,
  },
  buttons: {
    width: '100%',
    gap: 14,
  },
  main_btn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  main_btn_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  main_btn_text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  main_btn_text_outline: {
    color: '#1a1a1a',
  },
  next_card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  next_text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  no_profile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  no_profile_title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  no_profile_sub: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});

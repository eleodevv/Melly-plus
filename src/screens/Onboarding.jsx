import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { saveProfile } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { requestNotificationPermissions, setupReminders } from '../utils/notifications';

const { width } = Dimensions.get('window');

const DAYS = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

const MEALS = ['Desayuno', 'Comida', 'Cena'];

export default function Onboarding({ navigation }) {
  const { switchProfile, refreshProfiles } = useApp();
  const scrollRef = useRef(null);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState({
    lunes: { active: true, meal: 'Desayuno' },
    miercoles: { active: true, meal: 'Comida' },
    viernes: { active: true, meal: 'Cena' },
  });

  const goNext = () => {
    if (step < 3) {
      const nextStep = step + 1;
      setStep(nextStep);
      scrollRef.current?.scrollTo({ x: nextStep * width, animated: true });
    }
  };

  const goBack = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      scrollRef.current?.scrollTo({ x: prevStep * width, animated: true });
    }
  };

  const toggleDay = (dayKey) => {
    setSelectedDays(prev => {
      if (prev[dayKey]) {
        const { [dayKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dayKey]: { active: true, meal: 'Desayuno' } };
    });
  };

  const changeMeal = (dayKey) => {
    setSelectedDays(prev => {
      const current = prev[dayKey]?.meal || 'Desayuno';
      const nextIndex = (MEALS.indexOf(current) + 1) % MEALS.length;
      return { ...prev, [dayKey]: { ...prev[dayKey], meal: MEALS[nextIndex] } };
    });
  };

  const handleFinish = async () => {
    if (!name.trim()) return;

    const days = {};
    Object.entries(selectedDays).forEach(([key, val]) => {
      days[key] = {
        active: true,
        meal: val.meal,
        timeBefore: '06:00',
        timeAfter: '08:00',
      };
    });

    try {
      const profile = await saveProfile({ name: name.trim(), days });
      await switchProfile(profile.id);
      await refreshProfiles();

      // Configurar notificaciones
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await setupReminders({ days, notifications: true });
      }
      // No navegamos, el AppNavigator detecta el perfil y cambia solo
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>

        {/* Progress dots */}
        <View style={styles.progress}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[styles.dot, step >= i && styles.dot_active]} />
          ))}
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        >

          {/* Step 1: Bienvenida */}
          <View style={[styles.page, { width }]}>
            <View style={styles.page_content}>
              <View style={styles.icon_big}>
                <Ionicons name="heart-outline" size={64} color="#E53935" />
              </View>
              <Text style={styles.page_title}>Bienvenido a{'\n'}Melly+</Text>
              <Text style={styles.page_sub}>
                Tu compañero para llevar un control simple y claro de tu glucosa.
              </Text>
            </View>
            <TouchableOpacity style={styles.next_btn} onPress={goNext}>
              <Text style={styles.next_btn_text}>Comenzar</Text>
            </TouchableOpacity>
          </View>

          {/* Step 2: Nombre */}
          <View style={[styles.page, { width }]}>
            <KeyboardAvoidingView 
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={styles.page_content}>
                <View style={styles.icon_big}>
                  <Ionicons name="person-outline" size={64} color="#1a1a1a" />
                </View>
                <Text style={styles.page_title}>¿Cómo te llamas?</Text>
                <Text style={styles.page_sub}>
                  Así personalizamos tu experiencia.
                </Text>
                <TextInput
                  style={styles.name_input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                  placeholderTextColor="#CCC"
                  autoFocus={false}
                  returnKeyType="next"
                  onSubmitEditing={() => { if (name.trim()) goNext(); }}
                />
              </View>
              <View style={styles.btn_row}>
                <TouchableOpacity style={styles.back_btn} onPress={goBack}>
                  <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.next_btn, styles.next_btn_flex, !name.trim() && styles.btn_disabled]} 
                  onPress={goNext}
                  disabled={!name.trim()}
                >
                  <Text style={styles.next_btn_text}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>

          {/* Step 3: Días */}
          <View style={[styles.page, { width }]}>
            <View style={styles.page_content}>
              <Text style={styles.page_title}>¿Qué días mides?</Text>
              <Text style={styles.page_sub}>
                Selecciona los días y toca la comida para cambiarla.
              </Text>
              <View style={styles.days_grid}>
                {DAYS.map(day => {
                  const isSelected = !!selectedDays[day.key];
                  return (
                    <View key={day.key} style={styles.day_item}>
                      <TouchableOpacity
                        style={[styles.day_btn, isSelected && styles.day_btn_active]}
                        onPress={() => toggleDay(day.key)}
                      >
                        <Text style={[styles.day_btn_text, isSelected && styles.day_btn_text_active]}>
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                      {isSelected && (
                        <TouchableOpacity 
                          style={styles.meal_btn}
                          onPress={() => changeMeal(day.key)}
                        >
                          <Text style={styles.meal_btn_text}>{selectedDays[day.key].meal}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.btn_row}>
              <TouchableOpacity style={styles.back_btn} onPress={goBack}>
                <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.next_btn, styles.next_btn_flex, Object.keys(selectedDays).length === 0 && styles.btn_disabled]} 
                onPress={goNext}
                disabled={Object.keys(selectedDays).length === 0}
              >
                <Text style={styles.next_btn_text}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Step 4: Listo */}
          <View style={[styles.page, { width }]}>
            <View style={styles.page_content}>
              <View style={styles.icon_big}>
                <Ionicons name="checkmark-circle" size={80} color="#43A047" />
              </View>
              <Text style={styles.page_title}>¡Todo listo, {name}!</Text>
              <Text style={styles.page_sub}>
                Tu perfil está configurado.{'\n'}Te recordaremos cuando toque medir.
              </Text>
              <View style={styles.summary}>
                <Text style={styles.summary_title}>Tus días de medición:</Text>
                {Object.entries(selectedDays).map(([key, val]) => (
                  <Text key={key} style={styles.summary_item}>
                    • {key.charAt(0).toUpperCase() + key.slice(1)} → {val.meal}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.btn_row}>
              <TouchableOpacity style={styles.back_btn} onPress={goBack}>
                <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.next_btn, styles.next_btn_flex, { backgroundColor: '#43A047' }]} 
                onPress={handleFinish}
              >
                <Text style={styles.next_btn_text}>Empezar</Text>
              </TouchableOpacity>
            </View>
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
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8E8E8',
  },
  dot_active: {
    backgroundColor: '#1a1a1a',
    width: 28,
  },
  scroll: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  page_content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon_big: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  page_title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  page_sub: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  name_input: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1a1a1a',
    paddingVertical: 12,
    width: '80%',
    marginTop: 16,
  },
  days_grid: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  day_item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  day_btn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  day_btn_active: {
    backgroundColor: '#1a1a1a',
  },
  day_btn_text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  day_btn_text_active: {
    color: '#FFFFFF',
  },
  meal_btn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  meal_btn_text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  summary: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginTop: 8,
  },
  summary_title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  summary_item: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
  },
  btn_row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  back_btn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  next_btn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  next_btn_flex: {
    flex: 1,
    width: undefined,
  },
  next_btn_text: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btn_disabled: {
    backgroundColor: '#DDD',
  },
});

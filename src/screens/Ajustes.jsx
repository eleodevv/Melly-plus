import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, StatusBar, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateProfile } from '../utils/storage';
import { setupReminders, requestNotificationPermissions } from '../utils/notifications';

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

export default function Ajustes({ navigation }) {
  const { profile, refreshProfiles } = useApp();
  const [settings, setSettings] = useState(null);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (profile && profile.settings) {
      setSettings(profile.settings);
      setNotifications(profile.settings.notifications ?? true);
    }
  }, [profile]);

  const toggleDay = (dayKey) => {
    setSettings(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [dayKey]: {
          ...prev.days[dayKey],
          active: !prev.days[dayKey]?.active,
          meal: prev.days[dayKey]?.meal || 'Desayuno',
          timeBefore: prev.days[dayKey]?.timeBefore || '06:00',
          timeAfter: prev.days[dayKey]?.timeAfter || '08:00',
        },
      },
    }));
  };

  const changeMeal = (dayKey) => {
    const current = settings.days[dayKey]?.meal || 'Desayuno';
    const nextIndex = (MEALS.indexOf(current) + 1) % MEALS.length;
    setSettings(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [dayKey]: {
          ...prev.days[dayKey],
          meal: MEALS[nextIndex],
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      const updatedSettings = { ...settings, notifications };
      await updateProfile(profile.id, { settings: updatedSettings });
      
      if (notifications) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await setupReminders(updatedSettings);
        }
      }

      await refreshProfiles();
      Alert.alert('Guardado', 'Configuración actualizada');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar');
    }
  };

  if (!settings) return null;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Ajustes</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.save_text}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scroll_content}>
          
          {/* Notificaciones */}
          <View style={styles.section}>
            <Text style={styles.section_title}>Notificaciones</Text>
            <View style={styles.row}>
              <View style={styles.row_left}>
                <Ionicons name="notifications-outline" size={22} color="#666" />
                <Text style={styles.row_text}>Recordatorios</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E8E8E8', true: '#43A047' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Días de medición */}
          <View style={styles.section}>
            <Text style={styles.section_title}>Días de medición</Text>
            <Text style={styles.section_sub}>Toca un día para activarlo, toca la comida para cambiarla</Text>
            
            {DAYS.map(day => {
              const dayConfig = settings.days[day.key];
              const isActive = dayConfig?.active || false;

              return (
                <View key={day.key} style={styles.day_row}>
                  <TouchableOpacity 
                    style={[styles.day_toggle, isActive && styles.day_toggle_active]}
                    onPress={() => toggleDay(day.key)}
                  >
                    <Text style={[styles.day_name, isActive && styles.day_name_active]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>

                  {isActive && (
                    <TouchableOpacity 
                      style={styles.meal_pill}
                      onPress={() => changeMeal(day.key)}
                    >
                      <Text style={styles.meal_text}>{dayConfig?.meal || 'Desayuno'}</Text>
                      <Ionicons name="swap-horizontal" size={16} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          {/* Perfil */}
          <View style={styles.section}>
            <Text style={styles.section_title}>Perfil</Text>
            <TouchableOpacity 
              style={styles.row}
              onPress={() => navigation.navigate('Perfiles')}
            >
              <View style={styles.row_left}>
                <Ionicons name="people-outline" size={22} color="#666" />
                <Text style={styles.row_text}>Cambiar perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  save_text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#43A047',
  },
  scroll: {
    flex: 1,
  },
  scroll_content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  section_title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  section_sub: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  row_left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  row_text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  day_row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  day_toggle: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  day_toggle_active: {
    backgroundColor: '#1a1a1a',
  },
  day_name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  day_name_active: {
    color: '#FFFFFF',
  },
  meal_pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  meal_text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});

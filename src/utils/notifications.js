import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar cómo se muestran las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Pedir permisos
export const requestNotificationPermissions = async () => {
  if (!Device.isDevice) {
    console.log('Notificaciones solo funcionan en dispositivos físicos');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permisos de notificación denegados');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('glucose', {
      name: 'Recordatorios de glucosa',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
};

// Programar notificación para un día y hora específicos
export const scheduleReminder = async (dayOfWeek, hour, minute, meal, moment) => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🩺 Melly+ - Hora de medir',
        body: `Es hora de registrar tu glucosa (${moment} del ${meal})`,
        data: { meal, moment },
      },
      trigger: {
        type: 'weekly',
        weekday: dayOfWeek, // 1=domingo, 2=lunes, etc.
        hour,
        minute,
        repeats: true,
      },
    });
    return id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancelar todas las notificaciones
export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

// Programar recordatorios según la configuración del perfil
export const setupReminders = async (settings) => {
  await cancelAllReminders();

  if (!settings || !settings.notifications) return;

  const dayMap = {
    domingo: 1,
    lunes: 2,
    martes: 3,
    miercoles: 4,
    jueves: 5,
    viernes: 6,
    sabado: 7,
  };

  for (const [day, config] of Object.entries(settings.days)) {
    if (!config.active) continue;

    const weekday = dayMap[day];
    
    // Notificación "Antes"
    if (config.timeBefore) {
      const [hour, minute] = config.timeBefore.split(':').map(Number);
      await scheduleReminder(weekday, hour, minute, config.meal, 'Antes');
    }

    // Notificación "Después"
    if (config.timeAfter) {
      const [hour, minute] = config.timeAfter.split(':').map(Number);
      await scheduleReminder(weekday, hour, minute, config.meal, 'Después');
    }
  }
};

// Rangos reales de glucosa para adultos
// Valores en mg/dL

export const GLUCOSE_RANGES = {
  before: {
    // En ayunas (8 horas sin comer) / antes de comer
    low: { max: 70, label: 'Bajo', color: '#E53935', icon: 'alert-circle', 
      message: 'Nivel bajo. Puede causar mareo, sudoración o confusión.' },
    normal: { min: 70, max: 99, label: 'Normal', color: '#43A047', icon: 'checkmark-circle',
      message: '¡Excelente! Tu cuerpo regula bien el azúcar.' },
    prediabetes: { min: 100, max: 125, label: 'Prediabetes', color: '#FB8C00', icon: 'warning',
      message: 'Hay riesgo de diabetes tipo 2. Cuida tu alimentación y ejercicio.' },
    diabetes: { min: 126, label: 'Diabetes', color: '#E53935', icon: 'alert-circle',
      message: 'Nivel alto. Consulta con tu médico lo antes posible.' },
  },
  after: {
    // 2 horas después de comer
    low: { max: 70, label: 'Bajo', color: '#E53935', icon: 'alert-circle',
      message: 'Nivel bajo. Puede causar mareo, sudoración o confusión.' },
    normal: { min: 70, max: 139, label: 'Normal', color: '#43A047', icon: 'checkmark-circle',
      message: '¡Excelente! Tu cuerpo regula bien el azúcar.' },
    prediabetes: { min: 140, max: 199, label: 'Prediabetes', color: '#FB8C00', icon: 'warning',
      message: 'Hay riesgo de diabetes tipo 2. Cuida tu alimentación y ejercicio.' },
    diabetes: { min: 200, label: 'Diabetes', color: '#E53935', icon: 'alert-circle',
      message: 'Nivel alto. Consulta con tu médico lo antes posible.' },
  },
};

// Rangos de referencia para mostrar al usuario
export const REFERENCE_RANGES = {
  before: {
    normal: '70 - 99 mg/dL',
    prediabetes: '100 - 125 mg/dL',
    diabetes: '126+ mg/dL',
    description: 'En ayunas (8 horas sin comer)',
  },
  after: {
    normal: 'Menos de 140 mg/dL',
    prediabetes: '140 - 199 mg/dL',
    diabetes: '200+ mg/dL',
    description: '2 horas después de comer',
  },
};

export const getGlucoseStatus = (value, moment) => {
  const ranges = moment === 'Antes' ? GLUCOSE_RANGES.before : GLUCOSE_RANGES.after;

  if (value < 70) {
    return ranges.low;
  } else if (moment === 'Antes') {
    if (value <= 99) return ranges.normal;
    if (value <= 125) return ranges.prediabetes;
    return ranges.diabetes;
  } else {
    if (value <= 139) return ranges.normal;
    if (value <= 199) return ranges.prediabetes;
    return ranges.diabetes;
  }
};

// Obtener el día de medición actual
export const getTodaySchedule = (settings) => {
  const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const today = days[new Date().getDay()];
  
  if (settings && settings.days && settings.days[today] && settings.days[today].active) {
    return {
      isMeasurementDay: true,
      ...settings.days[today],
      dayName: today.charAt(0).toUpperCase() + today.slice(1),
    };
  }

  // Buscar próximo día de medición
  const todayIndex = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const nextIndex = (todayIndex + i) % 7;
    const nextDay = days[nextIndex];
    if (settings && settings.days && settings.days[nextDay] && settings.days[nextDay].active) {
      return {
        isMeasurementDay: false,
        nextDay: nextDay.charAt(0).toUpperCase() + nextDay.slice(1),
        nextMeal: settings.days[nextDay].meal,
        dayName: today.charAt(0).toUpperCase() + today.slice(1),
      };
    }
  }

  return { isMeasurementDay: false, dayName: today.charAt(0).toUpperCase() + today.slice(1) };
};

// Análisis semanal
export const getWeeklyAnalysis = (records) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekRecords = records.filter(r => new Date(r.timestamp) >= weekAgo);

  if (weekRecords.length === 0) {
    return {
      count: 0,
      average: 0,
      highest: 0,
      lowest: 0,
      normalCount: 0,
      elevatedCount: 0,
      trend: 'sin datos',
    };
  }

  const values = weekRecords.map(r => r.value);
  const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  const normalCount = weekRecords.filter(r => r.status === 'Normal').length;
  const elevatedCount = weekRecords.filter(r => r.status === 'Elevado' || r.status === 'Alto').length;

  // Tendencia simple
  let trend = 'estable';
  if (weekRecords.length >= 3) {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (avgSecond > avgFirst + 10) trend = 'subiendo';
    else if (avgSecond < avgFirst - 10) trend = 'bajando';
  }

  return { count: weekRecords.length, average, highest, lowest, normalCount, elevatedCount, trend };
};

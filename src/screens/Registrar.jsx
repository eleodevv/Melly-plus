import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { REFERENCE_RANGES } from '../utils/glucose';

const { width } = Dimensions.get('window');

export default function Registrar({ navigation, route }) {
  const [value, setValue] = useState("");
  const [food, setFood] = useState("");
  const [step, setStep] = useState(1);

  const { moment, meal } = route.params;
  const rangeInfo = moment === 'Antes' ? REFERENCE_RANGES.before : REFERENCE_RANGES.after;

  const handleNext = () => {
    if (value.trim()) setStep(2);
  };

  const handleSave = () => {
    navigation.replace('Result', { 
      value: parseInt(value), 
      moment, 
      meal,
      food: food.trim() || 'No registrado',
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.close_btn}>
            <Ionicons name="close" size={28} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.header_center}>
            <Text style={styles.header_title}>{moment} del {meal}</Text>
            <Text style={styles.header_sub}>{rangeInfo.description}</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          <View style={[styles.step_bar, { width: step === 1 ? '50%' : '100%' }]} />
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

          {step === 1 ? (
            <View style={styles.body}>
              {/* Input de glucosa */}
              <View style={styles.input_section}>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setValue}
                  keyboardType="numeric"
                  placeholder="---"
                  placeholderTextColor="#E8E8E8"
                  maxLength={3}
                  autoFocus
                />
                <Text style={styles.unit}>mg/dL</Text>
              </View>

              {/* Rango de referencia */}
              <View style={styles.range_card}>
                <Ionicons name="information-circle-outline" size={18} color="#666" />
                <Text style={styles.range_text}>
                  Rango normal: {rangeInfo.normal}
                </Text>
              </View>

              {/* Botón */}
              <TouchableOpacity
                style={[styles.action_btn, !value.trim() && styles.action_btn_disabled]}
                onPress={handleNext}
                disabled={!value.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.action_btn_text}>Siguiente</Text>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.body}>
              {/* Input de comida */}
              <View style={styles.food_section}>
                <View style={styles.food_header}>
                  <Ionicons name="restaurant-outline" size={28} color="#1a1a1a" />
                  <Text style={styles.food_title}>¿Qué comiste?</Text>
                </View>
                <Text style={styles.food_sub}>Esto ayuda a entender tus niveles</Text>
                <TextInput
                  style={styles.food_input}
                  value={food}
                  onChangeText={setFood}
                  placeholder="Ej: Huevos con pan, fruta, café..."
                  placeholderTextColor="#BBB"
                  multiline
                  autoFocus
                />
              </View>

              {/* Botones */}
              <View style={styles.btn_row}>
                <TouchableOpacity
                  style={styles.secondary_btn}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondary_btn_text}>Saltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.action_btn}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.action_btn_text}>Guardar</Text>
                  <Ionicons name="checkmark" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

        </KeyboardAvoidingView>

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
    paddingTop: 12,
    paddingBottom: 8,
  },
  close_btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_center: {
    alignItems: 'center',
  },
  header_title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  header_sub: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  steps: {
    height: 4,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 24,
    borderRadius: 2,
    marginBottom: 8,
  },
  step_bar: {
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 32,
  },
  input_section: {
    alignItems: 'center',
    gap: 8,
  },
  input: {
    fontSize: 96,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    width: '100%',
  },
  unit: {
    fontSize: 20,
    color: '#999',
    fontWeight: '600',
  },
  range_card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  range_text: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  action_btn: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  action_btn_disabled: {
    backgroundColor: '#E8E8E8',
    shadowOpacity: 0,
    elevation: 0,
  },
  action_btn_text: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  food_section: {
    gap: 12,
  },
  food_header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  food_title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  food_sub: {
    fontSize: 15,
    color: '#999',
  },
  food_input: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  btn_row: {
    flexDirection: 'row',
    gap: 12,
  },
  secondary_btn: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: '#E8E8E8',
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary_btn_text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#999',
  },
});

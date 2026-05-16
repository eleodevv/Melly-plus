import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

export default function InputScreen({ navigation, route }) {
  const [value, setValue] = useState("");

  // Recibir parámetros
  const { moment, meal } = route.params;

  const handleSave = () => {
    if (value.trim()) {
      navigation.replace('Result', { 
        value: parseInt(value), 
        moment, 
        meal 
      });
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>

        {/* Header con blur */}
        <BlurView intensity={80} tint="light" style={styles.header_blur}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_btn}>
              <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.header_title}>{moment} del {meal}</Text>
            <View style={{ width: 24 }} />
          </View>
        </BlurView>

        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >

            {/* Contexto */}
            <View style={styles.context}>
              <Ionicons name="water-outline" size={48} color="#1a1a1a" />
              <Text style={styles.context_label}>Ingresa tu nivel de glucosa</Text>
            </View>

            {/* Input grande */}
            <View style={styles.input_wrapper}>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                placeholder="120"
                placeholderTextColor="#DDD"
                maxLength={3}
                autoFocus
              />
              <Text style={styles.unit}>mg/dL</Text>
            </View>

            {/* Botón guardar */}
            <TouchableOpacity
              style={[styles.save_btn, !value.trim() && styles.save_btn_disabled]}
              onPress={handleSave}
              disabled={!value.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.save_btn_text}>Guardar</Text>
            </TouchableOpacity>

          </ScrollView>
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
  back_btn: {
    padding: 4,
  },
  header_title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 120,
    paddingBottom: 40,
    gap: 40,
  },
  context: {
    alignItems: 'center',
    gap: 16,
  },
  context_label: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  input_wrapper: {
    alignItems: 'center',
    gap: 12,
  },
  input: {
    fontSize: 80,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    width: 240,
    borderBottomWidth: 3,
    borderBottomColor: '#1a1a1a',
    paddingVertical: 12,
  },
  unit: {
    fontSize: 20,
    color: '#999',
    fontWeight: '600',
  },
  save_btn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 80,
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  save_btn_disabled: {
    backgroundColor: '#DDD',
    shadowOpacity: 0,
  },
  save_btn_text: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
});

import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { saveProfile, deleteProfile, setActiveProfile } from '../utils/storage';
import { useApp } from '../context/AppContext';

export default function Perfiles({ navigation }) {
  const { profiles, switchProfile, refreshProfiles } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const profile = await saveProfile({ name: newName.trim() });
      await switchProfile(profile.id);
      await refreshProfiles();
      setNewName('');
      setShowNew(false);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el perfil');
    }
  };

  const handleSelect = async (profileId) => {
    await switchProfile(profileId);
    navigation.navigate('Home');
  };

  const handleDelete = (profileId, name) => {
    Alert.alert(
      'Eliminar perfil',
      `¿Seguro que quieres eliminar a ${name}? Se borrarán todos sus datos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await deleteProfile(profileId);
            await refreshProfiles();
            // Si era el perfil activo, limpiar y volver al inicio
            const remaining = profiles.filter(p => p.id !== profileId);
            if (remaining.length === 0) {
              await switchProfile('');
              navigation.navigate('Home');
            }
          }
        },
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_btn}>
            <Ionicons name="arrow-back" size={28} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>Perfiles</Text>
          <Text style={styles.subtitle}>Selecciona o crea un perfil</Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scroll_content}>
          
          {profiles.map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={styles.profile_card}
              onPress={() => handleSelect(p.id)}
              onLongPress={() => handleDelete(p.id, p.name)}
            >
              <View style={styles.profile_avatar}>
                <Text style={styles.profile_initial}>{p.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.profile_info}>
                <Text style={styles.profile_name}>{p.name}</Text>
                <Text style={styles.profile_date}>
                  Creado: {new Date(p.createdAt).toLocaleDateString('es-ES')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}

          {/* Crear nuevo */}
          {showNew ? (
            <View style={styles.new_card}>
              <TextInput
                style={styles.new_input}
                placeholder="Nombre del perfil"
                placeholderTextColor="#999"
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <View style={styles.new_buttons}>
                <TouchableOpacity 
                  style={styles.new_btn_cancel}
                  onPress={() => { setShowNew(false); setNewName(''); }}
                >
                  <Text style={styles.new_btn_cancel_text}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.new_btn_save, !newName.trim() && { opacity: 0.4 }]}
                  onPress={handleCreate}
                  disabled={!newName.trim()}
                >
                  <Text style={styles.new_btn_save_text}>Crear</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.add_btn}
              onPress={() => setShowNew(true)}
            >
              <Ionicons name="add-circle-outline" size={28} color="#1a1a1a" />
              <Text style={styles.add_text}>Nuevo perfil</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.hint}>Mantén presionado un perfil para eliminarlo</Text>

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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  back_btn: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scroll: {
    flex: 1,
  },
  scroll_content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profile_card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  profile_avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profile_initial: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profile_info: {
    flex: 1,
  },
  profile_name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profile_date: {
    fontSize: 13,
    color: '#999',
  },
  new_card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  new_input: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    paddingVertical: 12,
    marginBottom: 16,
  },
  new_buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  new_btn_cancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
  },
  new_btn_cancel_text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  new_btn_save: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  new_btn_save_text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  add_btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  add_text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  hint: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import { useAppTheme, ThemeType } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { theme, themeType, setThemeType } = useAppTheme();
  const navigation = useNavigation();

  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  const toggleBiometric = async () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    await AsyncStorage.setItem('biometric_enabled', newValue ? 'true' : 'false');
    setBiometricMessage(
      newValue
        ? 'Authentification biométrique activée'
        : 'Authentification biométrique désactivée'
    );
    setShowBiometricModal(true);
    setTimeout(() => setShowBiometricModal(false), 2000);
  };

  useEffect(() => {
    const loadBiometricSetting = async () => {
      const savedValue = await AsyncStorage.getItem('biometric_enabled');
      setBiometricEnabled(savedValue === 'true');
    };
    loadBiometricSetting();
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
    Alert.alert('Langue', newLang === 'en' ? 'Switched to English' : 'Passé en français');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.accent} />
      </TouchableOpacity>

      <ScrollView
        style={{ backgroundColor: theme.background }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>🎨 Thème de l'application</Text>
        {(['light', 'dark'] as ThemeType[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            activeOpacity={0.8}
            style={[
              styles.optionCard,
              {
                backgroundColor: theme.card,
                shadowColor: theme.cardShadow,
              },
            ]}
            onPress={() => setThemeType(mode)}
          >
            <Text style={[styles.optionLabel, { color: theme.text }]}>
              {mode === 'light' ? '☀️ Clair' : '🌙 Sombre'}
            </Text>
            <Switch
              value={themeType === mode}
              onValueChange={() => setThemeType(mode)}
              trackColor={{ false: '#ccc', true: theme.accent }}
              thumbColor={themeType === mode ? theme.accent : '#f4f3f4'}
            />
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>🔐 Sécurité</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.optionCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}
          onPress={toggleBiometric}
        >
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            {biometricEnabled ? 'Désactiver empreinte' : 'Activer empreinte'}
          </Text>
          <Switch
            value={biometricEnabled}
            onValueChange={toggleBiometric}
            trackColor={{ false: '#ccc', true: theme.accent }}
            thumbColor={biometricEnabled ? theme.accent : '#f4f3f4'}
          />
        </TouchableOpacity>

        {showBiometricModal && (
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Ionicons
                name={biometricEnabled ? 'finger-print' : 'close-circle-outline'}
                size={40}
                color={biometricEnabled ? theme.primary || '#4CAF50' : theme.accent || '#FF5252'}
                style={{ marginBottom: 10 }}
              />
              <Text style={{ color: theme.text }}>{biometricMessage}</Text>
            </View>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>🌐 Langue</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.optionCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}
          //onPress={toggleLanguage}
        >
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            {language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>ℹ️ Informations</Text>

        <View style={[styles.optionCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
          <Text style={[styles.optionLabel, { color: theme.text }]}>📦 Version</Text>
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            {Application.nativeApplicationVersion || '1.0.0'}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.optionCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}
          onPress={() => Linking.openURL('mailto:support@tijariwise.com')}
        >
          <Text style={[styles.optionLabel, { color: theme.text }]}>📞 Contact support</Text>
          <Ionicons name="mail-outline" size={20} color={theme.accent} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    padding: 8,
    zIndex: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 30,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionLabel: {
    fontSize: 16,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
  },
  modalContent: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
});

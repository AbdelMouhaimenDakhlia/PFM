import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes';
import { useAppTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useAppTheme();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          const res = await api.get('/api/utilisateurs/me');
          setUser(res.data);
          const savedUri = await AsyncStorage.getItem('profileImage');
          setProfileImage(savedUri);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header logo */}
      <View style={[styles.appHeader, { borderColor: theme.border }]}>
        <View style={styles.logoSection}>
          <Image source={require('../assets/logo.jpg')} style={styles.logo} />
          <Text style={[styles.appName, { color: theme.text }]}>
            Tijari<Text style={{ color: theme.accent }}>Wise</Text>
          </Text>
        </View>
      </View>

      {/* Profile info */}
      <View style={styles.header}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <Image source={require('../assets/avatar.png')} style={styles.avatar} />
        )}
        <Text style={[styles.name, { color: theme.text }]}>{user?.nom || 'Utilisateur'}</Text>
        <Text style={[styles.email, { color: theme.mutedText }]}>{user?.email || ''}</Text>
      </View>

      {/* Options */}
      <View style={styles.options}>
        <Option icon="account-edit" label="Modifier le profil" onPress={() => navigation.navigate('EditProfile')} />
        <Option icon="key" label="Changer le mot de passe" onPress={() => {}} />
        <Option icon="cog-outline" label="Paramètres" onPress={() => navigation.navigate('Settings')} />
      </View>

      {/* Logout */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.accent }]} onPress={logout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const Option = ({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) => {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          borderColor: theme.border,
          backgroundColor: theme.card,
          shadowColor: theme.cardShadow,
        },
      ]}
      onPress={onPress || (() => {})}
    >
      <Icon name={icon} size={22} color={theme.accent} />
      <Text style={[styles.optionText, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 40,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
  },
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    elevation: 2,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

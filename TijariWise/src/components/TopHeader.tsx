// ✅ TopHeader.tsx avec thème dynamique clair/sombre appliqué (palette Attijari)

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes';
import { useAppTheme } from '../context/ThemeContext';

export default function TopHeader({ onLogout }: { onLogout?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useAppTheme();

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileImage = async () => {
        try {
          const savedUri = await AsyncStorage.getItem('profileImage');
          setProfileImage(savedUri);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProfileImage();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.header, {
      backgroundColor: theme.header,
      borderColor: theme.border,
      shadowColor: theme.cardShadow,
    }]}
    >
      <SafeAreaView style={styles.logoSection}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={[styles.appName, { color: theme.text }]}>Tijari
          <Text style={{ color: theme.accent }}>Wise</Text>
        </Text>
      </SafeAreaView>

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/avatar.png')
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
        }
      >
        <Menu.Item
          onPress={() => {
            setVisible(false);
            navigation.navigate('Profil');
          }}
          title="👤 Mon profil"
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            navigation.navigate('Settings');
          }}
          title="⚙️ Paramètres"
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            onLogout?.();
          }}
          title="🚪 Déconnexion"
        />
      </Menu>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    borderBottomWidth: 1,
    zIndex: 10,
    elevation: 4,
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
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    margin: 10,
  },
});

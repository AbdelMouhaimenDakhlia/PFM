import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopHeader from '../components/TopHeader';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes';
import { useAppTheme } from '../context/ThemeContext';

interface Compte {
  id: number;
  iban: string;
  solde: number;
  devise: string;
  dateOuverture: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const getDeviseEmoji = (devise: string) => {
  switch (devise.toUpperCase()) {
    case 'EUR': return '💶';
    case 'USD': return '💵';
    case 'TND': return '🪙';
    
    default: return '💳';
  }
};

const AnimatedCompteCard = ({ compte, index }: { compte: Compte; index: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useAppTheme();

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
      }}
    >
      <TouchableOpacity
        style={[styles.accountCard, {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.cardShadow,
          cursor: 'pointer',
        }]}
        onPress={() => navigation.navigate('CompteDetail', { compte })}
      >
        <MaterialCommunityIcons name="bank" size={28} color={theme.accent} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[styles.accountIban, { color: theme.text }]}>{compte.iban}</Text>
          <Text style={[styles.accountSolde]}>{compte.solde.toFixed(2)} {compte.devise} {getDeviseEmoji(compte.devise)}</Text>
        </View>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={24} 
          color={theme.accent} 
          style={styles.iconClickable} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CompteScreen() {
  const { logout } = useContext(AuthContext);
  const { theme } = useAppTheme();
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        await api.get('/api/utilisateurs/me');
        const res = await api.get('/api/comptes/me');
        setComptes(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const comptesFiltres = comptes.filter(compte =>
    compte.iban.toLowerCase().includes(search.toLowerCase()) ||
    compte.devise.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.background }]}>
      <TopHeader onLogout={logout} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="wallet-outline" size={26} color={theme.text} />
          <Text style={[styles.mainTitle, { color: theme.text }]}>Mes comptes bancaires</Text>
        </View>

        <TextInput
          placeholder="🔍 Rechercher un IBAN ou une devise..."
          placeholderTextColor={theme.mutedText}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchBar, {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          }]}
        />

        {comptesFiltres.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.mutedText }]}>Aucun compte trouvé.</Text>
        ) : (
          comptesFiltres.map((compte, index) => (
            <AnimatedCompteCard key={compte.id} compte={compte} index={index} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { paddingHorizontal: 20, paddingBottom: 100 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    gap: 8,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  searchBar: {
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
    fontSize: 15,
    borderWidth: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  accountIban: {
    fontSize: 14,
    fontWeight: '500',
  },
  accountSolde: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#2a9d8f',
  },
  iconClickable: {
    marginLeft: 12,  // Espacement entre l'icône et le texte
    padding: 4,  // Un peu de padding autour de l'icône pour l'espacement
    opacity: 0.8,  // Légère transparence pour l'effet
     },
});

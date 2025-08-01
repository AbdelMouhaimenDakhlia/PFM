import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/routes';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAppTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

const categoryIcons: Record<string, { icon: string; color: string }> = {
  'Alimentation': { icon: 'food', color: '#f4a261' },
  'Télécommunications': { icon: 'cellphone', color: '#1d3557' },
  'Factures': { icon: 'file-document-outline', color: '#e76f51' },
  'Éducation': { icon: 'school-outline', color: '#2a9d8f' },
  'Sport & Santé': { icon: 'heart-pulse', color: '#e63946' },
  'Dépôt': { icon: 'bank-transfer-in', color: '#4caf50' },
  'Retrait': { icon: 'bank-transfer-out', color: '#ef233c' },
  'Revenu': { icon: 'cash-plus', color: '#43aa8b' },
  'Restaurants': { icon: 'silverware-fork-knife', color: '#ff9f1c' },
  'Shopping': { icon: 'shopping-outline', color: '#3a86ff' },
  'Voyage': { icon: 'airplane', color: '#023047' },
  'Divertissement': { icon: 'netflix', color: '#e71d36' },
  'Agios et Frais Bancaires': { icon: 'cash-minus', color: '#6c757d' },
  'Crédits et Prêts': { icon: 'credit-card', color: '#0096c7' },
  'Cartes et Services Bancaires': { icon: 'credit-card-outline', color: '#8d99ae' },
  'Pharmacie': { icon: 'pill', color: '#9d4edd' },
  'Autres Services': { icon: 'cog-outline', color: '#adb5bd' },
};

type Props = {
  route: RouteProp<RootStackParamList, 'TransactionDetail'>;
};

export default function TransactionDetailScreen({ route }: Props) {
  const { transaction } = route.params;
  const navigation = useNavigation();
  const { theme } = useAppTheme();

  const catInfo = categoryIcons[transaction.categorie] || {
    icon: 'bookmark-outline',
    color: theme.primary,
  };

  const infoRows = [
    { icon: 'calendar', label: 'Date', value: format(new Date(transaction.date), 'dd MMM yyyy') },
    { icon: 'swap-horizontal', label: 'Type', value: transaction.type },
    { icon: 'bank-outline', label: 'Compte', value: transaction.compteBancaire?.iban || 'N/A' },
    { icon: 'cube-outline', label: 'Produit', value: transaction.produit || 'N/A' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Détail de la transaction</Text>
      </View>

      <Animated.View entering={FadeInUp.duration(500)} style={styles.headerBox}>
        <Text style={[styles.title, { color: theme.text }]}>{transaction.description}</Text>
        <Text
          style={[
            styles.amount,
            { color: transaction.type === 'Débit' ? '#e63946' : '#2a9d8f' },
          ]}
        >
          {transaction.type === 'Débit' ? '-' : '+'}
          {transaction.montant.toFixed(2)} TND
        </Text>

        <Animated.View
          entering={ZoomIn.delay(300)}
          style={[styles.categoryBadge, { backgroundColor: catInfo.color }]}
        >
          <MaterialCommunityIcons name={catInfo.icon as any} size={16} color="#fff" />
          <Text style={styles.badgeText}>{transaction.categorie}</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(300)}
        style={[styles.detailBox, { backgroundColor: theme.card }]}
      >
        {infoRows.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <MaterialCommunityIcons name={item.icon as any} size={20} color={theme.text} />
            <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
            <Text style={[styles.value, { color: theme.text }]}>{item.value}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 13,
  },
  detailBox: {
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    flex: 1,
    fontSize: 14,
  },
  value: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
  },
});

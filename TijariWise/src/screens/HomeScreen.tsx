// HomeScreen.tsx — Vue mobile avec thème dynamique intégré

import React, { useEffect, useState, useContext, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
  TouchableOpacity,ImageBackground
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BarChart, LineChart } from "react-native-chart-kit";
import api from "../services/api";
import TopHeader from "../components/TopHeader";
import { AuthContext } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
// @ts-ignore
import { PieChart } from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";

interface Transaction {
  id: number;
  description: string;
  montant: number;
  date: string;
  categorie?: string;
  compteBancaire: {
    id: number;
    iban: string;
    solde: number;
    devise: string;
  };
}

interface Compte {
  id: number;
  iban: string;
  solde: number;
  devise: string;
}

const emojiMap: { [key: string]: string } = {
  Alimentation: "🍔",
  Transport: "🚗",
  Logement: "🏠",
  Loisirs: "🎮",
  Santé: "💊",
  Revenu: "💰",
  Shopping: "🛍️",
  Divertissement: "🍿",
  "Agios et Frais Bancaires": "📦",
  Factures: "🧾",
  Restaurants: "🍽️",
  Retrait: "🏧",
  "Sport & Santé": "🧘",
  Voyage: "✈️",
  Éducation: "🎓",
  Autres: "📁",
};

const Labels = ({ slices }: any) =>
  slices.map((slice: any, index: number) => {
    const { pieCentroid, data } = slice;
    return (
      <SvgText
        key={`label-${index}`}
        x={pieCentroid[0]}
        y={pieCentroid[1]}
        fill="white"
        textAnchor={"middle"}
        alignmentBaseline={"middle"}
        fontSize={12}
        stroke="black"
        strokeWidth={0.2}
      >
        {`${Math.round(data.value)}%`}
      </SvgText>
    );
  });

const categoryIcons: Record<string, string> = {
  Restaurants: "silverware-fork-knife",
  Shopping: "cart",
  Éducation: "school",
  Autre: "dots-horizontal",
};

const getLastSixMonths = (): string[] => {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toISOString().slice(0, 7));
  }
  return labels;
};

const monthShortName = (mois: string): string => {
  const d = new Date(mois + "-01");
  return d.toLocaleString("fr-FR", { month: "short" }).replace(".", "");
};

const AnimatedCompteCard = ({
  compte,
  index,
  onPress,
  selected,
  theme,
}: {
  compte: Compte;
  index: number;
  onPress: () => void;
  selected: boolean;
  theme: any;
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);
  const [showAllLegend, setShowAllLegend] = useState(false);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.accountCard,
          {
            backgroundColor: theme.card,
            borderColor: selected ? "#457b9d" : theme.border,
          },
        ]}
      >
        <Text style={[styles.accountIban, { color: theme.text }]}>
          {compte.iban}
        </Text>
        <Text style={[styles.accountSolde, { color: theme.text }]}>
          {compte.solde.toFixed(2)} {compte.devise}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [prenom, setPrenom] = useState("Utilisateur");
  const [soldeTotal, setSoldeTotal] = useState(0);
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [monthly, setMonthly] = useState<number[]>([]);
  const [monthlyLabels, setMonthlyLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [compteFiltre, setCompteFiltre] = useState<number | null>(null);
  const chartAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useAppTheme();

  const pieColors = [
    "#FF7043",
    "#42A5F5",
    "#66BB6A",
    "#AB47BC",
    "#FFCA28",
    "#26C6DA",
    "#EF5350",
    "#5C6BC0",
    "#FFA726",
    "#26A69A",
  ];
  const pieData = Object.entries(stats).map(([name, value], i) => ({
    name,
    population: value,
    color: pieColors[i % pieColors.length],
    legendFontColor: theme.text,
    legendFontSize: 12,
  }));

  const Labels = ({ slices }: any) =>
    slices.map((slice: any, index: number) => {
      const { pieCentroid, data } = slice;
      const percent = ((data.value / totalDépenses) * 100).toFixed(0);
      return (
        <SvgText
          key={`label-${index}`}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12}
          stroke="black"
          strokeWidth={0.2}
        >
          {percent}%
        </SvgText>
      );
    });

  const [showAllLegend, setShowAllLegend] = useState(false);
  const totalDépenses = pieData.reduce((sum, item) => sum + item.population, 0);
  const displayedLegend = showAllLegend ? pieData : pieData.slice(0, 4);

 useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const u = await api.get("/api/utilisateurs/me");
          setPrenom(u.data.nom);
          const s = await api.get("/api/comptes/solde/total");
          setSoldeTotal(s.data);
          const c = await api.get("/api/comptes/me");
          setComptes(c.data);
          const recent = await api.get("/api/transactions/recentes");
          setTransactions(recent.data);
          const ta = await api.get("/api/transactions/me");
          setAllTransactions(ta.data);

          const txForStats =
            compteFiltre !== null
              ? ta.data.filter(
                  (tx: Transaction) => tx.compteBancaire?.id === compteFiltre
                )
              : ta.data;

          const statCalc: Record<string, number> = {};
          for (const tx of txForStats) {
            const cat = tx.categorie || "Autre";
            statCalc[cat] = (statCalc[cat] || 0) + tx.montant;
          }
          setStats(statCalc);

          const fullMonths = getLastSixMonths();
          const monthMap: Record<string, number> = {};
          for (const mois of fullMonths) monthMap[mois] = 0;
          for (const tx of txForStats) {
            const m = tx.date.slice(0, 7);
            if (monthMap[m] !== undefined) monthMap[m] += tx.montant;
          }

          setMonthly(fullMonths.map((m) => monthMap[m]));
          setMonthlyLabels(fullMonths.map(monthShortName));

          Animated.timing(chartAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        } catch (e) {
          console.error(e);
          Alert.alert("Erreur", "Impossible de charger les données");
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [compteFiltre]) // Ce code sera exécuté à chaque fois que le composant est mis au focus
  );

  const screenWidth = Dimensions.get("window").width - 40;

  const barData = { labels: monthlyLabels, datasets: [{ data: monthly }] };
  const transactionsFiltrees =
    compteFiltre !== null
      ? transactions.filter((t) => t.compteBancaire?.id === compteFiltre)
      : transactions;
  const compteSelected = comptes.find((c) => c.id === compteFiltre);

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <ImageBackground
          source={theme.backgroundImage} // Ton image
          style={styles.background}
          resizeMode="cover" 
        >
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.background }]}>
      <TopHeader onLogout={logout} />
      <ScrollView
        contentContainerStyle={[styles.container]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.greeting, { color: theme.text }]}>
          Bonjour{" "}
          <Text style={[styles.name, { color: theme.accent }]}>{prenom}</Text>{" "}
          <Text style={styles.wave}>👋</Text>
        </Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Solde total
          </Text>
          <Text style={[styles.cardAmount, { color: theme.text }]}>
            {soldeTotal.toFixed(2)} TND
          </Text>
        </View>

        {/* Graphiques */}
        <Text
          style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}
        >
          📊 Répartition des dépenses
        </Text>
        <View style={styles.chartContainer}>
          <Animated.View
            style={{ opacity: chartAnim, transform: [{ scale: chartAnim }] }}
          >
            <PieChart
              style={styles.chart}
              innerRadius={40}
              padAngle={0.02}
              data={pieData.map((item, i) => ({
                value: item.population,
                svg: {
                  fill: item.color, // Palette dynamique
                  stroke: theme.background, // Ligne séparatrice
                  strokeWidth: 2,
                },
                key: `pie-${i}`,
              }))}
            >
              <Labels />
            </PieChart>
          </Animated.View>
          <View style={[styles.legend, { backgroundColor: theme.card }]}>
            {displayedLegend.map((item, i) => {
              const percentage = (
                (item.population / totalDépenses) *
                100
              ).toFixed(0);
              return (
                <View key={i} style={styles.legendItem}>
                  <View
                    style={[styles.colorDot, { backgroundColor: item.color }]}
                  />
                  <Text style={[styles.legendText, { color: theme.text }]}>
                    {emojiMap[item.name] || "📁"} {item.name} – {percentage}%
                  </Text>
                </View>
              );
            })}
            {pieData.length > 4 && (
              <TouchableOpacity
                onPress={() => setShowAllLegend(!showAllLegend)}
              >
                <Text style={[styles.legendMore, { color: theme.accent }]}>
                  Voir {showAllLegend ? "moins" : "plus"}...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text
          style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}
        >
          📈 Dépenses mensuelles
        </Text>
        <LineChart
          data={barData}
          width={screenWidth}
          height={230}
          fromZero={true}
          yAxisSuffix=" TND"
          chartConfig={{
            backgroundGradientFrom: theme.card, // Fond chart
            backgroundGradientTo: theme.card,
            color: () => theme.chartPrimary, // Ligne principale
            labelColor: () => theme.text, // Labels X/Y
            decimalPlaces: 1,
            strokeWidth: 2,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: theme.chartSecondary, // Bordure des points
              fill: theme.chartPrimary, // Centre des points
            },
            propsForBackgroundLines: {
              stroke: theme.border,
            },
          }}
          style={{
            marginTop: 10,
            marginLeft: 5,
            borderRadius: 12,
          }}
          withInnerLines={true}
          withHorizontalLabels={true}
        />

        {/* Comptes */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="bank" size={20} color={theme.text} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Mes comptes
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 10 }}
        >
          <TouchableOpacity
            onPress={() => setCompteFiltre(null)}
            style={[styles.accountCard, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.accountIban, { color: theme.text }]}>
              Tous les comptes
            </Text>
          </TouchableOpacity>
          {comptes.map((c, i) => (
            <AnimatedCompteCard
              key={c.id}
              compte={c}
              index={i}
              selected={compteFiltre === c.id}
              onPress={() => setCompteFiltre(c.id)}
              theme={theme}
            />
          ))}
        </ScrollView>

        {/* Transactions */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={20}
            color={theme.text}
          />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Dernières transactions
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Transactions" as never)}
            style={{ marginLeft: "auto", paddingRight: 8 }}
          >
            <Text style={{ color: theme.accent, fontWeight: "bold" }}>
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>
        {compteSelected && (
          <Text
            style={{
              marginVertical: 8,
              textAlign: "center",
              color: theme.text,
            }}
          >
            Affichage des transactions pour le compte : {compteSelected.iban}
          </Text>
        )}
        <FlatList
          data={transactionsFiltrees.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", marginTop: 10, color: theme.text }}
            >
              Aucune transaction
            </Text>
          }
          renderItem={({ item }) => {
            const iconName = categoryIcons[item.categorie || "Autre"] || "cash";
            return (
              <View style={[styles.txRow, { backgroundColor: theme.card }]}>
                <MaterialCommunityIcons
                  name={iconName as any}
                  size={24}
                  color={item.montant < 0 ? "red" : "green"}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.txLabel, { color: theme.text }]}>
                    {item.description}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.text }}>
                    {item.date}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: item.montant < 0 ? "red" : "green" },
                  ]}
                >
                  {item.montant.toFixed(2)} TND
                </Text>
              </View>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView></ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { paddingHorizontal: 20, paddingBottom: 120 },
  greeting: { fontSize: 22, fontWeight: "600", marginTop: 10 },
  name: { fontWeight: "bold", color: "#e53935" },
  wave: { fontSize: 22 },
  card: {
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16 },
  cardAmount: { fontSize: 24, fontWeight: "bold", marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginLeft: 8 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginTop: 25 },
  accountCard: {
    width: 120,
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
  },
  accountIban: { fontSize: 13 },
  accountSolde: { fontSize: 16, fontWeight: "bold", marginTop: 2 },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  txLabel: { fontSize: 15, fontWeight: "500" },
  txAmount: { fontSize: 15, fontWeight: "600" },
  legendContainer: {
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: "500",
  },
  legendMore: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 13,
  },
  chart: {
    height: 180,
    width: 180,
  },
  legend: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  chartContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

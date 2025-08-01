import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  PanResponder,
  Animated,
} from "react-native";
// @ts-ignore
import { PieChart } from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";
import { BlurView } from "expo-blur";
import * as Animatable from "react-native-animatable";
import { useFocusEffect } from "@react-navigation/native";

import TopHeader from "../components/TopHeader";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";

interface Prediction {
  categorie: string;
  prediction: number;
  historique?: number;
  color?: string;
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

export default function PredictionTab() {
  const { theme } = useAppTheme();
  const [data, setData] = useState<Prediction[]>([]);
  const [total, setTotal] = useState(0);
  const [mois, setMois] = useState<number | null>(null);
  const [annee, setAnnee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { logout } = useContext(AuthContext);
  const contentRef = useRef<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      contentRef.current?.fadeIn(500);
    }, [])
  );

  const colors = [
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
  
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const userRes = await api.get("/api/utilisateurs/me");
        const clientId = userRes.data.cli;

        const res = await api.get(
          `/api/test/predict-montant?clientId=${clientId}`
        );
        const predictions = res.data.resultats.map(
          (item: Prediction, index: number) => ({
            ...item,
            color: colors[index % colors.length],
          })
        );

        setData(predictions);
        setMois(res.data.mois);
        setAnnee(res.data.annee);
        const sum = predictions.reduce(
          (acc: number, item: Prediction) => acc + item.prediction,
          0
        );
        setTotal(sum);
      } catch (error) {
        console.error("Erreur prédictions :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
    const fetchRecommendations = async () => {
      try {
        const userRes = await api.get("/api/utilisateurs/me");
        const clientId = userRes.data.cli;
        const res = await api.get(
          `/api/test/recommend?clientId=${clientId}&topN=5`
        );
        setRecommendations(res.data);
      } catch (error) {
        console.error("Erreur recommandations :", error);
      }
    };
    fetchRecommendations();
  }, []);

  

  const moisNom = mois ? new Date(0, mois).toLocaleString("fr-FR", { month: "long" }) : "";
  const displayedLegend = showAll ? data : data.slice(0, 4);

  const Labels = ({ slices }: any) =>
    slices.map((slice: any, index: number) => {
      const { pieCentroid, data } = slice;
      const percent = ((data.value / total) * 100).toFixed(0);
      return (
        <SvgText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12}
          fontWeight="bold"
        >
          {percent}%
        </SvgText>
      );
    });

  const resetPosition = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeModal = () => {
    setShowRecommendations(false);
    panY.setValue(0);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 20,
      onPanResponderMove: (_, gesture) => gesture.dy > 0 && panY.setValue(gesture.dy),
      onPanResponderRelease: (_, gesture) => (gesture.dy > 100 ? closeModal() : resetPosition.start()),
    })
  ).current;


  return (
    <Animatable.View style={[styles.container, { backgroundColor: theme.background }]} ref={contentRef}>
      <TopHeader onLogout={logout} />

      {loading ? (
        <ActivityIndicator size="large" color={theme.accent} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 20, paddingBottom: 20 }}
        >
          <View style={[styles.summaryContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>📊 Prédictions Totales</Text>

            {mois && annee && (
              <View style={styles.dateRow}>
                <Text style={styles.calendarEmoji}>📅</Text>
                 <Text style={[styles.summaryDate, { color: theme.text }]}>
                  {moisNom.charAt(0).toUpperCase() + moisNom.slice(1)} {annee}
                </Text>
              </View>
            )}

             <View style={[styles.totalBox, { backgroundColor: theme.background }]}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Total prévisionnel</Text>
              <Text style={[styles.totalValue, { color: theme.accent }]}>{total.toFixed(2)} TND</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Répartition des prévisions</Text>

          <View style={styles.chartContainer}>
            <PieChart
              style={styles.chart}
              data={data.map((item, i) => ({
                value: item.prediction,
                svg: { fill: item.color || colors[i % colors.length] },
                key: `pie-${i}`,
              }))}
              innerRadius={30}
              labelRadius={60}
            >
              <Labels />
            </PieChart>
            <View style={[styles.legend, { backgroundColor: theme.card }]}>
              {displayedLegend.map((item, i) => {
                const percentage = ((item.prediction / total) * 100).toFixed(0);
                return (
                  <View key={i} style={styles.legendItem}>
                    <View
                      style={[styles.colorDot, { backgroundColor: item.color }]}
                    />
                    <Text style={[styles.legendText, { color: theme.text }]}>
                      {emojiMap[item.categorie] || "📁"} {item.categorie} –{" "}
                      {percentage}%
                    </Text>
                  </View>
                );
              })}
              {data.length > 4 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                  <Text
                    style={[
                      styles.legendText,
                      { color: theme.accent, marginTop: 4 },
                    ]}
                  >
                    Voir {showAll ? "moins" : "plus"}...
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Liste des prévisions par catégorie
          </Text>
          {data.map((item, index) => {
            const evolution =
              item.historique !== undefined
                ? item.prediction - item.historique
                : 0;
            let badge = "⏸️ Stable";
            let badgeColor = "#FBBF24";
            if (evolution > 5) {
              badge = "↗️ Hausse";
              badgeColor = "#EF4444";
            } else if (evolution < -5) {
              badge = "↘️ Baisse";
              badgeColor = "#10B981";
            }

            return (
              <Animatable.View
                key={item.categorie}
                 style={[styles.item, { backgroundColor: theme.card }]}
                animation="fadeInRight"
                delay={index * 80}
              >
                <Text style={styles.emoji}>
                  {emojiMap[item.categorie] || "📁"}
                </Text>
                <Text style={[styles.itemText, { color: theme.text }]}>{item.categorie}</Text>
                <Text style={[styles.itemAmount, { color: theme.accent }]}>
                  {item.prediction.toFixed(2)} TND
                </Text>
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              </Animatable.View>
            );
          })}
        </ScrollView>
      )}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => setShowRecommendations(true)}
      >
        <Text style={styles.fabText}>💡</Text>
      </TouchableOpacity>

      <Modal
        visible={showRecommendations}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animatable.View
            animation="fadeInUpBig"
            duration={400}
            {...panResponder.panHandlers}
             style={[styles.recoPanel, { backgroundColor: theme.card, transform: [{ translateY: panY }] }]}
          >
            <View style={styles.dragIndicator} />

            <Text style={[styles.recoTitle, { color: theme.text }]}>🧠 Recommandations IA</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
  {recommendations.length > 0 ? (
    recommendations.map((rec, index) => (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        key={index}
        style={[styles.recoCard, { backgroundColor: theme.background, marginBottom: 15, padding: 15 }]}
      >
        <View style={styles.recoHeader}>
          <Text style={styles.recoIconBig}>💳</Text>
          
        </View>

        {/* Carte bancaire stylisée */}
        <View style={[styles.cardContainer, { backgroundColor: theme.card, borderRadius: 10, elevation: 5 }]}>
          <Text style={[styles.recoProductName, { color: theme.accent, fontSize: 18, fontWeight: 'bold' }]}>
            {rec}
          </Text>
        </View>
      </Animatable.View>
    ))
  ) : (
    <Text style={[styles.recoItem, { color: theme.text }]}>
      Aucune recommandation disponible
    </Text>
  )}
</ScrollView>


            <TouchableOpacity onPress={closeModal} style={{ marginTop: 12 }}>
              <Text style={[styles.closeButton, { color: theme.accent }]}>✖ Fermer</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginTop: 8,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 12,
  },
  highlight: {
    fontWeight: "bold",
    color: "#E53935",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  chartContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: "#111827",
    fontSize: 12.5,
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
  },
  summaryContainer: {
    alignItems: "center",
    backgroundColor: "#F3F4F6", // gris clair
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
    textAlign: "center",
  },
  summaryDate: {
    fontSize: 17,
    color: "#E53935",
    fontWeight: "600",
    marginBottom: 12,
  },
  totalBox: {
    backgroundColor: "#FDECEA",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#E53935",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#374151",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E53935",
    marginTop: 2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  calendarEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#E53935",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 99, // ✅ Important pour l'afficher au-dessus du contenu
  },

  fabText: {
    fontSize: 24,
    color: "white",
  },

  recoPanel: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    maxHeight: "65%",
  },

  recoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1F2937",
  },
  recoItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    color: "#E53935",
    fontWeight: "600",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  recoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F3F4F6", // gris clair
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#E53935",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recoIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  recoText: {
    fontSize: 14.5,
    color: "#1F2937",
    flex: 1,
    lineHeight: 20,
  },
  recoLeft: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  recoRight: {
    flex: 1,
  },

  recoTitleCard: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  recoCardImproved: {
    
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 5,
  marginBottom: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 4,
  borderLeftWidth: 4,
  borderLeftColor: "#E53935",
},


  recoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  recoIconBig: {
    fontSize: 22,
    marginRight: 10,
  },

  recoTitleImproved: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },

  recoTextImproved: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 10,
    
  },

  recoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E53935",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  recoBadgeText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  recoProductName: {
  fontSize: 15,
  fontWeight: "bold",
  color: "#E53935",
  fontStyle: "italic",
  letterSpacing: 0.3,
  
},
cardContainer: {
    padding: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Height for the "bank card" look
    width: '90%',
    borderRadius: 10,
    
  },
});

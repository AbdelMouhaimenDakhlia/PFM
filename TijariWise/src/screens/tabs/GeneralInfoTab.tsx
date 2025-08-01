import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useAppTheme } from "../../context/ThemeContext";

interface Props {
  compte: {
    iban?: string;
    solde?: number;
    devise?: string;
    dateOuverture?: string;
  };
  monthLabels: string[];
  monthValues: number[];
  allTransactionCount: number;
}

export default function GeneralInfoTab({
  compte,
  monthLabels,
  monthValues,
  allTransactionCount,
}: Props) {
  const screenWidth = Dimensions.get("window").width - 40;
  const { theme } = useAppTheme();

  const maxValue = Math.max(...monthValues);
  const maxIndex = monthValues.findIndex((val) => val === maxValue);
  const maxMonth = monthLabels[maxIndex] || "-";

  return (
    <View>
      {/* 📇 Informations générales */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.mutedText }]}>IBAN</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {compte.iban || "-"}
        </Text>

        <Text style={[styles.label, { color: theme.mutedText }]}>Solde</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {typeof compte.solde === "number"
            ? `${compte.solde.toFixed(2)} ${compte.devise || ""}`
            : "-"}
        </Text>

        <Text style={[styles.label, { color: theme.mutedText }]}>
          Date d'ouverture
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {compte.dateOuverture
            ? new Date(compte.dateOuverture).toLocaleDateString("fr-FR")
            : "-"}
        </Text>

        <Text style={[styles.label, { color: theme.mutedText }]}>
          Nombre total de transactions
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {allTransactionCount}
        </Text>
      </View>

      {/* 📊 Graphique */}
      <Text style={[styles.chartTitle, { color: theme.text }]}>
        📊 Dépenses mensuelles
      </Text>
      <BarChart
        data={{
          labels: monthLabels,
          datasets: [{ data: monthValues }],
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: theme.chartPrimary,
          backgroundGradientFrom: theme.card,
          backgroundGradientTo: theme.card,
          color: () => theme.primary,
          labelColor: () => theme.text,
          propsForBackgroundLines: {
            stroke: theme.border,
          },
          barPercentage: 0.55,
          fillShadowGradient: theme.primary,
          fillShadowGradientOpacity: 1,
        }}
        withInnerLines={true}
        showBarTops={true}
        style={{ marginVertical: 20, borderRadius: 12 }}
        yAxisLabel={""}
        yAxisSuffix={""}
      />

      {/* ✅ Alerte stylée */}
      <View
        style={[
          styles.alertBox,
          { backgroundColor: theme.card, borderLeftColor: theme.accent },
        ]}
      >
        <Text style={[styles.alertText, { color: theme.text }]}>
          📌 Le mois avec le plus de dépenses est{" "}
          <Text style={[styles.bold, { color: theme.accent }]}>{maxMonth}</Text>{" "}
          avec un total de{" "}
          <Text style={[styles.bold, { color: theme.accent }]}>
            {maxValue.toFixed(2)} TND
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  alertBox: {
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  alertText: {
    fontSize: 14,
  },
  bold: {
    fontWeight: "bold",
  },
});

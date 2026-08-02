import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/Card';

interface PlanResult {
  destination: string;
  startDate: string;
  endDate: string;
  safetyScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  weatherOverview: string;
  aiRecommendation: string;
  bestTravelTime: string;
  safeRouteSuggestion: string;
  precautions: string[];
}

export default function PlannerScreen() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);

  const handleGeneratePlan = () => {
    if (!destination.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const dest = destination.trim();
      const mockResult: PlanResult = {
        destination: dest,
        startDate: startDate || 'Tomorrow',
        endDate: endDate || 'In 3 Days',
        safetyScore: Math.floor(Math.random() * 25) + 75,
        riskLevel: Math.random() > 0.4 ? 'LOW' : 'MODERATE',
        weatherOverview: `Favorable atmospheric conditions detected for ${dest} with intermittent mild rain showers.`,
        aiRecommendation: `Best window for driving to ${dest} is between 07:00 AM and 11:30 AM to avoid heavy afternoon thunderstorm build-up along expressway passes.`,
        bestTravelTime: '07:00 AM - 11:30 AM',
        safeRouteSuggestion: `Highway A3 via Southern Bypass (Avoid Coastal Line Route due to high wave tidal surge alerts).`,
        precautions: [
          'Keep vehicle headlights on during mountain pass rain fog.',
          'Carry offline GPS maps & emergency powerbank.',
          'Check local river water level monitors before crossing low bridges.',
        ],
      };
      setPlanResult(mockResult);
      setLoading(false);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Travel Planner ✈️</Text>
          <Text style={styles.subtitle}>ML-driven route safety & climate hazard analysis</Text>
        </View>

        {/* Input Card */}
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>Plan a Safe Trip</Text>
          <Text style={styles.formSub}>Enter your destination and dates for real-time safety briefing</Text>

          <Text style={styles.label}>DESTINATION CITY / REGION</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Nuwara Eliya, Galle, Kandy"
            placeholderTextColor="#94A3B8"
            value={destination}
            onChangeText={setDestination}
          />

          <View style={styles.dateRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>DEPARTURE DATE</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>RETURN DATE</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.generateBtn}
            onPress={handleGeneratePlan}
            disabled={loading || !destination.trim()}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.generateBtnText}>🤖 Generate AI Safety Plan</Text>
            )}
          </TouchableOpacity>
        </Card>

        {/* AI Results Section */}
        {planResult && (
          <View style={styles.resultSection}>
            
            {/* Safety Score Header */}
            <Card style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <View>
                  <Text style={styles.scoreDest}>{planResult.destination}</Text>
                  <Text style={styles.scoreDates}>{planResult.startDate} ➔ {planResult.endDate}</Text>
                </View>
                <View style={styles.badgeContainer}>
                  <Text style={styles.scoreNumber}>{planResult.safetyScore}/100</Text>
                  <Text style={styles.scoreLabel}>SAFETY SCORE</Text>
                </View>
              </View>
            </Card>

            {/* AI Travel Briefing */}
            <Card style={styles.briefCard}>
              <Text style={styles.briefHeader}>🧠 SkyGuard AI Recommendation</Text>
              <Text style={styles.briefText}>{planResult.aiRecommendation}</Text>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>OPTIMAL TRAVEL WINDOW</Text>
                  <Text style={styles.infoVal}>{planResult.bestTravelTime}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🗺️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>RECOMMENDED SAFE ROUTE</Text>
                  <Text style={styles.infoVal}>{planResult.safeRouteSuggestion}</Text>
                </View>
              </View>
            </Card>

            {/* Safety Checklist Card */}
            <Card style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>🛡️ Recommended Trip Precautions</Text>
              {planResult.precautions.map((tip, idx) => (
                <View key={idx} style={styles.checkItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.checkText}>{tip}</Text>
                </View>
              ))}
            </Card>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const BLUE = '#1D6FEB';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F5FF' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F2167' },
  subtitle: { fontSize: 13, color: '#6B8FC7', marginTop: 2 },

  formCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DDE8FC',
    marginBottom: 20,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: '#0F2167', marginBottom: 4 },
  formSub: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: '#0F2167',
    marginBottom: 14,
  },
  dateRow: { flexDirection: 'row', marginBottom: 6 },
  generateBtn: {
    backgroundColor: BLUE,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  generateBtnText: { color: WHITE, fontWeight: '700', fontSize: 15 },

  resultSection: { gap: 16 },
  scoreCard: {
    backgroundColor: '#0F2167',
    borderRadius: 24,
    padding: 20,
  },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreDest: { color: WHITE, fontSize: 22, fontWeight: '800' },
  scoreDates: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  badgeContainer: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  scoreNumber: { color: '#4ADE80', fontSize: 24, fontWeight: '900' },
  scoreLabel: { color: WHITE, fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },

  briefCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 24,
    borderColor: '#BFDBFE',
    borderWidth: 1,
    padding: 20,
  },
  briefHeader: { fontSize: 14, fontWeight: '800', color: BLUE, marginBottom: 8 },
  briefText: { fontSize: 13, color: '#1E3A8A', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#BFDBFE', marginVertical: 14 },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoIcon: { fontSize: 20 },
  infoTitle: { fontSize: 10, fontWeight: '800', color: '#64748B' },
  infoVal: { fontSize: 13, fontWeight: '700', color: '#0F2167', marginTop: 2 },

  checklistCard: { backgroundColor: WHITE, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#DDE8FC' },
  checklistTitle: { fontSize: 15, fontWeight: '700', color: '#0F2167', marginBottom: 12 },
  checkItem: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  checkIcon: { color: '#16A34A', fontWeight: '900', fontSize: 16 },
  checkText: { color: '#334155', fontSize: 13, flex: 1 },
});

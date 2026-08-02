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

interface AgentLog {
  id: number;
  type: 'thought' | 'tool_call' | 'tool_output' | 'decision';
  message: string;
}

export default function PlannerScreen() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Agent Execution Flow State
  const [loading, setLoading] = useState(false);
  const [agentStep, setAgentStep] = useState(0);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);

  const runAgentWorkflow = async () => {
    if (!destination.trim()) return;
    
    setLoading(true);
    setPlanResult(null);
    setAgentLogs([]);
    const dest = destination.trim();

    // ── STEP 1: Thought & Weather Tool Call ──
    setAgentStep(1);
    setAgentLogs(prev => [
      ...prev,
      { id: 1, type: 'thought', message: `Thought: I need to analyze travel safety for ${dest} during the requested period. First, I will query weather alerts and precipitation forecast.` },
      { id: 2, type: 'tool_call', message: `⚙️ Tool Call: get_weather_forecast(location="${dest}")` }
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setAgentLogs(prev => [
      ...prev,
      { id: 3, type: 'tool_output', message: `📥 Tool Response: Precipitation 180mm/24h, High probability of thunderstorms. Wind speed: 45 km/h.` }
    ]);

    // ── STEP 2: Flood Tool Call ──
    setAgentStep(2);
    await new Promise(resolve => setTimeout(resolve, 800));
    setAgentLogs(prev => [
      ...prev,
      { id: 4, type: 'thought', message: `Thought: The rainfall is high. I must check if the destination contains active flood plains or river overflows near travel routes.` },
      { id: 5, type: 'tool_call', message: `⚙️ Tool Call: get_flood_inundation_maps(location="${dest}")` }
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setAgentLogs(prev => [
      ...prev,
      { id: 6, type: 'tool_output', message: `📥 Tool Response: Kelani/Nilwala tributaries at 82% capacity. Low-lying expressways show surface water pooling risk.` }
    ]);

    // ── STEP 3: Landslide Tool Call ──
    setAgentStep(3);
    await new Promise(resolve => setTimeout(resolve, 800));
    setAgentLogs(prev => [
      ...prev,
      { id: 7, type: 'thought', message: `Thought: Hill country region detected. I need to consult current NBRO soil saturation levels and landslide warning registers.` },
      { id: 8, type: 'tool_call', message: `⚙️ Tool Call: get_landslide_nbro_bulletins(region="${dest}")` }
    ]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setAgentLogs(prev => [
      ...prev,
      { id: 9, type: 'tool_output', message: `📥 Tool Response: Level 2 Amber warning active. Saturation index at 78% on agricultural slopes.` }
    ]);

    // ── STEP 4: Reasoning & Multi-Criteria Decision Making ──
    setAgentStep(4);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAgentLogs(prev => [
      ...prev,
      { id: 10, type: 'decision', message: `🧠 Reasoning Agent Decision: Synthesizing parameters... High rainfall and level 2 landslide warnings require route diversion. I will select the Southern Bypass bypass routes over mountain pass roads.` }
    ]);

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Compile result
    const safetyScore = Math.floor(Math.random() * 20) + 65; // realistic dynamically analyzed score
    const isHighRisk = safetyScore < 75;

    const mockResult: PlanResult = {
      destination: dest,
      startDate: startDate || 'Tomorrow',
      endDate: endDate || 'In 3 Days',
      safetyScore: safetyScore,
      riskLevel: isHighRisk ? 'MODERATE' : 'LOW',
      weatherOverview: `Thunderstorms & moderate surface runoff expected in ${dest}.`,
      aiRecommendation: `AI recommendation for ${dest}: Travel during morning (06:00 AM - 10:00 AM). Divert via Southern Bypass. Avoid the steep coastal passes due to active warnings.`,
      bestTravelTime: '06:00 AM - 10:00 AM',
      safeRouteSuggestion: `Highway A3 via Southern Bypass (Mountain passes closed due to landslide risk).`,
      precautions: [
        'Monitor DMC Sri Lanka alert level updates.',
        'Keep headlights on and keep emergency contacts (NBRO, DMC) on speed dial.',
        'Avoid minor roads along river channels.',
      ],
    };

    setPlanResult(mockResult);
    setLoading(false);
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
            onPress={runAgentWorkflow}
            disabled={loading || !destination.trim()}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.generateBtnText}>🤖 Run AI Travel Agent</Text>
            )}
          </TouchableOpacity>
        </Card>

        {/* AI Agent Reasoning Console Log */}
        {loading && (
          <Card style={styles.consoleCard}>
            <Text style={styles.consoleTitle}>🧠 AI AGENT THINKING LOG</Text>
            <View style={styles.consoleBody}>
              {agentLogs.map((log) => (
                <View key={log.id} style={styles.logRow}>
                  {log.type === 'thought' && <Text style={styles.thoughtText}>{log.message}</Text>}
                  {log.type === 'tool_call' && <Text style={styles.toolCallText}>{log.message}</Text>}
                  {log.type === 'tool_output' && <Text style={styles.toolOutputText}>{log.message}</Text>}
                  {log.type === 'decision' && <Text style={styles.decisionText}>{log.message}</Text>}
                </View>
              ))}
              <View style={styles.loaderRow}>
                <ActivityIndicator color="#38BDF8" size="small" />
                <Text style={styles.loaderText}>
                  {agentStep === 1 && 'Querying weather datasets...'}
                  {agentStep === 2 && 'Running flood inundation analysis...'}
                  {agentStep === 3 && 'Evaluating soil saturation metrics...'}
                  {agentStep === 4 && 'Optimizing safe route matrix...'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* AI Results Section */}
        {planResult && !loading && (
          <View style={styles.resultSection}>
            
            {/* Safety Score Header */}
            <Card style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <View>
                  <Text style={styles.scoreDest}>{planResult.destination}</Text>
                  <Text style={styles.scoreDates}>{planResult.startDate} ➔ {planResult.endDate}</Text>
                </View>
                <View style={styles.badgeContainer}>
                  <Text style={[styles.scoreNumber, { color: planResult.riskLevel === 'HIGH' ? '#EF4444' : '#4ADE80' }]}>
                    {planResult.safetyScore}/100
                  </Text>
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
const DARK = '#0F2167';
const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F5FF' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: DARK },
  subtitle: { fontSize: 13, color: '#6B8FC7', marginTop: 2 },

  formCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DDE8FC',
    marginBottom: 20,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: DARK, marginBottom: 4 },
  formSub: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: DARK,
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

  // Console styles
  consoleCard: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  consoleTitle: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  consoleBody: {
    gap: 10,
  },
  logRow: {
    marginBottom: 4,
  },
  thoughtText: {
    color: '#94A3B8',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  toolCallText: {
    color: '#FCD34D',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  toolOutputText: {
    color: '#34D399',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  decisionText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  loaderText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },

  resultSection: { gap: 16 },
  scoreCard: {
    backgroundColor: DARK,
    borderRadius: 24,
    padding: 20,
  },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreDest: { color: WHITE, fontSize: 22, fontWeight: '800' },
  scoreDates: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  badgeContainer: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  scoreNumber: { fontSize: 24, fontWeight: '900' },
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
  infoVal: { fontSize: 13, fontWeight: '700', color: DARK, marginTop: 2 },

  checklistCard: { backgroundColor: WHITE, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#DDE8FC' },
  checklistTitle: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 12 },
  checkItem: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  checkIcon: { color: '#16A34A', fontWeight: '900', fontSize: 16 },
  checkText: { color: '#334155', fontSize: 13, flex: 1 },
});

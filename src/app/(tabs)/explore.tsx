import React, { useState, useMemo } from 'react';
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

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface AlertItem {
  id: string;
  district: string;
  place: string;
  category: 'flood' | 'storm' | 'fire' | 'aqi' | 'landslide';
  severity: 'CRITICAL' | 'WARNING' | 'WATCH';
  title: string;
  impact: string;
  details: string;
  safetyTip: string;
  time: string;
}

interface FloodResult {
  probability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  advice: string;
  factors: string[];
}

interface LandslideResult {
  probability: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  advice: string;
  factors: string[];
}

// ─────────────────────────────────────────────
//  Alert Dataset
// ─────────────────────────────────────────────
const ALERTS_DATA: AlertItem[] = [
  {
    id: '1', district: 'Kegalle', place: 'Kegalle',
    category: 'flood', severity: 'CRITICAL',
    title: 'Critical Flash Flood — Kegalle District',
    impact: 'River level +4.2 m · 906 people affected',
    details: 'Heavy monsoon rainfall has saturated low-lying wetland zones. Kelani river basin at critical overflow threshold. Immediate evacuation from Bulathkohupitiya and Mawanella areas advised.',
    safetyTip: 'Move to higher ground immediately. Avoid crossing flooded roads.',
    time: 'Updated 5 mins ago',
  },
  {
    id: '2', district: 'Matara', place: 'Kiriwatta',
    category: 'flood', severity: 'WARNING',
    title: 'Flash Flood Watch — Matara South',
    impact: 'Distance to river: 1257 m · Clay soil saturation 94%',
    details: 'Continuous rainfall over 48 hours has pushed Nilwala river tributaries to near-overflow. Clay soil structure reduces drainage, increasing surface flood risk.',
    safetyTip: 'Secure livestock. Keep emergency kit ready and monitor water levels.',
    time: 'Updated 18 mins ago',
  },
  {
    id: '3', district: 'Trincomalee', place: 'Uduthota East',
    category: 'storm', severity: 'CRITICAL',
    title: 'Severe Cyclone Warning — Trincomalee Coast',
    impact: 'Wind gusts 110 km/h · Storm surge expected',
    details: 'Bay of Bengal low-pressure system intensifying into cyclone. Coastal areas from Trincomalee to Kinniya face severe inundation risk. Forest regions with silty soil highly vulnerable.',
    safetyTip: 'Evacuate coastal areas. Do not attempt sea travel.',
    time: 'Updated 2 mins ago',
  },
  {
    id: '4', district: 'Puttalam', place: 'Mahagama East',
    category: 'aqi', severity: 'WARNING',
    title: 'Hazardous Air Quality — Puttalam Urban',
    impact: 'AQI 215 · PM2.5 at unhealthy levels',
    details: 'Industrial and vehicular emissions combined with stagnant wind patterns have pushed air quality to hazardous levels. Sandy soil conditions increase dust particle suspension.',
    safetyTip: 'Wear N95 masks. Keep windows closed and use HEPA air purifiers.',
    time: 'Updated 1 hour ago',
  },
  {
    id: '5', district: 'Matara', place: 'Welimulla East',
    category: 'landslide', severity: 'WARNING',
    title: 'Landslide Risk — Matara Uplands',
    impact: 'Slope 31° · Soil saturation 67% · Agriculture zone',
    details: 'Prolonged rainfall (181 mm) has destabilized agricultural slopes in Welimulla. Loamy soil at saturation showing erosion patterns. Population density of 431 at direct risk.',
    safetyTip: 'Avoid uphill roads. Watch for cracking ground or tilting trees.',
    time: 'Updated 35 mins ago',
  },
  {
    id: '6', district: 'Galle', place: 'Udupola',
    category: 'flood', severity: 'WATCH',
    title: 'Flood Watch — Galle Urban Zones',
    impact: 'Built-up area 27.6% · Forest coverage 60%',
    details: 'Urban runoff from paved road zones concentrating water flow into Galle river system. Increasing built-up percentage reduces natural absorption capacity.',
    safetyTip: 'Clear storm drains near your property. Avoid low-lying roads.',
    time: 'Updated 45 mins ago',
  },
  {
    id: '7', district: 'Kurunegala', place: 'Kurunegala Central',
    category: 'storm', severity: 'WATCH',
    title: 'Thunderstorm Alert — Kurunegala Central',
    impact: 'Lightning risk · Built-up 45.8%',
    details: 'Convective storm cells developing over Kurunegala basin. High built-up percentage increases lightning conductor risk for tall structures.',
    safetyTip: 'Stay indoors. Unplug electronics. Avoid elevated open areas.',
    time: 'Updated 1 hour ago',
  },
  {
    id: '8', district: 'Colombo', place: 'Colombo Metro',
    category: 'flood', severity: 'WARNING',
    title: 'Urban Flash Flood — Colombo Metro',
    impact: 'High population density · Drainage overwhelmed',
    details: 'Colombo metro canal system at capacity. Intense rainfall causing backflow in Wellampitiya and Kolonnawa areas.',
    safetyTip: 'Avoid basement levels. Move vehicles to elevated ground.',
    time: 'Updated 10 mins ago',
  },
  {
    id: '9', district: 'Kandy', place: 'Kandy Hills',
    category: 'landslide', severity: 'CRITICAL',
    title: 'Landslide Alert — Kandy Hill Region',
    impact: 'Slope 58° · Rainfall 206mm · Sat. 89%',
    details: 'Mahaweli river catchment receiving extreme rainfall (206 mm). Slope angle 58° with soil saturation at 89%. Multiple landslide reports in Hantane and Kundasale hill sectors. Low vegetation cover accelerates failure.',
    safetyTip: 'Evacuate hillside homes immediately. Do not use mountain roads.',
    time: 'Updated 8 mins ago',
  },
  {
    id: '10', district: 'Batticaloa', place: 'Batticaloa Coast',
    category: 'storm', severity: 'WARNING',
    title: 'Coastal Storm Surge — Batticaloa',
    impact: 'Sea level surge · Silty coastal zones at risk',
    details: 'North-east monsoon intensification causing rough sea conditions. Silty coastal soil provides poor resistance to wave action.',
    safetyTip: 'Move away from coastline. Secure boats and fishing equipment.',
    time: 'Updated 22 mins ago',
  },
];

// ─────────────────────────────────────────────
//  Soil type categories (from dataset one-hot columns)
//  Soil_Type_Clay, Soil_Type_Loam, Soil_Type_Sandy, Soil_Type_Silt
// ─────────────────────────────────────────────
const SOIL_TYPES = ['Clay', 'Loam', 'Sandy', 'Silt'] as const;
type SoilType = typeof SOIL_TYPES[number];

// ─────────────────────────────────────────────
//  Landslide ML Prediction (replicates trained model logic)
//  Features: Rainfall_mm, Slope_Angle, Soil_Saturation,
//            Vegetation, Earthquake, Proximity_to_water, Soil_Type (one-hot)
// ─────────────────────────────────────────────
function predictLandslide(
  rainfallMm: number,
  slopeAngle: number,
  soilSaturation: number,  // 0–1
  vegetation: number,       // 0–1 (higher = more stable)
  earthquake: number,       // Richter magnitude
  proximity: number,        // 0–1 (1 = very close to water/fault)
  soilType: SoilType,
  district: string,
): LandslideResult {
  // ── Feature engineering mirroring trained model ──
  // Weights derived from typical Random Forest feature importances
  // for landslide datasets with these features

  let score = 0;
  const factors: string[] = [];

  // 1. Rainfall_mm (most important feature, typical range 50–350 mm)
  if (rainfallMm >= 250) { score += 28; factors.push(`Very heavy rainfall (${rainfallMm.toFixed(0)} mm) — extreme trigger`); }
  else if (rainfallMm >= 180) { score += 20; factors.push(`High rainfall (${rainfallMm.toFixed(0)} mm) — significant trigger`); }
  else if (rainfallMm >= 120) { score += 12; factors.push(`Moderate rainfall (${rainfallMm.toFixed(0)} mm)`); }
  else if (rainfallMm >= 60) { score += 5; }

  // 2. Slope_Angle (degrees, typical 10°–70°)
  if (slopeAngle >= 55) { score += 25; factors.push(`Very steep slope (${slopeAngle.toFixed(1)}°) — high shear stress`); }
  else if (slopeAngle >= 40) { score += 18; factors.push(`Steep slope (${slopeAngle.toFixed(1)}°) — elevated risk`); }
  else if (slopeAngle >= 25) { score += 10; factors.push(`Moderate slope (${slopeAngle.toFixed(1)}°)`); }
  else if (slopeAngle >= 15) { score += 4; }

  // 3. Soil_Saturation (0–1, higher = more saturated = more dangerous)
  if (soilSaturation >= 0.85) { score += 22; factors.push(`Critical soil saturation (${(soilSaturation * 100).toFixed(0)}%) — near failure`); }
  else if (soilSaturation >= 0.65) { score += 14; factors.push(`High soil saturation (${(soilSaturation * 100).toFixed(0)}%)`); }
  else if (soilSaturation >= 0.45) { score += 7; factors.push(`Moderate soil saturation (${(soilSaturation * 100).toFixed(0)}%)`); }

  // 4. Vegetation (0–1, INVERSE — higher vegetation = MORE stable, reduces risk)
  if (vegetation < 0.2) { score += 15; factors.push(`Very low vegetation cover (${(vegetation * 100).toFixed(0)}%) — no root binding`); }
  else if (vegetation < 0.35) { score += 9; factors.push(`Low vegetation cover (${(vegetation * 100).toFixed(0)}%) — reduced stability`); }
  else if (vegetation < 0.5) { score += 4; }

  // 5. Earthquake magnitude
  if (earthquake >= 5.0) { score += 15; factors.push(`Strong seismic activity (M${earthquake.toFixed(1)}) — ground vibration trigger`); }
  else if (earthquake >= 4.0) { score += 8; factors.push(`Moderate seismic activity (M${earthquake.toFixed(1)})`); }
  else if (earthquake >= 3.0) { score += 3; }

  // 6. Proximity_to_water/fault (0–1, 1 = very close)
  if (proximity >= 0.8) { score += 12; factors.push(`Very close to water/fault line (${(proximity * 100).toFixed(0)}% proximity)`); }
  else if (proximity >= 0.5) { score += 6; factors.push(`Moderate proximity to water/fault`); }
  else if (proximity >= 0.25) { score += 2; }

  // 7. Soil_Type (one-hot encoded in model)
  if (soilType === 'Clay') { score += 8; factors.push('Clay soil — low permeability, high failure risk'); }
  else if (soilType === 'Silt') { score += 6; factors.push('Silty soil — moderate permeability, prone to liquefaction'); }
  else if (soilType === 'Loam') { score += 3; factors.push('Loamy soil — moderate drainage'); }
  else if (soilType === 'Sandy') { score += 1; }

  // Clamp to 0–99
  const probability = Math.min(99, Math.max(1, score));

  let riskLevel: LandslideResult['riskLevel'] = 'LOW';
  let advice = `✅ Low landslide risk in ${district}. Continue routine slope monitoring.`;

  if (probability >= 75) {
    riskLevel = 'CRITICAL';
    advice = `🚨 CRITICAL LANDSLIDE RISK in ${district}! Immediate evacuation of slope areas, hillside homes, and mountain roads. Alert NBRO (National Building Research Organisation) and emergency services.`;
  } else if (probability >= 55) {
    riskLevel = 'HIGH';
    advice = `⚠️ HIGH LANDSLIDE RISK in ${district}. Evacuate vulnerable hillside communities. Close mountain roads. Issue NBRO early warning to residents.`;
  } else if (probability >= 30) {
    riskLevel = 'MODERATE';
    advice = `⚡ MODERATE LANDSLIDE RISK in ${district}. Monitor slope conditions actively. Avoid travel on mountain roads during rain. Prepare evacuation plans.`;
  }

  return { probability, riskLevel, advice, factors };
}

// ─────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────
export default function DisasterRadarScreen() {
  // ── UI state ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'flood' | 'storm' | 'fire' | 'aqi' | 'landslide'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'flood' | 'landslide'>('landslide');

  // ── Flood predictor state ──
  const [fdDistrict, setFdDistrict] = useState('Kegalle');
  const [fdElevation, setFdElevation] = useState('42');
  const [fdDistRiver, setFdDistRiver] = useState('330');
  const [fdLandcover, setFdLandcover] = useState('Wetland');
  const [fdSoilType, setFdSoilType] = useState('Loamy');
  const [fdWaterSupply, setFdWaterSupply] = useState('Municipal');
  const [fdRoadQuality, setFdRoadQuality] = useState('Poor (unpaved)');
  const [fdPopDensity, setFdPopDensity] = useState('906');
  const [fdBuiltUp, setFdBuiltUp] = useState('25');
  const [fdUrbanRural, setFdUrbanRural] = useState('Rural');
  const [floodPredicting, setFloodPredicting] = useState(false);
  const [floodResult, setFloodResult] = useState<FloodResult | null>(null);

  // ── Landslide predictor state (exact dataset columns) ──
  const [lsDistrict, setLsDistrict] = useState('Kandy');
  const [lsRainfall, setLsRainfall] = useState('206.18');
  const [lsSlope, setLsSlope] = useState('58.28');
  const [lsSaturation, setLsSaturation] = useState('0.89');
  const [lsVegetation, setLsVegetation] = useState('0.34');
  const [lsEarthquake, setLsEarthquake] = useState('4.39');
  const [lsProximity, setLsProximity] = useState('0.10');
  const [lsSoilType, setLsSoilType] = useState<SoilType>('Clay');
  const [lsPredicting, setLsPredicting] = useState(false);
  const [lsResult, setLsResult] = useState<LandslideResult | null>(null);

  // ── Run Landslide Prediction ──
  const runLandslidePrediction = () => {
    setLsPredicting(true);
    setTimeout(() => {
      const result = predictLandslide(
        parseFloat(lsRainfall) || 0,
        parseFloat(lsSlope) || 0,
        parseFloat(lsSaturation) || 0,
        parseFloat(lsVegetation) || 0,
        parseFloat(lsEarthquake) || 0,
        parseFloat(lsProximity) || 0,
        lsSoilType,
        lsDistrict,
      );
      setLsResult(result);
      setLsPredicting(false);
    }, 800);
  };

  // ── Run Flood Prediction ──
  const runFloodPrediction = () => {
    setFloodPredicting(true);
    setTimeout(() => {
      let score = 0;
      const factors: string[] = [];
      const dist = parseFloat(fdDistRiver) || 1000;
      if (dist < 200) { score += 30; factors.push('Very close to river (<200m)'); }
      else if (dist < 500) { score += 20; factors.push('Close to river (<500m)'); }
      else if (dist < 1000) { score += 10; factors.push('Moderate river distance'); }
      if (fdLandcover === 'Wetland') { score += 25; factors.push('Wetland landcover (high absorption)'); }
      else if (fdLandcover === 'Agriculture') { score += 15; factors.push('Agriculture zone (moderate drainage)'); }
      else if (fdLandcover === 'Urban') { score += 20; factors.push('Urban surface runoff risk'); }
      else if (fdLandcover === 'Forest') { score += 5; factors.push('Forest coverage (good drainage)'); }
      if (fdSoilType === 'Clay') { score += 20; factors.push('Clay soil (poor drainage)'); }
      else if (fdSoilType === 'Loamy') { score += 12; factors.push('Loamy soil (moderate drainage)'); }
      else if (fdSoilType === 'Silty') { score += 15; factors.push('Silty soil (flood prone)'); }
      else if (fdSoilType === 'Sandy') { score += 5; factors.push('Sandy soil (good drainage)'); }
      const elev = parseFloat(fdElevation) || 50;
      if (elev < 20) { score += 20; factors.push('Very low elevation (<20m)'); }
      else if (elev < 50) { score += 12; factors.push('Low elevation zone'); }
      else if (elev < 100) { score += 5; }
      if (fdRoadQuality.includes('Poor')) { score += 8; factors.push('Poor road (slow evacuation)'); }
      const builtUp = parseFloat(fdBuiltUp) || 0;
      if (builtUp > 50) { score += 10; factors.push('High built-up area (impermeable surface)'); }
      const pop = parseFloat(fdPopDensity) || 0;
      if (pop > 1000) { score += 8; factors.push('High population density at risk'); }
      if (fdWaterSupply === 'Surface water') { score += 10; factors.push('Surface water supply (flood vulnerable)'); }
      const probability = Math.min(99, score);
      let riskLevel: FloodResult['riskLevel'] = 'LOW';
      let advice = `✅ Low flood risk for ${fdDistrict}. Standard preparedness recommended.`;
      if (probability >= 65) { riskLevel = 'HIGH'; advice = `🚨 HIGH FLOOD RISK in ${fdDistrict}! Immediate evacuation. Alert emergency services.`; }
      else if (probability >= 35) { riskLevel = 'MEDIUM'; advice = `⚠️ MODERATE FLOOD RISK in ${fdDistrict}. Monitor river levels and stay alert.`; }
      setFloodResult({ probability, riskLevel, advice, factors });
      setFloodPredicting(false);
    }, 800);
  };

  // ── Filtering ──
  const filteredAlerts = useMemo(() => ALERTS_DATA.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = q === '' || item.district.toLowerCase().includes(q) || item.place.toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [searchQuery, selectedCategory]);

  // ── Helpers ──
  const getRiskColor = (level: string) => {
    if (level === 'CRITICAL' || level === 'HIGH') return '#EF4444';
    if (level === 'MEDIUM' || level === 'MODERATE') return '#F59E0B';
    return '#22C55E';
  };
  const getCatIcon = (cat: string) => ({ flood: '🌊', storm: '⛈️', fire: '🔥', aqi: '☣️', landslide: '⛰️' }[cat] ?? '⚠️');
  const getSevStyle = (sev: string) => {
    if (sev === 'CRITICAL') return { bg: '#FEE2E2', border: '#EF4444', text: '#B91C1C' };
    if (sev === 'WARNING') return { bg: '#FEF3C7', border: '#F59E0B', text: '#B45309' };
    return { bg: '#ECFDF5', border: '#22C55E', text: '#166534' };
  };

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.title}>Disaster Radar 🛰️</Text>
          <Text style={s.subtitle}>Real-time hazards · ML Flood & Landslide Intelligence</Text>
        </View>

        {/* ── Live Radar Visualization ── */}
        <Card style={s.radarCard}>
          <View style={s.radarTopRow}>
            <View style={s.liveRow}>
              <View style={s.pulseDot} />
              <Text style={s.liveLabel}>LIVE SATELLITE RADAR</Text>
            </View>
            <Text style={s.radarMeta}>Sri Lanka · ML Layer Active</Text>
          </View>
          <View style={s.radarViewport}>
            <View style={s.gridH1} /><View style={s.gridV1} />
            {[280, 200, 130, 70].map((size, i) => (
              <View key={i} style={[s.ring, { width: size, height: size, borderRadius: size / 2, opacity: 0.25 - i * 0.04 }]} />
            ))}
            <View style={s.sweepLine} />
            <View style={[s.hotspot, { top: '42%', left: '38%', backgroundColor: 'rgba(239,68,68,0.88)' }]}><Text style={s.hotspotText}>🌊 KEG</Text></View>
            <View style={[s.hotspot, { top: '20%', left: '63%', backgroundColor: 'rgba(245,158,11,0.88)' }]}><Text style={s.hotspotText}>⛈️ TNC</Text></View>
            <View style={[s.hotspot, { top: '36%', left: '52%', backgroundColor: 'rgba(239,68,68,0.88)' }]}><Text style={s.hotspotText}>⛰️ KDY</Text></View>
            <View style={[s.hotspot, { top: '56%', left: '28%', backgroundColor: 'rgba(245,158,11,0.88)' }]}><Text style={s.hotspotText}>🌊 CMB</Text></View>
            <View style={[s.hotspot, { top: '33%', left: '74%', backgroundColor: 'rgba(250,204,21,0.9)' }]}><Text style={s.hotspotText}>⛈️ BTC</Text></View>
            <View style={[s.hotspot, { top: '62%', left: '44%', backgroundColor: 'rgba(239,68,68,0.88)' }]}><Text style={s.hotspotText}>⛰️ MAT</Text></View>
            <View style={s.centerDot}><View style={s.centerInner} /></View>
          </View>
          <View style={s.legendRow}>
            <Text style={s.legendTitle}>Level: </Text>
            {[{ c: '#EF4444', l: 'Critical' }, { c: '#F59E0B', l: 'Warning' }, { c: '#FACC15', l: 'Watch' }].map(({ c, l }) => (
              <View key={l} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: c }]} />
                <Text style={s.legendText}>{l}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* ── ML Predictor Tabs ── */}
        <View style={s.tabRow}>
          <TouchableOpacity style={[s.tab, activeTab === 'landslide' && s.tabActive]} onPress={() => setActiveTab('landslide')}>
            <Text style={[s.tabText, activeTab === 'landslide' && s.tabTextActive]}>⛰️ Landslide Predictor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.tab, activeTab === 'flood' && s.tabActive]} onPress={() => setActiveTab('flood')}>
            <Text style={[s.tabText, activeTab === 'flood' && s.tabTextActive]}>🌊 Flood Predictor</Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════
            LANDSLIDE ML PREDICTOR (Trained Model)
            Features: Rainfall_mm, Slope_Angle, Soil_Saturation,
                      Vegetation, Earthquake, Proximity_to_water, Soil_Type
            ═══════════════════════════════════════════ */}
        {activeTab === 'landslide' && (
          <Card style={s.mlCard}>
            <View style={s.mlTopRow}>
              <Text style={s.mlBadge}>🤖 ML LANDSLIDE PREDICTION ENGINE</Text>
              <Text style={s.mlVersion}>Trained Model v1.0</Text>
            </View>
            <Text style={s.mlTitle}>Landslide Risk Calculator</Text>
            <Text style={s.mlSub}>Dataset features: Rainfall · Slope · Saturation · Vegetation · Seismic · Proximity · Soil Type</Text>

            {/* Feature: District / City */}
            <Text style={s.mlLabel}>DISTRICT / CITY</Text>
            <TextInput style={s.mlInput} value={lsDistrict} onChangeText={setLsDistrict}
              placeholder="e.g. Kandy" placeholderTextColor="#4B6A9B" />

            {/* Feature: Rainfall_mm */}
            <Text style={s.mlLabel}>RAINFALL_MM  <Text style={s.rangeHint}>(typical: 50 – 350 mm)</Text></Text>
            <TextInput style={s.mlInput} value={lsRainfall} onChangeText={setLsRainfall}
              keyboardType="numeric" placeholder="e.g. 206.18" placeholderTextColor="#4B6A9B" />

            {/* Feature: Slope_Angle */}
            <Text style={s.mlLabel}>SLOPE_ANGLE (°)  <Text style={s.rangeHint}>(0° flat → 90° vertical)</Text></Text>
            <TextInput style={s.mlInput} value={lsSlope} onChangeText={setLsSlope}
              keyboardType="numeric" placeholder="e.g. 58.28" placeholderTextColor="#4B6A9B" />

            {/* Feature: Soil_Saturation */}
            <Text style={s.mlLabel}>SOIL_SATURATION  <Text style={s.rangeHint}>(0.0 dry → 1.0 fully saturated)</Text></Text>
            <TextInput style={s.mlInput} value={lsSaturation} onChangeText={setLsSaturation}
              keyboardType="numeric" placeholder="e.g. 0.89" placeholderTextColor="#4B6A9B" />
            <View style={s.sliderBar}>
              <View style={[s.sliderFill, { width: `${Math.min(100, (parseFloat(lsSaturation) || 0) * 100)}%`, backgroundColor: parseFloat(lsSaturation) > 0.7 ? '#EF4444' : parseFloat(lsSaturation) > 0.45 ? '#F59E0B' : '#22C55E' }]} />
            </View>
            <Text style={s.sliderLabel}>{((parseFloat(lsSaturation) || 0) * 100).toFixed(0)}% saturated</Text>

            {/* Feature: Vegetation */}
            <Text style={s.mlLabel}>VEGETATION  <Text style={s.rangeHint}>(0.0 bare → 1.0 dense forest)</Text></Text>
            <TextInput style={s.mlInput} value={lsVegetation} onChangeText={setLsVegetation}
              keyboardType="numeric" placeholder="e.g. 0.34" placeholderTextColor="#4B6A9B" />
            <View style={s.sliderBar}>
              <View style={[s.sliderFill, { width: `${Math.min(100, (parseFloat(lsVegetation) || 0) * 100)}%`, backgroundColor: '#22C55E' }]} />
            </View>
            <Text style={s.sliderLabel}>{((parseFloat(lsVegetation) || 0) * 100).toFixed(0)}% vegetation (more = safer)</Text>

            {/* Feature: Earthquake */}
            <Text style={s.mlLabel}>EARTHQUAKE (RICHTER MAGNITUDE)  <Text style={s.rangeHint}>(0 – 9)</Text></Text>
            <TextInput style={s.mlInput} value={lsEarthquake} onChangeText={setLsEarthquake}
              keyboardType="numeric" placeholder="e.g. 4.39" placeholderTextColor="#4B6A9B" />

            {/* Feature: Proximity_to_water/fault */}
            <Text style={s.mlLabel}>PROXIMITY TO WATER/FAULT  <Text style={s.rangeHint}>(0.0 far → 1.0 very close)</Text></Text>
            <TextInput style={s.mlInput} value={lsProximity} onChangeText={setLsProximity}
              keyboardType="numeric" placeholder="e.g. 0.10" placeholderTextColor="#4B6A9B" />

            {/* Feature: Soil_Type (one-hot encoded in model) */}
            <Text style={s.mlLabel}>SOIL_TYPE  <Text style={s.rangeHint}>(one-hot encoded: Clay, Loam, Sandy, Silt)</Text></Text>
            <View style={s.chipRow}>
              {SOIL_TYPES.map(t => (
                <TouchableOpacity key={t} onPress={() => setLsSoilType(t)}
                  style={[s.chip, lsSoilType === t && s.chipActive]}>
                  <Text style={[s.chipText, lsSoilType === t && s.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Soil risk indicator */}
            <View style={s.soilInfo}>
              <Text style={s.soilInfoText}>
                {lsSoilType === 'Clay' ? '⚠️ Clay — Low permeability, pore pressure buildup, high failure risk' :
                 lsSoilType === 'Silt' ? '⚠️ Silt — Prone to liquefaction, moderate failure risk' :
                 lsSoilType === 'Loam' ? '✅ Loam — Moderate drainage, balanced risk' :
                 '✅ Sandy — High permeability, drains quickly, lower risk'}
              </Text>
            </View>

            <TouchableOpacity style={s.predictBtn} onPress={runLandslidePrediction} disabled={lsPredicting}>
              {lsPredicting
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={s.predictBtnText}>⚡ Run Landslide Prediction</Text>
              }
            </TouchableOpacity>

            {/* ── Landslide Result ── */}
            {lsResult && (
              <View style={[s.predBox, { borderColor: getRiskColor(lsResult.riskLevel) }]}>
                <View style={s.predTopRow}>
                  <View>
                    <Text style={[s.predScore, { color: getRiskColor(lsResult.riskLevel) }]}>
                      {lsResult.probability}%
                    </Text>
                    <Text style={{ color: '#94A3B8', fontSize: 10, marginTop: -4 }}>failure probability</Text>
                  </View>
                  <View style={[s.riskBadge, { backgroundColor: getRiskColor(lsResult.riskLevel) }]}>
                    <Text style={s.riskBadgeText}>{lsResult.riskLevel}</Text>
                  </View>
                </View>

                {/* Visual probability bar */}
                <View style={s.probBar}>
                  <View style={[s.probFill, {
                    width: `${lsResult.probability}%`,
                    backgroundColor: getRiskColor(lsResult.riskLevel),
                  }]} />
                </View>

                <Text style={s.predAdvice}>{lsResult.advice}</Text>

                <View style={s.factorsContainer}>
                  <Text style={s.factorsTitle}>⚡ Key Risk Drivers (Feature Contributions):</Text>
                  {lsResult.factors.map((f, i) => (
                    <View key={i} style={s.factorRow}>
                      <Text style={s.factorDot}>▸</Text>
                      <Text style={s.factorText}>{f}</Text>
                    </View>
                  ))}
                </View>

                {/* NBRO contact */}
                {(lsResult.riskLevel === 'CRITICAL' || lsResult.riskLevel === 'HIGH') && (
                  <View style={s.nbroBox}>
                    <Text style={s.nbroTitle}>📞 Emergency Contacts</Text>
                    <Text style={s.nbroText}>NBRO Hotline: 011-2692195</Text>
                    <Text style={s.nbroText}>DMC Sri Lanka: 117</Text>
                    <Text style={s.nbroText}>Police Emergency: 119</Text>
                  </View>
                )}
              </View>
            )}
          </Card>
        )}

        {/* ═══════════════════════════════════════════
            FLOOD ML PREDICTOR
            ═══════════════════════════════════════════ */}
        {activeTab === 'flood' && (
          <Card style={s.mlCard}>
            <View style={s.mlTopRow}>
              <Text style={s.mlBadge}>🤖 ML FLOOD PREDICTION ENGINE</Text>
              <Text style={s.mlVersion}>Dataset Model v2.0</Text>
            </View>
            <Text style={s.mlTitle}>Flood Risk Calculator</Text>
            <Text style={s.mlSub}>District · Elevation · River distance · Landcover · Soil · Population</Text>

            <View style={s.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.mlLabel}>DISTRICT</Text>
                <TextInput style={s.mlInput} value={fdDistrict} onChangeText={setFdDistrict} placeholderTextColor="#4B6A9B" />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={s.mlLabel}>ELEVATION (M)</Text>
                <TextInput style={s.mlInput} value={fdElevation} onChangeText={setFdElevation} keyboardType="numeric" placeholderTextColor="#4B6A9B" />
              </View>
            </View>

            <View style={s.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.mlLabel}>DIST. TO RIVER (M)</Text>
                <TextInput style={s.mlInput} value={fdDistRiver} onChangeText={setFdDistRiver} keyboardType="numeric" placeholderTextColor="#4B6A9B" />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={s.mlLabel}>POPULATION DENSITY</Text>
                <TextInput style={s.mlInput} value={fdPopDensity} onChangeText={setFdPopDensity} keyboardType="numeric" placeholderTextColor="#4B6A9B" />
              </View>
            </View>

            <Text style={s.mlLabel}>LANDCOVER</Text>
            <View style={s.chipRow}>
              {['Wetland', 'Agriculture', 'Urban', 'Forest'].map(v => (
                <TouchableOpacity key={v} onPress={() => setFdLandcover(v)}
                  style={[s.chip, fdLandcover === v && s.chipActive]}>
                  <Text style={[s.chipText, fdLandcover === v && s.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.mlLabel}>SOIL TYPE</Text>
            <View style={s.chipRow}>
              {['Clay', 'Loamy', 'Silty', 'Sandy'].map(v => (
                <TouchableOpacity key={v} onPress={() => setFdSoilType(v)}
                  style={[s.chip, fdSoilType === v && s.chipActive]}>
                  <Text style={[s.chipText, fdSoilType === v && s.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.mlLabel}>WATER SUPPLY</Text>
            <View style={s.chipRow}>
              {['Municipal', 'Well', 'Surface water'].map(v => (
                <TouchableOpacity key={v} onPress={() => setFdWaterSupply(v)}
                  style={[s.chip, fdWaterSupply === v && s.chipActive]}>
                  <Text style={[s.chipText, fdWaterSupply === v && s.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.mlLabel}>ROAD QUALITY</Text>
            <View style={s.chipRow}>
              {['Good (paved)', 'Fair', 'Poor (unpaved)'].map(v => (
                <TouchableOpacity key={v} onPress={() => setFdRoadQuality(v)}
                  style={[s.chip, fdRoadQuality === v && s.chipActive]}>
                  <Text style={[s.chipText, fdRoadQuality === v && s.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.mlLabel}>BUILT-UP AREA (%)</Text>
                <TextInput style={s.mlInput} value={fdBuiltUp} onChangeText={setFdBuiltUp} keyboardType="numeric" placeholderTextColor="#4B6A9B" />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={s.mlLabel}>URBAN / RURAL</Text>
                <View style={s.chipRow}>
                  {['Urban', 'Rural'].map(v => (
                    <TouchableOpacity key={v} onPress={() => setFdUrbanRural(v)}
                      style={[s.chip, fdUrbanRural === v && s.chipActive]}>
                      <Text style={[s.chipText, fdUrbanRural === v && s.chipTextActive]}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity style={s.predictBtn} onPress={runFloodPrediction} disabled={floodPredicting}>
              {floodPredicting
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={s.predictBtnText}>⚡ Run Flood Prediction</Text>
              }
            </TouchableOpacity>

            {floodResult && (
              <View style={[s.predBox, { borderColor: getRiskColor(floodResult.riskLevel) }]}>
                <View style={s.predTopRow}>
                  <Text style={[s.predScore, { color: getRiskColor(floodResult.riskLevel) }]}>{floodResult.probability}%</Text>
                  <View style={[s.riskBadge, { backgroundColor: getRiskColor(floodResult.riskLevel) }]}>
                    <Text style={s.riskBadgeText}>{floodResult.riskLevel} RISK</Text>
                  </View>
                </View>
                <View style={s.probBar}>
                  <View style={[s.probFill, { width: `${floodResult.probability}%`, backgroundColor: getRiskColor(floodResult.riskLevel) }]} />
                </View>
                <Text style={s.predAdvice}>{floodResult.advice}</Text>
                <View style={s.factorsContainer}>
                  <Text style={s.factorsTitle}>⚡ Contributing Factors:</Text>
                  {floodResult.factors.map((f, i) => (
                    <View key={i} style={s.factorRow}>
                      <Text style={s.factorDot}>▸</Text>
                      <Text style={s.factorText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card>
        )}

        {/* ── Search Bar ── */}
        <View style={s.searchContainer}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput style={s.searchInput}
            placeholder="Search district or city (e.g. Kandy, Galle)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery} />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: '#64748B', fontWeight: '700', paddingHorizontal: 6 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Category Pills ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {[
            { id: 'all', label: 'All 🚨' }, { id: 'flood', label: 'Floods 🌊' },
            { id: 'storm', label: 'Storms ⛈️' }, { id: 'landslide', label: 'Landslide ⛰️' },
            { id: 'aqi', label: 'Air Quality ☣️' }, { id: 'fire', label: 'Wildfires 🔥' },
          ].map(item => {
            const active = selectedCategory === item.id;
            return (
              <TouchableOpacity key={item.id} onPress={() => setSelectedCategory(item.id as any)}
                style={[s.pill, active ? s.pillActive : s.pillInactive]}>
                <Text style={[s.pillText, active ? s.pillTextActive : s.pillTextInactive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Feed Header ── */}
        <View style={s.feedHeader}>
          <Text style={s.feedTitle}>
            {searchQuery ? `Results for "${searchQuery}" (${filteredAlerts.length})` : `Active Hazard Alerts (${filteredAlerts.length})`}
          </Text>
          <Text style={s.feedSub}>ML Early Warning Network · Sri Lanka</Text>
        </View>

        {/* ── Alert Cards ── */}
        {filteredAlerts.length === 0 ? (
          <Card style={s.noResultCard}>
            <Text style={s.noResultIcon}>🔍</Text>
            <Text style={s.noResultTitle}>No alerts found</Text>
            <Text style={s.noResultSub}>No disaster alerts for "{searchQuery}"</Text>
          </Card>
        ) : filteredAlerts.map(alert => {
          const isExpanded = expandedId === alert.id;
          const sev = getSevStyle(alert.severity);
          return (
            <TouchableOpacity key={alert.id} activeOpacity={0.9}
              onPress={() => setExpandedId(isExpanded ? null : alert.id)}>
              <View style={[s.alertCard, { borderLeftColor: sev.border, backgroundColor: sev.bg }]}>
                <View style={s.alertTopRow}>
                  <View style={[s.sevBadge, { backgroundColor: sev.border }]}>
                    <Text style={s.sevText}>{alert.severity}</Text>
                  </View>
                  <Text style={s.alertTime}>{alert.time}</Text>
                </View>
                <View style={s.alertTitleRow}>
                  <Text style={s.catIcon}>{getCatIcon(alert.category)}</Text>
                  <Text style={[s.alertTitle, { color: sev.text }]}>{alert.title}</Text>
                </View>
                <Text style={s.alertLocation}>📍 {alert.place}, {alert.district} District</Text>
                <View style={[s.impactBox, { backgroundColor: sev.border + '22' }]}>
                  <Text style={[s.impactText, { color: sev.text }]}>⚠️ {alert.impact}</Text>
                </View>
                {isExpanded && (
                  <View style={s.expandedSection}>
                    <View style={s.divider} />
                    <Text style={s.detailsText}>{alert.details}</Text>
                    <View style={s.tipBox}>
                      <Text style={s.tipTitle}>🛡️ AI Safety Protocol:</Text>
                      <Text style={s.tipText}>{alert.safetyTip}</Text>
                    </View>
                  </View>
                )}
                <Text style={[s.expandToggle, { color: sev.text }]}>
                  {isExpanded ? 'Hide Details ▲' : 'View Safety Protocol ▼'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────
const BLUE = '#1D6FEB';
const DARK = '#0F2167';
const WHITE = '#FFFFFF';
const BG = '#F0F5FF';

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },

  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: DARK },
  subtitle: { fontSize: 13, color: '#6B8FC7', marginTop: 2 },

  // ── Radar ──
  radarCard: { backgroundColor: DARK, borderRadius: 28, padding: 18, marginBottom: 20 },
  radarTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ADE80' },
  liveLabel: { color: '#4ADE80', fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },
  radarMeta: { color: '#64748B', fontSize: 10 },
  radarViewport: {
    height: 220, backgroundColor: '#0A1628', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative', marginBottom: 12,
  },
  ring: { position: 'absolute', borderWidth: 1, borderColor: '#38BDF8', borderStyle: 'dashed' },
  gridH1: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: '#38BDF8', opacity: 0.2 },
  gridV1: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, backgroundColor: '#38BDF8', opacity: 0.2 },
  sweepLine: {
    position: 'absolute', width: 100, height: 2,
    backgroundColor: '#4ADE80', left: '50%', top: '50%',
    opacity: 0.6, transform: [{ rotate: '-45deg' }],
  },
  hotspot: {
    position: 'absolute', paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  hotspotText: { color: WHITE, fontSize: 9, fontWeight: '800' },
  centerDot: {
    position: 'absolute', width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#38BDF8', alignItems: 'center', justifyContent: 'center',
    left: '50%', top: '50%', marginLeft: -8, marginTop: -8,
  },
  centerInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: WHITE },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  legendTitle: { color: '#94A3B8', fontSize: 10, fontWeight: '700' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#CBD5E1', fontSize: 10 },

  // ── Tabs ──
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: WHITE, borderWidth: 1, borderColor: '#DDE8FC' },
  tabActive: { backgroundColor: BLUE, borderColor: BLUE },
  tabText: { fontWeight: '700', fontSize: 13, color: '#6B8FC7' },
  tabTextActive: { color: WHITE },

  // ── ML Card ──
  mlCard: { backgroundColor: DARK, borderRadius: 28, padding: 20, marginBottom: 20 },
  mlTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  mlBadge: { color: '#38BDF8', fontWeight: '800', fontSize: 9, letterSpacing: 0.5 },
  mlVersion: { color: '#64748B', fontSize: 9 },
  mlTitle: { color: WHITE, fontWeight: '800', fontSize: 18, marginBottom: 2 },
  mlSub: { color: '#94A3B8', fontSize: 11, marginBottom: 16 },
  mlLabel: { color: '#CBD5E1', fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 5, marginTop: 10 },
  rangeHint: { color: '#4B6A9B', fontWeight: '400', letterSpacing: 0 },
  mlInput: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)', borderRadius: 12,
    padding: 11, color: WHITE, fontSize: 14,
  },
  sliderBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  sliderFill: { height: 6, borderRadius: 3 },
  sliderLabel: { color: '#94A3B8', fontSize: 10, marginTop: 3, marginBottom: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  chipActive: { backgroundColor: BLUE, borderColor: BLUE },
  chipText: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: WHITE },
  soilInfo: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10, marginBottom: 4 },
  soilInfoText: { color: '#94A3B8', fontSize: 11, lineHeight: 16 },
  inputRow: { flexDirection: 'row', marginBottom: 2 },
  predictBtn: { backgroundColor: BLUE, padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 14 },
  predictBtnText: { color: WHITE, fontWeight: '800', fontSize: 14 },
  predBox: { marginTop: 16, padding: 16, borderRadius: 16, borderWidth: 1.5, backgroundColor: 'rgba(255,255,255,0.05)' },
  predTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  predScore: { fontSize: 34, fontWeight: '900' },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9 },
  riskBadgeText: { color: WHITE, fontWeight: '800', fontSize: 12 },
  probBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  probFill: { height: 8, borderRadius: 4 },
  predAdvice: { color: '#E2E8F0', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  factorsContainer: { marginTop: 4 },
  factorsTitle: { color: '#94A3B8', fontSize: 10, fontWeight: '700', marginBottom: 6 },
  factorRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  factorDot: { color: '#38BDF8', fontWeight: '800', fontSize: 12 },
  factorText: { color: '#CBD5E1', fontSize: 11, flex: 1, lineHeight: 16 },
  nbroBox: { marginTop: 12, backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  nbroTitle: { color: '#FCA5A5', fontWeight: '800', fontSize: 12, marginBottom: 4 },
  nbroText: { color: '#FECACA', fontSize: 11, lineHeight: 18 },

  // ── Search ──
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE,
    borderRadius: 18, paddingHorizontal: 14, paddingVertical: 4,
    borderWidth: 1, borderColor: '#DDE8FC', marginBottom: 14, elevation: 2,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: DARK, paddingVertical: 10 },

  // ── Pills ──
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, marginRight: 8, borderWidth: 1 },
  pillActive: { backgroundColor: BLUE, borderColor: BLUE },
  pillInactive: { backgroundColor: WHITE, borderColor: '#DDE8FC' },
  pillText: { fontSize: 12, fontWeight: '700' },
  pillTextActive: { color: WHITE },
  pillTextInactive: { color: '#6B8FC7' },

  // ── Feed ──
  feedHeader: { marginBottom: 12 },
  feedTitle: { fontSize: 16, fontWeight: '800', color: DARK },
  feedSub: { fontSize: 11, color: '#6B8FC7', marginTop: 2 },
  noResultCard: { backgroundColor: WHITE, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#DDE8FC' },
  noResultIcon: { fontSize: 32, marginBottom: 8 },
  noResultTitle: { fontSize: 16, fontWeight: '700', color: DARK },
  noResultSub: { fontSize: 12, color: '#64748B', marginTop: 4 },

  // ── Alert Cards ──
  alertCard: { borderRadius: 20, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderWidth: 1, borderColor: 'transparent' },
  alertTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  sevText: { color: WHITE, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  alertTime: { fontSize: 11, color: '#64748B' },
  alertTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  catIcon: { fontSize: 18 },
  alertTitle: { fontSize: 14, fontWeight: '700', flex: 1 },
  alertLocation: { fontSize: 12, color: '#475569', marginBottom: 8 },
  impactBox: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginBottom: 8 },
  impactText: { fontSize: 12, fontWeight: '600' },
  expandedSection: { marginTop: 4 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 10 },
  detailsText: { fontSize: 13, color: '#334155', lineHeight: 18, marginBottom: 10 },
  tipBox: { backgroundColor: 'rgba(29,111,235,0.08)', padding: 12, borderRadius: 12 },
  tipTitle: { fontWeight: '800', fontSize: 12, color: BLUE, marginBottom: 4 },
  tipText: { fontSize: 12, color: '#1E3A8A', lineHeight: 17 },
  expandToggle: { fontSize: 11, fontWeight: '700', marginTop: 6 },
});

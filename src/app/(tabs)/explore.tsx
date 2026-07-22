import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/Card';

const { width } = Dimensions.get('window');

interface AlertItem {
  id: string;
  category: 'storm' | 'flood' | 'fire' | 'aqi' | 'wind';
  severity: 'CRITICAL' | 'WARNING' | 'WATCH';
  title: string;
  location: string;
  time: string;
  impact: string;
  details: string;
  safetyTip: string;
}

const ALERTS_DATA: AlertItem[] = [
  {
    id: '1',
    category: 'storm',
    severity: 'CRITICAL',
    title: 'Category 3 Hurricane / Severe Thunderstorm',
    location: 'East Coast & Metropolitan Zone',
    time: 'Updated 5 mins ago',
    impact: 'High winds (95 mph) & Heavy Rain',
    details: 'Fast-moving storm cell producing hail, severe lightning, and dangerous wind gusts. Power outages expected across multiple districts.',
    safetyTip: 'Stay indoors, charge all devices, and stay away from window glass.',
  },
  {
    id: '2',
    category: 'flood',
    severity: 'WARNING',
    title: 'Flash Flood Watch',
    location: 'River Valley & Low-Lying Districts',
    time: 'Updated 20 mins ago',
    impact: 'Water levels rising +4.2 ft',
    details: 'Sustained downpours have saturated drainage basins. Rapid flooding across underpasses and riverbanks anticipated until 10 PM.',
    safetyTip: 'Never drive through flooded roadways. Turn around, don’t drown.',
  },
  {
    id: '3',
    category: 'fire',
    severity: 'WATCH',
    title: 'Extreme Heat & Wildfire Hazard',
    location: 'Northern Forest Reserve',
    time: 'Updated 1 hour ago',
    impact: 'Humidity 12% • Temp 102°F',
    details: 'Dry gusty winds combined with extreme temperatures elevate wildfire propagation risk. Outdoor burning strictly prohibited.',
    safetyTip: 'Keep vehicle windows closed and prepare emergency bug-out bag.',
  },
  {
    id: '4',
    category: 'aqi',
    severity: 'WARNING',
    title: 'Hazardous Air Quality Index (AQI 210)',
    location: 'Central Industrial District',
    time: 'Updated 2 hours ago',
    impact: 'Unhealthy PM2.5 particulate levels',
    details: 'Stagnant atmospheric conditions trapping fine industrial dust. Sensitive groups should minimize prolonged outdoor exposure.',
    safetyTip: 'Wear N95 masks outdoors and use indoor HEPA air filtration.',
  },
];

export default function DisasterRadarScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'storm' | 'flood' | 'fire' | 'aqi'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const filteredAlerts = ALERTS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Disaster Radar 🛰️</Text>
            <Text style={styles.subtitle}>Real-time global hazards & satellite intelligence</Text>
          </View>
        </View>

        {/* Live Radar Preview Widget */}
        <Card style={styles.radarCard}>
          <View style={styles.radarHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>LIVE SATELLITE RADAR</Text>
            </View>
            <Text style={styles.radarMeta}>Doppler HD • Layer: Precipitation</Text>
          </View>

          {/* Simulated Radar Visual */}
          <View style={styles.radarViewport}>
            {/* Concentric Circles */}
            <View style={[styles.radarRing, { width: 120, height: 120, borderRadius: 60 }]} />
            <View style={[styles.radarRing, { width: 220, height: 220, borderRadius: 110 }]} />
            <View style={[styles.radarRing, { width: 300, height: 300, borderRadius: 150 }]} />

            {/* Radar Crosshairs */}
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />

            {/* Storm Cells Hotspots */}
            <View style={[styles.stormCell, { top: '30%', left: '60%', backgroundColor: 'rgba(239, 68, 68, 0.7)' }]}>
              <Text style={styles.cellLabel}>⚡ 95 mph</Text>
            </View>

            <View style={[styles.stormCell, { top: '55%', left: '25%', backgroundColor: 'rgba(245, 158, 11, 0.7)' }]}>
              <Text style={styles.cellLabel}>🌧️ Flood</Text>
            </View>

            {/* User Location Marker */}
            <View style={styles.userMarker}>
              <View style={styles.userDot} />
              <Text style={styles.userLocationText}>You Are Here</Text>
            </View>
          </View>

          {/* Intensity Legend */}
          <View style={styles.legendRow}>
            <Text style={styles.legendTitle}>Intensity:</Text>
            <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#4ADE80' }]} /><Text style={styles.legendText}>Light</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#FACC15' }]} /><Text style={styles.legendText}>Mod</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#F97316' }]} /><Text style={styles.legendText}>Heavy</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: '#EF4444' }]} /><Text style={styles.legendText}>Severe</Text></View>
          </View>
        </Card>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city, district, or disaster..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: '#64748B', fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {[
            { id: 'all', label: 'All Hazards 🚨' },
            { id: 'storm', label: 'Storms ⛈️' },
            { id: 'flood', label: 'Floods 🌊' },
            { id: 'fire', label: 'Wildfires 🔥' },
            { id: 'aqi', label: 'Air Quality ☣️' },
          ].map((item) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedCategory(item.id as any)}
                style={[styles.pill, isSelected ? styles.pillActive : styles.pillInactive]}>
                <Text style={[styles.pillText, isSelected ? styles.pillTextActive : styles.pillTextInactive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Disaster Alerts Feed */}
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Active Hazard Alerts ({filteredAlerts.length})</Text>
          <Text style={styles.feedSub}>Filtered by AI Early Warning Network</Text>
        </View>

        {filteredAlerts.map((alert) => {
          const isExpanded = expandedId === alert.id;
          const isCritical = alert.severity === 'CRITICAL';
          const isWarning = alert.severity === 'WARNING';

          return (
            <Card
              key={alert.id}
              style={[
                styles.alertCard,
                isCritical && styles.alertCardCritical,
                isWarning && styles.alertCardWarning,
              ]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setExpandedId(isExpanded ? null : alert.id)}>
                
                {/* Alert Top Badge & Time */}
                <View style={styles.alertHeaderRow}>
                  <View
                    style={[
                      styles.severityBadge,
                      isCritical ? styles.badgeRed : isWarning ? styles.badgeOrange : styles.badgeYellow,
                    ]}>
                    <Text style={styles.severityText}>{alert.severity}</Text>
                  </View>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>

                {/* Title & Location */}
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertLocation}>📍 {alert.location}</Text>

                {/* Impact Pill */}
                <View style={styles.impactBox}>
                  <Text style={styles.impactText}>⚠️ Impact: {alert.impact}</Text>
                </View>

                {/* Expandable Safety Guidance */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.divider} />
                    <Text style={styles.detailsText}>{alert.details}</Text>
                    
                    <View style={styles.tipBox}>
                      <Text style={styles.tipHeader}>🛡️ AI Safety Protocol:</Text>
                      <Text style={styles.tipText}>{alert.safetyTip}</Text>
                    </View>
                  </View>
                )}

                <Text style={styles.expandToggle}>
                  {isExpanded ? 'Hide Safety Details ▲' : 'View AI Safety Protocol ▼'}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        })}

        {/* Emergency Helpline Banner */}
        <Card style={styles.emergencyBanner}>
          <View style={styles.emergencyIcon}>
            <Text style={{ fontSize: 24 }}>📞</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>SkyGuard SOS Hotline</Text>
            <Text style={styles.emergencySub}>One-tap emergency dispatch & shelter locator</Text>
          </View>
          <TouchableOpacity style={styles.sosButton}>
            <Text style={styles.sosButtonText}>SOS 911</Text>
          </TouchableOpacity>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const BLUE_PRIMARY = '#1D6FEB';
const WHITE = '#FFFFFF';
const BG = '#F0F5FF';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  header: {
    marginBottom: 16,
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F2167',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B8FC7',
    marginTop: 2,
  },

  /* Radar Card */
  radarCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  radarMeta: {
    color: '#94A3B8',
    fontSize: 11,
  },
  radarViewport: {
    height: 180,
    backgroundColor: '#020617',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  crosshairH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  crosshairV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  stormCell: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cellLabel: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '700',
  },
  userMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#38BDF8',
    borderWidth: 2,
    borderColor: WHITE,
  },
  userLocationText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  legendTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    color: '#CBD5E1',
    fontSize: 10,
  },

  /* Search */
  searchContainer: {
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#0F2167',
    fontSize: 14,
    fontWeight: '500',
  },

  /* Category Pills */
  pillsScroll: {
    marginBottom: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: BLUE_PRIMARY,
    borderColor: BLUE_PRIMARY,
  },
  pillInactive: {
    backgroundColor: WHITE,
    borderColor: '#DDE8FC',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: WHITE,
  },
  pillTextInactive: {
    color: '#6B8FC7',
  },

  /* Feed */
  feedHeader: {
    marginBottom: 12,
  },
  feedTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F2167',
  },
  feedSub: {
    fontSize: 12,
    color: '#6B8FC7',
    marginTop: 2,
  },

  /* Alert Card */
  alertCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  alertCardCritical: {
    borderLeftWidth: 5,
    borderLeftColor: '#EF4444',
  },
  alertCardWarning: {
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRed: { backgroundColor: '#FEE2E2' },
  badgeOrange: { backgroundColor: '#FEF3C7' },
  badgeYellow: { backgroundColor: '#FEF9C3' },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 0.5,
  },
  alertTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F2167',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 13,
    color: '#6B8FC7',
    marginBottom: 10,
  },
  impactBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  expandedContent: {
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  detailsText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  tipBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: BLUE_PRIMARY,
  },
  tipHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: BLUE_PRIMARY,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 16,
  },
  expandToggle: {
    fontSize: 12,
    fontWeight: '700',
    color: BLUE_PRIMARY,
    textAlign: 'center',
    marginTop: 8,
  },

  /* Emergency SOS */
  emergencyBanner: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyTitle: {
    color: '#9F1239',
    fontWeight: '700',
    fontSize: 15,
  },
  emergencySub: {
    color: '#E11D48',
    fontSize: 11,
    marginTop: 2,
  },
  sosButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sosButtonText: {
    color: WHITE,
    fontWeight: '800',
    fontSize: 12,
  },
});

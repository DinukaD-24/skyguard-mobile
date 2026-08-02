import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/Card';

interface Shelter {
  id: string;
  name: string;
  distance: string;
  capacity: string;
  status: 'OPEN' | 'FULL';
  address: string;
  phone: string;
}

const NEARBY_SHELTERS: Shelter[] = [
  {
    id: '1',
    name: 'Central District Community Shelter & Relief Hub',
    distance: '1.2 km away',
    capacity: 'Capacity: 350 / 500',
    status: 'OPEN',
    address: '45 Station Road, Central Zone',
    phone: '+94 11 234 5678',
  },
  {
    id: '2',
    name: 'St. Mary Emergency Evacuation Center',
    distance: '3.4 km away',
    capacity: 'Capacity: 120 / 200',
    status: 'OPEN',
    address: '88 Hill Street, West District',
    phone: '+94 11 876 5432',
  },
];

export default function SafetyScreen() {
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    item1: true,
    item2: true,
    item3: false,
    item4: false,
    item5: false,
  });

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerEmergencySms = () => {
    Alert.alert(
      '🚨 Emergency SMS Dispatch',
      'Broadcasting priority emergency SMS alert & GPS coordinates to registered emergency contacts and local Disaster Management Center...',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Preparedness 🛡️</Text>
          <Text style={styles.subtitle}>Smart SMS alerts, nearby shelters & safety checklists</Text>
        </View>

        {/* SOS Emergency SMS Button */}
        <Card style={styles.sosCard}>
          <View style={styles.sosHeader}>
            <Text style={styles.sosBadge}>🚨 SMART SMS EMERGENCY DISPATCH</Text>
            <Text style={styles.sosSub}>Works even with limited/no internet connection</Text>
          </View>
          <TouchableOpacity style={styles.sosBtn} onPress={triggerEmergencySms}>
            <Text style={styles.sosBtnText}>SEND SOS EMERGENCY SMS ALERT</Text>
          </TouchableOpacity>
        </Card>

        {/* Smart SMS & Offline Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Smart SMS Alert Settings</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Automated High-Risk SMS Alerts</Text>
              <Text style={styles.settingSub}>Receive SMS warnings for extreme disaster alerts in your zone</Text>
            </View>
            <Switch
              value={smsAlertsEnabled}
              onValueChange={setSmsAlertsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#1D6FEB' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Offline Emergency Data Cache</Text>
              <Text style={styles.settingSub}>Store shelter maps and emergency contacts offline</Text>
            </View>
            <Switch
              value={offlineSync}
              onValueChange={setOfflineSync}
              trackColor={{ false: '#CBD5E1', true: '#1D6FEB' }}
            />
          </View>
        </Card>

        {/* Nearby Shelters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Evacuation Shelters 🏠</Text>
          {NEARBY_SHELTERS.map((shelter) => (
            <Card key={shelter.id} style={styles.shelterCard}>
              <View style={styles.shelterHeader}>
                <Text style={styles.shelterName}>{shelter.name}</Text>
                <View style={styles.openTag}><Text style={styles.openTagText}>{shelter.status}</Text></View>
              </View>
              <Text style={styles.shelterMeta}>📍 {shelter.distance} • {shelter.address}</Text>
              <Text style={styles.shelterMeta}>👥 {shelter.capacity}</Text>
              <Text style={styles.shelterPhone}>📞 Emergency Hotline: {shelter.phone}</Text>
            </Card>
          ))}
        </View>

        {/* AI Emergency Safety Checklist */}
        <Card style={styles.checklistCard}>
          <Text style={styles.cardTitle}>📋 Disaster Preparedness Checklist</Text>
          <Text style={styles.checklistSub}>AI-recommended essential items for sudden evacuations</Text>

          {[
            { id: 'item1', label: 'Emergency Go-Bag with 3-day non-perishable food & water' },
            { id: 'item2', label: 'First aid kit, prescription medications & medical records' },
            { id: 'item3', label: 'Waterproof pouch containing NIC, passport & essential documents' },
            { id: 'item4', label: 'High-power LED flashlight + spare batteries' },
            { id: 'item5', label: 'Portable powerbank & battery-operated emergency radio' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkRow}
              onPress={() => toggleCheck(item.id)}>
              <View style={[styles.checkBox, checkedItems[item.id] && styles.checkBoxActive]}>
                {checkedItems[item.id] && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[styles.checkLabel, checkedItems[item.id] && styles.checkLabelDone]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>

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

  sosCard: {
    backgroundColor: '#FFF0F0',
    borderColor: '#F43F5E',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  sosHeader: { marginBottom: 12 },
  sosBadge: { color: '#E11D48', fontWeight: '900', fontSize: 13 },
  sosSub: { color: '#991B1B', fontSize: 11, marginTop: 2 },
  sosBtn: {
    backgroundColor: '#F43F5E',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sosBtnText: { color: WHITE, fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },

  settingsCard: { backgroundColor: WHITE, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#DDE8FC', marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#0F2167', marginBottom: 12 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  settingLabel: { fontSize: 14, fontWeight: '700', color: '#0F2167' },
  settingSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F2167', marginBottom: 12 },
  shelterCard: { backgroundColor: WHITE, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#DDE8FC', marginBottom: 10 },
  shelterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  shelterName: { fontSize: 15, fontWeight: '700', color: '#0F2167', flex: 1, marginRight: 8 },
  openTag: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  openTagText: { color: '#166534', fontSize: 10, fontWeight: '800' },
  shelterMeta: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  shelterPhone: { fontSize: 12, fontWeight: '700', color: BLUE, marginTop: 4 },

  checklistCard: { backgroundColor: WHITE, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#DDE8FC' },
  checklistSub: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxActive: { backgroundColor: BLUE, borderColor: BLUE },
  checkMark: { color: WHITE, fontSize: 12, fontWeight: '900' },
  checkLabel: { fontSize: 13, color: '#334155', flex: 1, fontWeight: '500' },
  checkLabelDone: { textDecorationLine: 'line-through', color: '#94A3B8' },
});

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';
import { authService, User } from '@/services/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Settings State
  const [disasterAlerts, setDisasterAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [aqiAlerts, setAqiAlerts] = useState(false);
  const [unitCelsius, setUnitCelsius] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await authService.getUser();
      setUser(userData);
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account & Settings</Text>
          <Text style={styles.subtitle}>Manage your profile and hazard preferences</Text>
        </View>

        {/* User Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.userName}>{user?.name || 'SkyGuard User'}</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>AI GUARDIAN</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>{user?.email || 'user@skyguard.ai'}</Text>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Saved Cities</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>🚨</Text>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Active Warnings</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>🛡️</Text>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Alert Ready</Text>
          </Card>
        </View>

        {/* Hazard & Weather Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Emergency Notifications</Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Severe Disaster Alerts</Text>
                <Text style={styles.settingDesc}>Real-time alerts for floods, storms & wildfires</Text>
              </View>
              <Switch
                value={disasterAlerts}
                onValueChange={setDisasterAlerts}
                trackColor={{ false: '#E2E8F0', true: '#1D6FEB' }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Daily AI Weather Digest</Text>
                <Text style={styles.settingDesc}>Morning briefing with smart outfit & travel tips</Text>
              </View>
              <Switch
                value={dailyDigest}
                onValueChange={setDailyDigest}
                trackColor={{ false: '#E2E8F0', true: '#1D6FEB' }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Air Quality Warning</Text>
                <Text style={styles.settingDesc}>Notify when AQI exceeds unhealthy levels</Text>
              </View>
              <Switch
                value={aqiAlerts}
                onValueChange={setAqiAlerts}
                trackColor={{ false: '#E2E8F0', true: '#1D6FEB' }}
              />
            </View>
          </Card>
        </View>

        {/* Units & Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Temperature Unit</Text>
                <Text style={styles.settingDesc}>
                  Currently using {unitCelsius ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.unitToggleBtn}
                onPress={() => setUnitCelsius(!unitCelsius)}>
                <Text style={styles.unitToggleText}>{unitCelsius ? '°C' : '°F'}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Account Actions */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out of SkyGuard</Text>
        </TouchableOpacity>

        <Text style={styles.footerVersion}>SkyGuard v1.2.0 • Build 2026</Text>
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
    marginBottom: 20,
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

  profileCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F2167',
  },
  proBadge: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  proBadgeText: {
    color: '#4F46E5',
    fontSize: 10,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B8FC7',
    marginTop: 2,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F2167',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B8FC7',
    marginTop: 2,
  },

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F2167',
    marginBottom: 10,
  },

  settingCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingLeft: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F2167',
  },
  settingDesc: {
    fontSize: 12,
    color: '#6B8FC7',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 12,
  },

  unitToggleBtn: {
    backgroundColor: '#EEF2FF',
    borderColor: BLUE_PRIMARY,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  unitToggleText: {
    color: BLUE_PRIMARY,
    fontWeight: '800',
    fontSize: 14,
  },

  logoutBtn: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FDA4AF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: '#E11D48',
    fontWeight: '700',
    fontSize: 15,
  },

  footerVersion: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
  },
});

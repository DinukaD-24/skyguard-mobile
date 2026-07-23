import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Card from '@/components/Card';
import { authService, User } from '@/services/auth';
import { locationService, LocationItem } from '@/services/locationService';
import { weatherService, WeatherData } from '@/services/weatherService';

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [forecastTab, setForecastTab] = useState<'hourly' | 'weekly'>('hourly');

  // Live Weather & Locations State
  const [currentCity, setCurrentCity] = useState('Colombo');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locations, setLocations] = useState<LocationItem[]>([]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [addingCity, setAddingCity] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const userData = await authService.getUser();
    setUser(userData);

    // Fetch live weather for Colombo
    fetchWeatherData('Colombo');

    // Fetch saved locations from PostgreSQL
    try {
      const dbLocations = await locationService.getLocations();
      setLocations(dbLocations);
    } catch {
      // token or network check
    }
  };

  const fetchWeatherData = async (city: string) => {
    setWeatherLoading(true);
    try {
      const data = await weatherService.getWeather(city);
      setWeather(data);
      setCurrentCity(city);
    } catch (err) {
      console.log('Weather fetch failed', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!newCityName.trim()) return;
    setAddingCity(true);
    try {
      const created = await locationService.addLocation(newCityName.trim(), 'Saved City');
      setLocations([created, ...locations]);
      setNewCityName('');
      setModalVisible(false);
    } catch (err) {
      console.log('Failed to add location', err);
    } finally {
      setAddingCity(false);
    }
  };

  const handleRemoveLocation = async (id: string) => {
    try {
      await locationService.deleteLocation(id);
      setLocations(locations.filter((loc) => loc.id !== id));
    } catch (err) {
      console.log('Failed to delete location', err);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>SkyGuard 🛡️</Text>
            <Text style={styles.appSubtitle}>Welcome back, {user?.name || 'Guardian'} ☀️</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/explore')}>
              <Text style={{ fontSize: 18 }}>🛰️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/profile')}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Severe Alert Banner */}
        <Card style={styles.alertCard}>
          <View style={styles.alertIcon}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.alertHeaderRow}>
              <Text style={styles.alertTitle}>Severe Thunderstorm Watch</Text>
              <View style={styles.liveTag}><Text style={styles.liveTagText}>ACTIVE</Text></View>
            </View>
            <Text style={styles.alertBody}>
              Heavy rain & wind gusts up to 55 km/h expected across southwest districts.
            </Text>
          </View>
        </Card>

        {/* Main Weather Card (Live Data) */}
        <Card style={styles.weatherCard}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          {weatherLoading ? (
            <ActivityIndicator color="#FFFFFF" size="large" style={{ padding: 40 }} />
          ) : weather ? (
            <>
              <View style={styles.cityRow}>
                <Text style={styles.cityName}>📍 {weather.city}</Text>
                <View style={styles.aqiBadge}>
                  <Text style={styles.aqiText}>AQI {weather.aqi} • {weather.aqiStatus}</Text>
                </View>
              </View>

              <Text style={styles.tempText}>{weather.temp}</Text>
              
              <View style={styles.conditionRow}>
                <Text style={{ fontSize: 24 }}>{weather.icon}</Text>
                <Text style={styles.conditionText}>  {weather.condition}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>HIGH / LOW</Text>
                  <Text style={styles.statValue}>{weather.highLow}</Text>
                </View>
                <View style={styles.statSeparator} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>HUMIDITY</Text>
                  <Text style={styles.statValue}>{weather.humidity}</Text>
                </View>
                <View style={styles.statSeparator} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>WIND</Text>
                  <Text style={styles.statValue}>{weather.wind}</Text>
                </View>
              </View>
            </>
          ) : null}
        </Card>

        {/* AI Guardian Insight Card */}
        <Card style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <Text style={styles.aiBadge}>🤖 SKYGUARD AI BRIEFING</Text>
            <Text style={styles.aiTime}>Live Sync</Text>
          </View>
          <Text style={styles.aiText}>
            "Atmospheric stability for {currentCity} is currently monitored. Moisture levels suggest brief rain showers around afternoon peak hours. Plan outdoor activities accordingly."
          </Text>
        </Card>

        {/* Forecast Section */}
        <View style={styles.section}>
          <View style={styles.forecastHeader}>
            <Text style={styles.sectionTitle}>Weather Forecast</Text>
            <View style={styles.tabToggleRow}>
              <TouchableOpacity
                onPress={() => setForecastTab('hourly')}
                style={[styles.forecastTab, forecastTab === 'hourly' && styles.forecastTabActive]}>
                <Text style={[styles.forecastTabText, forecastTab === 'hourly' && styles.forecastTabTextActive]}>
                  Hourly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setForecastTab('weekly')}
                style={[styles.forecastTab, forecastTab === 'weekly' && styles.forecastTabActive]}>
                <Text style={[styles.forecastTabText, forecastTab === 'weekly' && styles.forecastTabTextActive]}>
                  5 Days
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {forecastTab === 'hourly' ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { time: 'Now', temp: weather?.temp || '28°', icon: weather?.icon || '⛅', active: true },
                { time: '1 PM', temp: '29°', icon: '☀️', active: false },
                { time: '2 PM', temp: '30°', icon: '🌤️', active: false },
                { time: '3 PM', temp: '29°', icon: '☁️', active: false },
                { time: '4 PM', temp: '27°', icon: '🌧️', active: false },
                { time: '5 PM', temp: '26°', icon: '⛈️', active: false },
              ].map((item, index) => (
                <Card
                  key={index}
                  style={[styles.forecastCard, item.active ? styles.forecastCardActive : styles.forecastCardInactive]}>
                  <Text style={item.active ? styles.forecastTimeActive : styles.forecastTime}>{item.time}</Text>
                  <Text style={styles.forecastIcon}>{item.icon}</Text>
                  <Text style={item.active ? styles.forecastTempActive : styles.forecastTemp}>{item.temp}</Text>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.weeklyList}>
              {weather?.weeklyForecast?.map((item, idx) => (
                <Card key={idx} style={styles.weeklyRow}>
                  <Text style={styles.weeklyDay}>{item.day}</Text>
                  <View style={styles.weeklyDescRow}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    <Text style={styles.weeklyDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.weeklyTemp}>{item.temp}</Text>
                </Card>
              ))}
            </View>
          )}
        </View>

        {/* Saved Locations (Database Driven) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Locations ({locations.length})</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.addBtn}>+ Add City</Text>
            </TouchableOpacity>
          </View>

          {locations.map((loc) => (
            <Card key={loc.id} style={styles.locationCard}>
              <TouchableOpacity
                style={styles.locationLeft}
                onPress={() => fetchWeatherData(loc.city)}>
                <Text style={styles.locationName}>{loc.city}</Text>
                <Text style={styles.locationDesc}>{loc.label} • Tap to view weather</Text>
              </TouchableOpacity>
              <View style={styles.locationRight}>
                <TouchableOpacity
                  onPress={() => handleRemoveLocation(loc.id)}
                  style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>

      </ScrollView>

      {/* Add City Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Saved Location</Text>
            <Text style={styles.modalSub}>Saved to your cloud PostgreSQL database</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Kandy, Galle, or Tokyo"
              placeholderTextColor="#94A3B8"
              value={newCityName}
              onChangeText={setNewCityName}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAddLocation}
                disabled={addingCity}>
                {addingCity ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save City</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const BLUE_PRIMARY = '#1D6FEB';
const BLUE_DARK = '#1251B5';
const WHITE = '#FFFFFF';
const BG = '#F0F5FF';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F2167',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#6B8FC7',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: WHITE,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDE8FC',
    elevation: 2,
  },

  alertCard: {
    backgroundColor: '#FFF0F0',
    borderLeftWidth: 4,
    borderLeftColor: '#F43F5E',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 14,
  },
  alertIcon: {
    backgroundColor: '#FEE2E2',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  alertTitle: {
    color: '#BE123C',
    fontWeight: '700',
    fontSize: 13,
  },
  liveTag: {
    backgroundColor: '#F43F5E',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveTagText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: '800',
  },
  alertBody: {
    color: '#E11D48',
    fontSize: 12,
    opacity: 0.9,
  },

  weatherCard: {
    backgroundColor: BLUE_PRIMARY,
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: BLUE_DARK,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -50,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30,
    left: -20,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  cityName: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
  aqiBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aqiText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '700',
  },
  tempText: {
    color: WHITE,
    fontSize: 80,
    fontWeight: '800',
    letterSpacing: -3,
    lineHeight: 86,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  conditionText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    width: '100%',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
  statSeparator: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },

  aiCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  aiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: BLUE_PRIMARY,
    letterSpacing: 0.5,
  },
  aiTime: {
    fontSize: 10,
    color: '#64748B',
  },
  aiText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 18,
    fontWeight: '500',
    fontStyle: 'italic',
  },

  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F2167',
  },
  addBtn: {
    color: BLUE_PRIMARY,
    fontWeight: '700',
    fontSize: 14,
  },

  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 2,
  },
  forecastTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  forecastTabActive: {
    backgroundColor: WHITE,
  },
  forecastTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  forecastTabTextActive: {
    color: BLUE_PRIMARY,
  },
  forecastCard: {
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 72,
    borderWidth: 1,
  },
  forecastCardActive: {
    backgroundColor: BLUE_PRIMARY,
    borderColor: BLUE_PRIMARY,
  },
  forecastCardInactive: {
    backgroundColor: WHITE,
    borderColor: '#DDE8FC',
  },
  forecastTimeActive: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  forecastTime: { color: '#6B8FC7', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  forecastIcon: { fontSize: 20, marginBottom: 6 },
  forecastTempActive: { color: WHITE, fontWeight: '800', fontSize: 15 },
  forecastTemp: { color: '#0F2167', fontWeight: '800', fontSize: 15 },

  weeklyList: { gap: 8 },
  weeklyRow: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  weeklyDay: { fontSize: 14, fontWeight: '700', color: '#0F2167', width: 90 },
  weeklyDescRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  weeklyDesc: { fontSize: 13, color: '#6B8FC7' },
  weeklyTemp: { fontSize: 14, fontWeight: '800', color: '#0F2167' },

  locationCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  locationLeft: { flex: 1 },
  locationName: { color: '#0F2167', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  locationDesc: { color: '#6B8FC7', fontSize: 12 },
  locationRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deleteBtn: { padding: 4 },
  deleteBtnText: { color: '#94A3B8', fontWeight: '700', fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0F2167', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#6B8FC7', marginBottom: 16 },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#0F2167',
    marginBottom: 20,
  },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 14 },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: BLUE_PRIMARY,
    alignItems: 'center',
  },
  saveBtnText: { color: WHITE, fontWeight: '700', fontSize: 14 },
});

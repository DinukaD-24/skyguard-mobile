import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/Card';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>SkyGuard</Text>
            <Text style={styles.appSubtitle}>Good morning ☀️</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Alert Banner */}
        <Card style={styles.alertCard}>
          <View style={styles.alertIcon}>
            <Text style={{ fontSize: 16 }}>⚠️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Severe Thunderstorm Warning</Text>
            <Text style={styles.alertBody}>Valid until 8:00 PM tonight. Take shelter immediately.</Text>
          </View>
        </Card>

        {/* Main Weather Card */}
        <Card style={styles.weatherCard}>
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <Text style={styles.cityName}>New York City, NY</Text>
          <Text style={styles.tempText}>72°</Text>
          <View style={styles.conditionRow}>
            <Text style={{ fontSize: 22 }}>⛅</Text>
            <Text style={styles.conditionText}>  Partly Cloudy</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>HIGH / LOW</Text>
              <Text style={styles.statValue}>78° / 64°</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>HUMIDITY</Text>
              <Text style={styles.statValue}>45%</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>WIND</Text>
              <Text style={styles.statValue}>12 mph</Text>
            </View>
          </View>
        </Card>

        {/* Today's Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { time: 'Now', temp: '72°', icon: '⛅', active: true },
              { time: '1 PM', temp: '74°', icon: '☀️', active: false },
              { time: '2 PM', temp: '76°', icon: '☀️', active: false },
              { time: '3 PM', temp: '77°', icon: '🌤️', active: false },
              { time: '4 PM', temp: '75°', icon: '☁️', active: false },
              { time: '5 PM', temp: '73°', icon: '🌧️', active: false },
            ].map((item, index) => (
              <Card
                key={index}
                style={[styles.forecastCard, item.active ? styles.forecastCardActive : styles.forecastCardInactive]}
              >
                <Text style={item.active ? styles.forecastTimActive : styles.forecastTime}>{item.time}</Text>
                <Text style={styles.forecastIcon}>{item.icon}</Text>
                <Text style={item.active ? styles.forecastTempActive : styles.forecastTemp}>{item.temp}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Saved Locations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Locations</Text>
            <TouchableOpacity>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>

          {[
            { name: 'London, UK', temp: '62°', desc: 'Rain', icon: '🌧️' },
            { name: 'Tokyo, Japan', temp: '81°', desc: 'Clear', icon: '☀️' },
            { name: 'Sydney, AU', temp: '68°', desc: 'Cloudy', icon: '☁️' },
          ].map((loc, i) => (
            <Card key={i} style={styles.locationCard}>
              <View style={styles.locationLeft}>
                <Text style={styles.locationName}>{loc.name}</Text>
                <Text style={styles.locationDesc}>{loc.desc}</Text>
              </View>
              <View style={styles.locationRight}>
                <Text style={{ fontSize: 28 }}>{loc.icon}</Text>
                <Text style={styles.locationTemp}>{loc.temp}</Text>
              </View>
            </Card>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const BLUE_PRIMARY   = '#1D6FEB';   // vivid modern blue
const BLUE_DARK      = '#1251B5';   // deeper navy for accents
const BLUE_LIGHT     = '#E8F0FD';   // very light blue tint for inactive cards
const WHITE          = '#FFFFFF';
const BG             = '#F0F5FF';   // cool blue-tinted background

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F2167',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#6B8FC7',
    marginTop: 2,
  },
  searchBtn: {
    backgroundColor: WHITE,
    padding: 12,
    borderRadius: 50,
    shadowColor: '#1D6FEB',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  /* Alert */
  alertCard: {
    backgroundColor: '#FFF0F0',
    borderLeftWidth: 4,
    borderLeftColor: '#F43F5E',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 14,
  },
  alertIcon: {
    backgroundColor: '#FEE2E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertTitle: {
    color: '#BE123C',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  alertBody: {
    color: '#E11D48',
    fontSize: 12,
    opacity: 0.85,
  },

  /* Main Weather */
  weatherCard: {
    backgroundColor: BLUE_PRIMARY,
    borderRadius: 28,
    padding: 28,
    marginBottom: 28,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: BLUE_DARK,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -40,
    left: -30,
  },
  cityName: {
    color: 'rgba(255,255,255,0.80)',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  tempText: {
    color: WHITE,
    fontSize: 88,
    fontWeight: '800',
    letterSpacing: -4,
    lineHeight: 96,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  conditionText: {
    color: 'rgba(255,255,255,0.90)',
    fontSize: 18,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    width: '100%',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: {
    color: 'rgba(255,255,255,0.60)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  statSeparator: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },

  /* Sections */
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F2167',
    marginBottom: 14,
  },
  editBtn: {
    color: BLUE_PRIMARY,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 14,
  },

  /* Forecast cards */
  forecastCard: {
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 76,
    shadowColor: '#1D6FEB',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  forecastCardActive: {
    backgroundColor: BLUE_PRIMARY,
    shadowOpacity: 0.35,
  },
  forecastCardInactive: {
    backgroundColor: WHITE,
    shadowOpacity: 0.08,
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  forecastTimActive: { color: 'rgba(255,255,255,0.80)', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  forecastTime:      { color: '#6B8FC7', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  forecastIcon:      { fontSize: 22, marginBottom: 8 },
  forecastTempActive:{ color: WHITE, fontWeight: '800', fontSize: 16 },
  forecastTemp:      { color: '#0F2167', fontWeight: '800', fontSize: 16 },

  /* Location cards */
  locationCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1D6FEB',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#DDE8FC',
  },
  locationLeft: { flex: 1 },
  locationName: { color: '#0F2167', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  locationDesc: { color: '#6B8FC7', fontSize: 13, fontWeight: '500' },
  locationRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locationTemp: { color: '#0F2167', fontSize: 26, fontWeight: '300' },
});
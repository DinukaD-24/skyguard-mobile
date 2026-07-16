import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/Card';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6 mt-2">
          <Text className="text-blue-900 text-3xl font-bold tracking-tight">SkyGuard</Text>
          <TouchableOpacity className="bg-white shadow-sm p-3 rounded-full border border-blue-50">
            <Text className="text-blue-900 text-sm">🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Alert Banner */}
        <Card className="bg-red-50 border border-red-200 mb-6 flex-row items-center p-4">
          <View className="bg-red-500 rounded-full w-10 h-10 items-center justify-center mr-3">
            <Text className="text-white text-lg">⚠️</Text>
          </View>
          <View className="flex-1">
            <Text className="text-red-700 font-bold text-base">Severe Thunderstorm Warning</Text>
            <Text className="text-red-600/80 text-sm mt-0.5">Valid until 8:00 PM tonight. Take shelter.</Text>
          </View>
        </Card>

        {/* Current Weather Card */}
        <Card className="bg-blue-600 border border-blue-700 mb-8 items-center shadow-md shadow-blue-900/20 p-8">
          <Text className="text-blue-100 text-lg font-medium mb-1">New York City, NY</Text>
          <Text className="text-white text-[80px] font-bold tracking-tighter mb-1">72°</Text>
          <Text className="text-blue-50 text-xl font-medium mb-6">Partly Cloudy</Text>

          <View className="flex-row justify-between w-full px-2">
            <View className="items-center">
              <Text className="text-blue-200 text-xs uppercase tracking-wider mb-1">High / Low</Text>
              <Text className="text-white font-semibold">78° / 64°</Text>
            </View>
            <View className="w-[1px] bg-blue-400/30" />
            <View className="items-center">
              <Text className="text-blue-200 text-xs uppercase tracking-wider mb-1">Humidity</Text>
              <Text className="text-white font-semibold">45%</Text>
            </View>
            <View className="w-[1px] bg-blue-400/30" />
            <View className="items-center">
              <Text className="text-blue-200 text-xs uppercase tracking-wider mb-1">Wind</Text>
              <Text className="text-white font-semibold">12 mph</Text>
            </View>
          </View>
        </Card>

        {/* Today's Forecast Strip */}
        <View className="mb-8">
          <Text className="text-blue-950 text-xl font-bold mb-4 tracking-tight">Today's Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
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
                className={`p-4 items-center mr-3 min-w-[76px] ${item.active ? 'bg-blue-600 shadow-md shadow-blue-600/30' : 'bg-white shadow-sm border border-slate-100'}`}
              >
                <Text className={`${item.active ? 'text-blue-50' : 'text-slate-500'} text-sm font-medium mb-3`}>{item.time}</Text>
                <Text className="text-2xl mb-3">{item.icon}</Text>
                <Text className={`${item.active ? 'text-white' : 'text-blue-950'} font-bold text-lg`}>{item.temp}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Saved Locations List */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-blue-950 text-xl font-bold tracking-tight">Saved Locations</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">Edit</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-y-3">
            {[
              { name: 'London, UK', temp: '62°', desc: 'Rain', icon: '🌧️' },
              { name: 'Tokyo, Japan', temp: '81°', desc: 'Clear', icon: '☀️' },
              { name: 'Sydney, AU', temp: '68°', desc: 'Cloudy', icon: '☁️' },
            ].map((loc, i) => (
              <Card key={i} className="p-5 flex-row justify-between items-center bg-white shadow-sm border border-slate-100 mb-1">
                <View>
                  <Text className="text-blue-950 font-bold text-lg mb-1">{loc.name}</Text>
                  <Text className="text-slate-500 text-sm font-medium">{loc.desc}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-3xl mr-4">{loc.icon}</Text>
                  <Text className="text-blue-950 text-3xl font-light">{loc.temp}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
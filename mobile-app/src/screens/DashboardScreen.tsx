import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DashboardStats, MOCK_STATS } from '../api/client';
import { StatCard } from '../components/StatCard';
import { Colors } from '../theme/colors';

interface Props {
  userName: string;
  onLogout: () => void;
}

export function DashboardScreen({ userName, onLogout }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadStats() {
    // Use mock data — swap for api.getStats() when backend is live
    await new Promise((r) => setTimeout(r, 600));
    setStats(MOCK_STATS);
  }

  useEffect(() => { loadStats(); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }

  const healthColor =
    stats?.api_health === 'healthy' ? Colors.success
    : stats?.api_health === 'degraded' ? Colors.warning
    : Colors.error;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {stats && (
          <View style={styles.healthRow}>
            <View style={[styles.healthDot, { backgroundColor: healthColor }]} />
            <Text style={styles.healthText}>API {stats.api_health}</Text>
          </View>
        )}
      </LinearGradient>

      <Text style={styles.sectionTitle}>Overview</Text>

      {!stats ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatCard label="Total Studies" value={stats.total_studies} color={Colors.primary} />
            <StatCard label="Active" value={stats.active_studies} color={Colors.success} />
          </View>
          <View style={styles.statsRow}>
            <StatCard label="Completed" value={stats.completed_studies} color={Colors.accent} />
            <StatCard label="Pending Review" value={stats.pending_reviews} color={Colors.warning} />
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {['New Study', 'Import Data', 'Generate Report', 'Settings'].map((label) => (
          <TouchableOpacity key={label} style={styles.actionBtn} activeOpacity={0.8}>
            <Text style={styles.actionText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  userName: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 2 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 4 },
  logoutText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  healthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  healthDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  healthText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginLeft: 16, marginTop: 20, marginBottom: 4 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 10 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, marginBottom: 24 },
  actionBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    margin: 6,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
});

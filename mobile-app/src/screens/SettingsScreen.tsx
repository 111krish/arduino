import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';

export function SettingsScreen() {
  const [apiUrl, setApiUrl] = useState('https://api.researcher-app.example.com/v1');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function checkHealth() {
    Alert.alert('API Health', 'Demo mode — API endpoint is not live.\n\nConfigure a real endpoint above to connect.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.section}>API Configuration</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Base URL</Text>
        <TextInput
          style={styles.input}
          value={apiUrl}
          onChangeText={setApiUrl}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          keyboardType="url"
        />
        <TouchableOpacity style={styles.smallBtn} onPress={checkHealth}>
          <Text style={styles.smallBtnText}>Test Connection</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.section}>Preferences</Text>
      <View style={styles.card}>
        <Row label="Push Notifications" value={notifications} onChange={setNotifications} />
        <View style={styles.divider} />
        <Row label="Dark Mode" value={darkMode} onChange={setDarkMode} />
      </View>

      <Text style={styles.section}>About</Text>
      <View style={styles.card}>
        <InfoRow label="Version" value="1.0.0" />
        <View style={styles.divider} />
        <InfoRow label="Environment" value="Demo" />
        <View style={styles.divider} />
        <InfoRow label="Build" value="2026.06.16" />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
        onPress={save}
        activeOpacity={0.85}
      >
        <Text style={styles.saveBtnText}>{saved ? '✓ Saved' : 'Save Settings'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
      <Text style={{ fontSize: 15, color: Colors.textPrimary }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: Colors.primary }} thumbColor="#fff" />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
      <Text style={{ fontSize: 15, color: Colors.textSecondary }}>{label}</Text>
      <Text style={{ fontSize: 15, color: Colors.textPrimary, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  section: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1.5, borderColor: Colors.divider, borderRadius: 8, padding: 12, fontSize: 14, color: Colors.textPrimary, backgroundColor: Colors.background, marginBottom: 12 },
  smallBtn: { backgroundColor: Colors.background, borderRadius: 8, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.divider },
  smallBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 8 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnSuccess: { backgroundColor: Colors.success },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

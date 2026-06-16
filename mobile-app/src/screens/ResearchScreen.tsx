import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MOCK_RESEARCH, ResearchItem } from '../api/client';
import { ResearchCard } from '../components/ResearchCard';
import { Colors } from '../theme/colors';

const STATUSES = ['all', 'active', 'pending', 'completed', 'archived'] as const;

export function ResearchScreen() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [filter, setFilter] = useState<typeof STATUSES[number]>('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<ResearchItem | null>(null);

  async function load() {
    await new Promise((r) => setTimeout(r, 400));
    setItems(MOCK_RESEARCH);
  }

  useEffect(() => { load(); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const filtered = items.filter((i) => {
    const matchStatus = filter === 'all' || i.status === filter;
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search research..."
          placeholderTextColor={Colors.textDisabled}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filters}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setFilter(s)}
            style={[styles.chip, filter === s && styles.chipActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, filter === s && styles.chipTextActive]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      {items.length === 0 ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <ResearchCard item={item} onPress={setSelected} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={<Text style={styles.empty}>No results found.</Text>}
        />
      )}

      {/* Detail modal */}
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={styles.modal}>
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalCategory}>{selected.category}</Text>
              <Text style={styles.modalTitle}>{selected.title}</Text>
              <Text style={styles.modalDescription}>{selected.description}</Text>
              <View style={styles.modalMeta}>
                <Text style={styles.modalMetaLabel}>Status</Text>
                <Text style={styles.modalMetaValue}>{selected.status}</Text>
              </View>
              <View style={styles.modalMeta}>
                <Text style={styles.modalMetaLabel}>Progress</Text>
                <Text style={styles.modalMetaValue}>{selected.progress}%</Text>
              </View>
              <View style={styles.modalMeta}>
                <Text style={styles.modalMetaLabel}>Created</Text>
                <Text style={styles.modalMetaValue}>{selected.created_at}</Text>
              </View>
              <View style={styles.modalMeta}>
                <Text style={styles.modalMetaLabel}>Updated</Text>
                <Text style={styles.modalMetaValue}>{selected.updated_at}</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { padding: 12, paddingBottom: 4 },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  filtersScroll: { maxHeight: 48 },
  filters: { paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.divider },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  empty: { textAlign: 'center', color: Colors.textDisabled, marginTop: 40, fontSize: 15 },
  modal: { flex: 1, backgroundColor: Colors.background },
  closeBtn: { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: Colors.primary },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  modalContent: { padding: 20 },
  modalCategory: { fontSize: 12, color: Colors.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12, lineHeight: 28 },
  modalDescription: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 20 },
  modalMeta: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  modalMetaLabel: { fontSize: 14, color: Colors.textSecondary },
  modalMetaValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
});

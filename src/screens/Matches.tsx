import React, { useState, useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { getMatches } from '../store';
import { Colors, Radius, Shadow } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Matches() {
  const navigation = useNavigation<NavProp>();
  const [matches, setMatches] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setMatches(getMatches());
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={s.matchRow}
      onPress={() => navigation.navigate('Chat', { matchId: item.id, name: item.other?.name ?? '' })}
      activeOpacity={0.85}
    >
      <View style={s.avatarWrap}>
        <Image source={{ uri: item.other?.photo_url }} style={s.avatar} />
        <View style={s.onlineDot} />
      </View>
      <View style={s.matchInfo}>
        <View style={s.matchNameRow}>
          <Text style={s.matchName}>{item.other?.name}</Text>
          <Text style={s.matchTime}>{timeAgo(item.created_at)}</Text>
        </View>
        <Text style={s.matchPreview} numberOfLines={1}>
          {item.last_message?.text ?? 'Say hello!'}
        </Text>
      </View>
      <Text style={s.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>Matches</Text>
        {matches.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countText}>{matches.length}</Text>
          </View>
        )}
      </View>

      {matches.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>◇</Text>
          <Text style={s.emptyTitle}>No matches yet</Text>
          <Text style={s.emptySub}>
            Swipe right on profiles you like — matches appear here when they like you back.
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.matchId}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          ItemSeparatorComponent={() => <View style={s.sep} />}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.gray[900] },
  countBadge: {
    backgroundColor: Colors.brand[500],
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  list: { paddingVertical: 8 },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: {
    position: 'absolute',
    bottom: 1, right: 1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.green[500],
    borderWidth: 2, borderColor: Colors.white,
  },
  matchInfo: { flex: 1 },
  matchNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  matchName: { fontSize: 16, fontWeight: '700', color: Colors.gray[900] },
  matchTime: { fontSize: 12, color: Colors.gray[400] },
  matchPreview: { fontSize: 14, color: Colors.gray[500] },
  chevron: { fontSize: 22, color: Colors.gray[300], fontWeight: '300' },
  sep: { height: 1, backgroundColor: Colors.gray[100], marginLeft: 86 },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 40, paddingBottom: 100,
  },
  emptyIcon: { fontSize: 60, color: Colors.gray[200], marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: Colors.gray[600], marginBottom: 10 },
  emptySub: {
    fontSize: 15, color: Colors.gray[400], textAlign: 'center', lineHeight: 22,
  },
});

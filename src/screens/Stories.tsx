import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, TextInput, Modal,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { getStories, postStory } from '../store';
import { Colors, Radius, Shadow } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'public' | 'private';
const FREE_LIMIT = 10;

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function isPaid(user: any) {
  return user?.plan !== 'free' && !!user?.plan_tier;
}

export default function Stories() {
  const { user } = useAuth();
  const navigation = useNavigation<NavProp>();
  const [tab, setTab] = useState<Tab>('public');
  const [stories, setStories] = useState<any[]>([]);
  const [showPost, setShowPost] = useState(false);
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [posting, setPosting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setStories(getStories(tab));
    }, [tab])
  );

  const paid = isPaid(user);
  const visibleStories = tab === 'public' && !paid
    ? stories.slice(0, FREE_LIMIT)
    : stories;
  const showPaywall = tab === 'public' && !paid && stories.length > FREE_LIMIT;
  const showPrivatePaywall = tab === 'private' && !paid;

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert('Empty', 'Please write something to post.');
      return;
    }
    if (isPrivate && !paid) {
      Alert.alert('Veza+', 'Private stories are a Veza+ feature.');
      return;
    }
    setPosting(true);
    setTimeout(() => {
      postStory(content.trim(), !isPrivate);
      setContent('');
      setIsPrivate(false);
      setShowPost(false);
      setPosting(false);
      setStories(getStories(tab));
    }, 300);
  };

  const renderStory = ({ item }: { item: any }) => (
    <View style={s.storyCard}>
      <View style={s.storyHeader}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{item.author?.[0] ?? '?'}</Text>
        </View>
        <View style={s.storyMeta}>
          <Text style={s.storyAuthor}>{item.author ?? 'Anonymous'}</Text>
          <Text style={s.storyTime}>{timeAgo(item.createdAt)}</Text>
        </View>
        {!item.isPublic && (
          <View style={s.privateBadge}>
            <Text style={s.privateBadgeText}>Private</Text>
          </View>
        )}
      </View>
      <Text style={s.storyContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Stories</Text>
        <TouchableOpacity
          style={s.postBtn}
          onPress={() => setShowPost(true)}
          activeOpacity={0.85}
        >
          <Text style={s.postBtnText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {(['public', 'private'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.tab, tab === t && s.tabActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'private' && !paid ? ' 🔒' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showPrivatePaywall ? (
        <View style={s.paywallContainer}>
          <View style={s.paywallCard}>
            <Text style={s.paywallIcon}>🔒</Text>
            <Text style={s.paywallTitle}>Private Stories</Text>
            <Text style={s.paywallSub}>
              Share and read intimate stories only with your matches.
              Upgrade to Veza+ to unlock.
            </Text>
            <TouchableOpacity
              style={s.paywallBtn}
              onPress={() => navigation.navigate('Pricing')}
              activeOpacity={0.85}
            >
              <Text style={s.paywallBtnText}>Upgrade to Veza+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={visibleStories}
          keyExtractor={(item) => item.id}
          renderItem={renderStory}
          contentContainerStyle={s.list}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyTitle}>No stories yet</Text>
              <Text style={s.emptySub}>Be the first to share!</Text>
            </View>
          }
          ListFooterComponent={
            showPaywall ? (
              <TouchableOpacity
                style={s.paywallBanner}
                onPress={() => navigation.navigate('Pricing')}
                activeOpacity={0.9}
              >
                <Text style={s.paywallBannerTitle}>Read all stories</Text>
                <Text style={s.paywallBannerSub}>
                  You've seen {FREE_LIMIT} free stories. Upgrade for unlimited access →
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      {/* Post modal */}
      <Modal visible={showPost} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={s.modal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => { setShowPost(false); setContent(''); }}>
              <Text style={s.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>New Story</Text>
            <TouchableOpacity onPress={handlePost} disabled={posting}>
              <Text style={[s.modalPost, posting && { opacity: 0.5 }]}>
                {posting ? '…' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={s.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="Share something…"
            placeholderTextColor={Colors.gray[400]}
            multiline
            maxLength={500}
            autoFocus
          />
          <Text style={s.charCount}>{content.length}/500</Text>

          {/* Private toggle */}
          <View style={s.toggleRow}>
            <View>
              <Text style={s.toggleLabel}>Private story</Text>
              <Text style={s.toggleSub}>Only your matches can read this</Text>
            </View>
            <TouchableOpacity
              style={[s.toggle, isPrivate && s.toggleOn]}
              onPress={() => {
                if (!paid && !isPrivate) {
                  Alert.alert('Veza+', 'Private stories require a Veza+ subscription.');
                  return;
                }
                setIsPrivate(!isPrivate);
              }}
              activeOpacity={0.8}
            >
              <View style={[s.toggleThumb, isPrivate && s.toggleThumbOn]} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gray[50] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.gray[900] },
  postBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  postBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, gap: 8 },
  tab: {
    flex: 1, alignItems: 'center', paddingVertical: 9,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5, borderColor: Colors.gray[200],
  },
  tabActive: { backgroundColor: Colors.brand[500], borderColor: Colors.brand[500] },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.gray[600] },
  tabTextActive: { color: Colors.white },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  storyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 16,
    ...Shadow.sm,
    marginBottom: 12,
  },
  storyHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.brand[100],
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.brand[600], fontWeight: '700', fontSize: 16 },
  storyMeta: { flex: 1 },
  storyAuthor: { fontSize: 14, fontWeight: '700', color: Colors.gray[900] },
  storyTime: { fontSize: 12, color: Colors.gray[400] },
  privateBadge: {
    backgroundColor: Colors.gray[100],
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  privateBadgeText: { fontSize: 11, color: Colors.gray[600], fontWeight: '600' },
  storyContent: { fontSize: 15, color: Colors.gray[800], lineHeight: 22 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.gray[600] },
  emptySub: { fontSize: 15, color: Colors.gray[400], marginTop: 8 },

  paywallBanner: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.lg,
    padding: 16,
    marginTop: 4,
    ...Shadow.xl,
  },
  paywallBannerTitle: { color: Colors.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  paywallBannerSub: { color: Colors.brand[100], fontSize: 13 },

  paywallContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  paywallCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: 32,
    alignItems: 'center',
    ...Shadow.lg,
  },
  paywallIcon: { fontSize: 48, marginBottom: 16 },
  paywallTitle: { fontSize: 22, fontWeight: '800', color: Colors.gray[900], marginBottom: 10 },
  paywallSub: {
    fontSize: 15, color: Colors.gray[500], textAlign: 'center', lineHeight: 22, marginBottom: 24,
  },
  paywallBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  paywallBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },

  modal: { flex: 1, backgroundColor: Colors.white },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  modalCancel: { fontSize: 16, color: Colors.gray[600] },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.gray[900] },
  modalPost: { fontSize: 16, color: Colors.brand[500], fontWeight: '700' },
  textArea: {
    flex: 1,
    padding: 20,
    fontSize: 17,
    color: Colors.gray[900],
    textAlignVertical: 'top',
  },
  charCount: { paddingHorizontal: 20, paddingBottom: 8, color: Colors.gray[400], fontSize: 13 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: Colors.gray[800] },
  toggleSub: { fontSize: 13, color: Colors.gray[400], marginTop: 2 },
  toggle: {
    width: 50, height: 28, borderRadius: 14,
    backgroundColor: Colors.gray[200],
    padding: 2, justifyContent: 'center',
  },
  toggleOn: { backgroundColor: Colors.brand[500] },
  toggleThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.white },
  toggleThumbOn: { alignSelf: 'flex-end' },
});

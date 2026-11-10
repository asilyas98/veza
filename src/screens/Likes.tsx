import React, { useState, useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, Dimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { getLikes, swipe } from '../store'; // getLikes = getWhoLikedMe wrapper
import { Colors, Radius, Shadow } from '../theme';

const { width: SW } = Dimensions.get('window');
const COLS = 2;
const CARD_W = (SW - 48) / COLS;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

function isPaid(user: any) {
  return user?.plan !== 'free' && !!user?.plan_tier;
}

export default function Likes() {
  const { user } = useAuth();
  const navigation = useNavigation<NavProp>();
  const [likes, setLikes] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setLikes(getLikes());
    }, [])
  );

  const handleLikeBack = (profileId: string) => {
    const result = swipe(profileId, 'like');
    const profile = likes.find((l) => l.id === profileId);
    setLikes((prev) => prev.filter((l) => l.id !== profileId));
    if (result?.matched && result.matchId) {
      navigation.navigate('Chat', { matchId: result.matchId, name: profile?.name ?? 'Match' });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const paid = isPaid(user);
    return (
      <View style={s.card}>
        <View style={s.imgWrap}>
          {!paid ? (
            <View style={[s.blurOverlay, { width: CARD_W, height: CARD_W }]}>
              <Text style={s.blurIcon}>?</Text>
            </View>
          ) : (
            <Image source={{ uri: item.photo_url }} style={[s.cardImg, { width: CARD_W, height: CARD_W }]} />
          )}
        </View>
        <View style={s.cardInfo}>
          {paid ? (
            <>
              <Text style={s.cardName} numberOfLines={1}>{item.name}, {item.age}</Text>
              <TouchableOpacity
                style={s.likeBackBtn}
                onPress={() => handleLikeBack(item.id)}
                activeOpacity={0.8}
              >
                <Text style={s.likeBackBtnText}>Like back</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={s.unlockBtn}
              onPress={() => navigation.navigate('Pricing')}
              activeOpacity={0.8}
            >
              <Text style={s.unlockBtnText}>Unlock</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>Likes</Text>
        {likes.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countText}>{likes.length}</Text>
          </View>
        )}
      </View>

      {!isPaid(user) && (
        <TouchableOpacity style={s.paywallBanner} onPress={() => navigation.navigate('Pricing')} activeOpacity={0.9}>
          <Text style={s.paywallTitle}>See who likes you</Text>
          <Text style={s.paywallSub}>Upgrade to Veza+ to reveal profiles →</Text>
        </TouchableOpacity>
      )}

      {likes.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>♥</Text>
          <Text style={s.emptyTitle}>No likes yet</Text>
          <Text style={s.emptySub}>Keep swiping to get more likes!</Text>
        </View>
      ) : (
        <FlatList
          data={likes}
          keyExtractor={(item) => item.id}
          numColumns={COLS}
          contentContainerStyle={s.list}
          columnWrapperStyle={s.row}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gray[50] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.gray[900] },
  countBadge: {
    backgroundColor: Colors.brand[500],
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  paywallBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.lg,
    padding: 16,
    ...Shadow.xl,
  },
  paywallTitle: { color: Colors.white, fontSize: 17, fontWeight: '700', marginBottom: 4 },
  paywallSub: { color: Colors.brand[100], fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { gap: 16, marginBottom: 16 },
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    ...Shadow.md,
  },
  imgWrap: {},
  cardImg: { resizeMode: 'cover' },
  blurOverlay: {
    backgroundColor: Colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurIcon: { fontSize: 40, color: Colors.gray[400], fontWeight: '700' },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 14, fontWeight: '700', color: Colors.gray[900], marginBottom: 8 },
  likeBackBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingVertical: 7,
    alignItems: 'center',
  },
  likeBackBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  unlockBtn: {
    backgroundColor: Colors.gray[100],
    borderRadius: Radius.full,
    paddingVertical: 7,
    alignItems: 'center',
  },
  unlockBtnText: { color: Colors.gray[600], fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyIcon: { fontSize: 60, color: Colors.gray[300], marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: Colors.gray[700] },
  emptySub: { fontSize: 15, color: Colors.gray[400], marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});

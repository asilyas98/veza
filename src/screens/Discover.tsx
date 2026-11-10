import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  Animated, PanResponder, Dimensions, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { getDiscover, swipe, undoLastSwipe, getDailyLikesLeft } from '../store';
import { Colors, Radius, Shadow } from '../theme';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = SW - 32;
const CARD_H = SH * 0.62;
const SWIPE_THRESHOLD = 90;
const ROTATE_AMOUNT = 15;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

function isPaid(user: any) {
  return user?.plan !== 'free' && !!user?.plan_tier;
}

export default function Discover() {
  const { user } = useAuth();
  const navigation = useNavigation<NavProp>();
  const [profiles, setProfiles] = useState(() => getDiscover());
  const [likesLeft, setLikesLeft] = useState(() => getDailyLikesLeft());
  const [lastMatch, setLastMatch] = useState<{ name: string; matchId: string } | null>(null);

  const position = useRef(new Animated.ValueXY()).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;
  const superOpacity = useRef(new Animated.Value(0)).current;

  const rotate = position.x.interpolate({
    inputRange: [-SW / 2, 0, SW / 2],
    outputRange: [`-${ROTATE_AMOUNT}deg`, '0deg', `${ROTATE_AMOUNT}deg`],
    extrapolate: 'clamp',
  });

  const resetPosition = () => {
    Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    Animated.timing(likeOpacity, { toValue: 0, duration: 100, useNativeDriver: true }).start();
    Animated.timing(nopeOpacity, { toValue: 0, duration: 100, useNativeDriver: true }).start();
    Animated.timing(superOpacity, { toValue: 0, duration: 100, useNativeDriver: true }).start();
  };

  const handleSwipeResult = useCallback((direction: 'like' | 'nope' | 'superlike') => {
    if (!profiles.length) return;
    const topProfile = profiles[0];
    const result = swipe(topProfile.id, direction === 'nope' ? 'pass' : direction === 'superlike' ? 'superlike' : 'like');
    setLikesLeft(getDailyLikesLeft());
    setProfiles((prev) => prev.slice(1));
    if (result?.matched && result.matchId) {
      setLastMatch({ name: topProfile.name, matchId: result.matchId });
    }
  }, [profiles]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy });
        // Update overlay opacity
        const likeVal = g.dx > 0 ? Math.min(g.dx / SWIPE_THRESHOLD, 1) : 0;
        const nopeVal = g.dx < 0 ? Math.min(-g.dx / SWIPE_THRESHOLD, 1) : 0;
        const superVal = g.dy < -60 ? Math.min(-g.dy / 120, 1) : 0;
        likeOpacity.setValue(likeVal);
        nopeOpacity.setValue(nopeVal);
        superOpacity.setValue(superVal);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: SW + 100, y: g.dy },
            duration: 250,
            useNativeDriver: true,
          }).start(() => { position.setValue({ x: 0, y: 0 }); handleSwipeResult('like'); });
        } else if (g.dx < -SWIPE_THRESHOLD) {
          Animated.timing(position, {
            toValue: { x: -SW - 100, y: g.dy },
            duration: 250,
            useNativeDriver: true,
          }).start(() => { position.setValue({ x: 0, y: 0 }); handleSwipeResult('nope'); });
        } else if (g.dy < -120) {
          Animated.timing(position, {
            toValue: { x: g.dx, y: -SH },
            duration: 250,
            useNativeDriver: true,
          }).start(() => { position.setValue({ x: 0, y: 0 }); handleSwipeResult('superlike'); });
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const doLike = () => {
    Animated.timing(position, {
      toValue: { x: SW + 100, y: 0 }, duration: 250, useNativeDriver: true,
    }).start(() => { position.setValue({ x: 0, y: 0 }); handleSwipeResult('like'); });
  };
  const doNope = () => {
    Animated.timing(position, {
      toValue: { x: -SW - 100, y: 0 }, duration: 250, useNativeDriver: true,
    }).start(() => { position.setValue({ x: 0, y: 0 }); handleSwipeResult('nope'); });
  };
  const doSuperlike = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: -SH }, duration: 250, useNativeDriver: true,
    }).start(() => { position.setValue({ x: 0, y: 0 }); handleSwipeResult('superlike'); });
  };
  const doGoBack = () => {
    if (!isPaid(user)) { navigation.navigate('Pricing'); return; }
    const restored = undoLastSwipe();
    if (restored) setProfiles((prev) => [restored, ...prev]);
  };

  if (lastMatch) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.matchBanner}>
          <Text style={s.matchIcon}>★</Text>
          <Text style={s.matchTitle}>It's a Match!</Text>
          <Text style={s.matchSub}>You and {lastMatch.name} liked each other.</Text>
          <TouchableOpacity
            style={s.matchBtn}
            onPress={() => {
              setLastMatch(null);
              navigation.navigate('Chat', { matchId: lastMatch.matchId, name: lastMatch.name });
            }}
          >
            <Text style={s.matchBtnText}>Send a message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.matchSkip} onPress={() => setLastMatch(null)}>
            <Text style={s.matchSkipText}>Keep swiping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Discover</Text>
        <View style={s.likesTag}>
          <Text style={s.likesText}>{likesLeft} likes left</Text>
        </View>
      </View>

      {/* Cards stack */}
      <View style={s.cardStack}>
        {profiles.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>○</Text>
            <Text style={s.emptyTitle}>All caught up</Text>
            <Text style={s.emptySub}>Check back later for new profiles.</Text>
          </View>
        ) : (
          profiles.slice(0, 3).map((profile, index) => {
            if (index === 0) {
              return (
                <Animated.View
                  key={profile.id}
                  style={[
                    s.card,
                    { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] },
                    s.topCard,
                  ]}
                  {...panResponder.panHandlers}
                >
                  {/* Overlays */}
                  <Animated.View style={[s.overlay, s.overlayLike, { opacity: likeOpacity }]}>
                    <Text style={s.overlayText}>LIKE</Text>
                  </Animated.View>
                  <Animated.View style={[s.overlay, s.overlayNope, { opacity: nopeOpacity }]}>
                    <Text style={s.overlayText}>NOPE</Text>
                  </Animated.View>
                  <Animated.View style={[s.overlay, s.overlaySuper, { opacity: superOpacity }]}>
                    <Text style={s.overlayText}>SUPER</Text>
                  </Animated.View>

                  <Image source={{ uri: profile.photo_url }} style={s.cardImage} />
                  <View style={s.cardInfo}>
                    <View style={s.cardNameRow}>
                      <Text style={s.cardName}>{profile.name}, {profile.age}</Text>
                      {profile.verified && <Text style={s.verifiedBadge}> ✓</Text>}
                    </View>
                    <Text style={s.cardBio} numberOfLines={2}>{profile.bio}</Text>
                    {profile.country && <Text style={s.cardCountry}>{profile.country}</Text>}
                  </View>
                </Animated.View>
              );
            }
            const scale = 1 - index * 0.04;
            const translateY = index * -8;
            return (
              <View
                key={profile.id}
                style={[
                  s.card,
                  { transform: [{ scale }, { translateY }], zIndex: -index },
                ]}
              >
                <Image source={{ uri: profile.photo_url }} style={s.cardImage} />
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>{profile.name}, {profile.age}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Action buttons */}
      {profiles.length > 0 && (
        <View style={s.actions}>
          <TouchableOpacity style={[s.actionBtn, s.actionSmall]} onPress={doGoBack} activeOpacity={0.8}>
            <Text style={s.actionSmallIcon}>↩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, s.actionNope]} onPress={doNope} activeOpacity={0.8}>
            <Text style={s.actionIcon}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, s.actionSuper]} onPress={doSuperlike} activeOpacity={0.8}>
            <Text style={s.actionIcon}>★</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, s.actionLike]} onPress={doLike} activeOpacity={0.8}>
            <Text style={s.actionIcon}>♥</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionBtn, s.actionSmall]}
            onPress={() => navigation.navigate('Pricing')}
            activeOpacity={0.8}
          >
            <Text style={s.actionSmallIcon}>⚡</Text>
          </TouchableOpacity>
        </View>
      )}
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
  likesTag: {
    backgroundColor: Colors.brand[50],
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  likesText: { color: Colors.brand[600], fontSize: 13, fontWeight: '600' },

  cardStack: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    ...Shadow.lg,
  },
  topCard: { zIndex: 10 },
  cardImage: { width: '100%', height: '75%', resizeMode: 'cover' },
  cardInfo: { padding: 16, flex: 1 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center' },
  cardName: { fontSize: 22, fontWeight: '800', color: Colors.gray[900] },
  verifiedBadge: { fontSize: 16, color: Colors.brand[500] },
  cardBio: { fontSize: 14, color: Colors.gray[600], marginTop: 4, lineHeight: 20 },
  cardCountry: { fontSize: 13, color: Colors.gray[400], marginTop: 4 },

  overlay: {
    position: 'absolute',
    top: 40,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
  },
  overlayLike: { left: 20, borderColor: Colors.green[500], transform: [{ rotate: '-20deg' }] },
  overlayNope: { right: 20, borderColor: Colors.red[500], transform: [{ rotate: '20deg' }] },
  overlaySuper: {
    alignSelf: 'center',
    left: undefined,
    right: undefined,
    top: 20,
    borderColor: Colors.blue[500],
  },
  overlayText: { fontSize: 24, fontWeight: '900', color: Colors.white },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 60, color: Colors.gray[300], marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: Colors.gray[700] },
  emptySub: { fontSize: 15, color: Colors.gray[400], marginTop: 8 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    ...Shadow.md,
  },
  actionSmall: { width: 44, height: 44, backgroundColor: Colors.white },
  actionNope: { width: 60, height: 60, backgroundColor: Colors.white },
  actionSuper: { width: 52, height: 52, backgroundColor: Colors.white },
  actionLike: { width: 60, height: 60, backgroundColor: Colors.white },
  actionSmallIcon: { fontSize: 20, color: Colors.amber[500] },
  actionIcon: { fontSize: 26, color: Colors.brand[500] },

  matchBanner: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
    backgroundColor: Colors.brand[500],
  },
  matchIcon: { fontSize: 72, color: Colors.white, marginBottom: 16 },
  matchTitle: { fontSize: 36, fontWeight: '900', color: Colors.white, marginBottom: 8 },
  matchSub: { fontSize: 17, color: Colors.brand[100], textAlign: 'center', marginBottom: 40 },
  matchBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: 36,
    paddingVertical: 16,
    marginBottom: 16,
  },
  matchBtnText: { color: Colors.brand[600], fontSize: 17, fontWeight: '700' },
  matchSkip: { paddingVertical: 10 },
  matchSkipText: { color: Colors.brand[200], fontSize: 15, fontWeight: '500' },
});

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Colors, Radius, Shadow } from '../theme';

const PLANS = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: '$9.99',
    period: '/mo',
    color: Colors.amber[500],
    perks: ['Unlimited likes', 'See who liked you', 'Go back on swipes', '5 super likes/day'],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '$19.99',
    period: '/mo',
    color: Colors.gray[500],
    popular: true,
    perks: [
      'Everything in Bronze',
      'No ads',
      'Private stories',
      '15 super likes/day',
      'Priority in Discover',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '$34.99',
    period: '/mo',
    color: Colors.amber[400],
    perks: [
      'Everything in Silver',
      'Unlimited super likes',
      'Read receipts',
      'Profile boost 1x/week',
      'Dedicated support',
    ],
  },
];

export default function Pricing() {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [selected, setSelected] = useState('silver');

  const handleSubscribe = () => {
    const plan = PLANS.find((p) => p.id === selected);
    if (!plan) return;
    // In production this would go through RevenueCat / StoreKit
    updateUser({ plan_tier: plan.id, plan: plan.id });
    Alert.alert(
      'Subscribed!',
      `You're now on the ${plan.name} plan. Enjoy your new features!`,
      [{ text: 'Great!', onPress: () => navigation.goBack() }]
    );
  };

  const currentPlan = user?.plan_tier;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Upgrade to Veza+</Text>
        <Text style={s.sub}>Unlock the full Veza experience</Text>

        <View style={s.plans}>
          {PLANS.map((plan) => {
            const active = selected === plan.id;
            const isCurrent = currentPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[s.planCard, active && s.planCardActive]}
                onPress={() => setSelected(plan.id)}
                activeOpacity={0.85}
              >
                {plan.popular && (
                  <View style={s.popularBadge}>
                    <Text style={s.popularText}>Most popular</Text>
                  </View>
                )}
                {isCurrent && (
                  <View style={[s.popularBadge, { backgroundColor: Colors.green[500] }]}>
                    <Text style={s.popularText}>Current plan</Text>
                  </View>
                )}

                <View style={s.planHeader}>
                  <View style={[s.planDot, { backgroundColor: plan.color }]} />
                  <Text style={s.planName}>{plan.name}</Text>
                  <View style={s.spacer} />
                  <Text style={s.planPrice}>{plan.price}</Text>
                  <Text style={s.planPeriod}>{plan.period}</Text>
                </View>

                <View style={s.perks}>
                  {plan.perks.map((perk) => (
                    <View key={perk} style={s.perkRow}>
                      <Text style={[s.perkCheck, { color: plan.color }]}>✓</Text>
                      <Text style={s.perkText}>{perk}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={s.subscribeBtn} onPress={handleSubscribe} activeOpacity={0.85}>
          <Text style={s.subscribeBtnText}>
            {currentPlan === selected
              ? 'Current plan'
              : `Subscribe to ${PLANS.find((p) => p.id === selected)?.name}`}
          </Text>
        </TouchableOpacity>

        <Text style={s.disclaimer}>
          Subscriptions auto-renew unless cancelled. Cancel anytime in your App Store settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4, alignItems: 'flex-end' },
  close: { fontSize: 20, color: Colors.gray[500], padding: 4 },
  scroll: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 30, fontWeight: '900', color: Colors.gray[900], textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 16, color: Colors.gray[500], textAlign: 'center', marginBottom: 28 },
  plans: { gap: 14, marginBottom: 24 },
  planCard: {
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.gray[200],
    padding: 18,
    backgroundColor: Colors.white,
    ...Shadow.sm,
    overflow: 'hidden',
  },
  planCardActive: { borderColor: Colors.brand[500], ...Shadow.xl },
  popularBadge: {
    position: 'absolute',
    top: 0, right: 0,
    backgroundColor: Colors.brand[500],
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomLeftRadius: Radius.md,
  },
  popularText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  planDot: { width: 12, height: 12, borderRadius: 6 },
  planName: { fontSize: 18, fontWeight: '800', color: Colors.gray[900] },
  spacer: { flex: 1 },
  planPrice: { fontSize: 22, fontWeight: '900', color: Colors.gray[900] },
  planPeriod: { fontSize: 14, color: Colors.gray[500], alignSelf: 'flex-end', marginBottom: 2 },
  perks: { gap: 7 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  perkCheck: { fontSize: 14, fontWeight: '700' },
  perkText: { fontSize: 14, color: Colors.gray[700] },
  subscribeBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    ...Shadow.xl,
  },
  subscribeBtnText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.gray[400],
    lineHeight: 18,
  },
});

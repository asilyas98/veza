import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { Colors, Radius, Shadow } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const GOALS = ['Marriage', 'Long-term relationship', 'Dating', 'Not sure yet'];
const MODES = ['relationship', 'friendship'] as const;
const PROMPTS = [
  { key: 'prompt_food', label: 'My go-to dish is…' },
  { key: 'prompt_hobbies', label: 'On weekends you can find me…' },
  { key: 'prompt_unique', label: 'The most unique thing about me…' },
];

function planLabel(user: any) {
  if (!user?.plan_tier) return 'Free';
  return user.plan_tier.charAt(0).toUpperCase() + user.plan_tier.slice(1);
}

function isPaid(user: any) {
  return user?.plan !== 'free' && !!user?.plan_tier;
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigation = useNavigation<NavProp>();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
    mode: user?.mode ?? 'relationship',
    goal: user?.goal ?? '',
    prompt_food: user?.prompt_food ?? '',
    prompt_hobbies: user?.prompt_hobbies ?? '',
    prompt_unique: user?.prompt_unique ?? '',
  });

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  };

  const paid = isPaid(user);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Profile</Text>
          <TouchableOpacity
            style={s.editBtn}
            onPress={() => (editing ? handleSave() : setEditing(true))}
            activeOpacity={0.85}
          >
            <Text style={s.editBtnText}>{editing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user?.name?.[0] ?? '?'}</Text>
          </View>
          {!editing ? (
            <>
              <Text style={s.nameText}>{user?.name}</Text>
              <Text style={s.ageText}>{user?.age} years old</Text>
              <View style={[s.planBadge, paid && s.planBadgePaid]}>
                <Text style={[s.planBadgeText, paid && s.planBadgeTextPaid]}>
                  {planLabel(user)}
                </Text>
              </View>
            </>
          ) : (
            <View style={s.nameEditWrap}>
              <TextInput
                style={s.nameInput}
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Your name"
                placeholderTextColor={Colors.gray[400]}
              />
            </View>
          )}
        </View>

        {/* Verification banner */}
        {!user?.verified && (
          <TouchableOpacity
            style={s.verifyBanner}
            onPress={() => navigation.navigate('IDVerify')}
            activeOpacity={0.9}
          >
            <Text style={s.verifyTitle}>Verify your identity</Text>
            <Text style={s.verifySub}>Get a verified badge to stand out →</Text>
          </TouchableOpacity>
        )}

        {/* Bio */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>About me</Text>
          {editing ? (
            <TextInput
              style={s.textArea}
              value={form.bio}
              onChangeText={(v) => setForm((f) => ({ ...f, bio: v }))}
              placeholder="Tell people about yourself…"
              placeholderTextColor={Colors.gray[400]}
              multiline
              maxLength={300}
            />
          ) : (
            <Text style={s.bioText}>{user?.bio || 'No bio yet. Tap Edit to add one.'}</Text>
          )}
        </View>

        {/* Mode */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Looking for</Text>
          {editing ? (
            <View style={s.chips}>
              {MODES.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[s.chip, form.mode === m && s.chipActive]}
                  onPress={() => setForm((f) => ({ ...f, mode: m }))}
                  activeOpacity={0.8}
                >
                  <Text style={[s.chipText, form.mode === m && s.chipTextActive]}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={s.valueText}>
              {(user?.mode ?? 'relationship').charAt(0).toUpperCase() + (user?.mode ?? 'relationship').slice(1)}
            </Text>
          )}
        </View>

        {/* Goal (relationship mode only) */}
        {(editing ? form.mode === 'relationship' : user?.mode !== 'friendship') && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Relationship goal</Text>
            {editing ? (
              <View style={s.chips}>
                {GOALS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[s.chip, form.goal === g && s.chipActive]}
                    onPress={() => setForm((f) => ({ ...f, goal: g }))}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.chipText, form.goal === g && s.chipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={s.valueText}>{user?.goal || '—'}</Text>
            )}
          </View>
        )}

        {/* Prompts */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Prompts</Text>
          {PROMPTS.map((p) => (
            <View key={p.key} style={s.promptCard}>
              <Text style={s.promptLabel}>{p.label}</Text>
              {editing ? (
                <TextInput
                  style={s.promptInput}
                  value={(form as any)[p.key]}
                  onChangeText={(v) => setForm((f) => ({ ...f, [p.key]: v }))}
                  placeholder="Your answer…"
                  placeholderTextColor={Colors.gray[400]}
                  multiline
                  maxLength={200}
                />
              ) : (
                <Text style={s.promptAnswer}>
                  {(user as any)?.[p.key] || 'Not answered yet'}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Subscription */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Subscription</Text>
          <View style={s.subCard}>
            <View>
              <Text style={s.subPlan}>{planLabel(user)}</Text>
              <Text style={s.subPerks}>
                {paid
                  ? 'Super likes · Go back · No ads · Private stories'
                  : 'Free plan — upgrade for more features'}
              </Text>
            </View>
            {!paid && (
              <TouchableOpacity
                style={s.upgradeBtn}
                onPress={() => navigation.navigate('Pricing')}
                activeOpacity={0.85}
              >
                <Text style={s.upgradeBtnText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={s.logoutBtnText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.gray[50] },
  scroll: { padding: 20, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.gray[900] },
  editBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  editBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

  avatarSection: { alignItems: 'center', marginBottom: 24, gap: 6 },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.brand[100],
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4, ...Shadow.md,
  },
  avatarText: { fontSize: 36, color: Colors.brand[500], fontWeight: '800' },
  nameText: { fontSize: 22, fontWeight: '800', color: Colors.gray[900] },
  ageText: { fontSize: 15, color: Colors.gray[500] },
  planBadge: {
    paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.gray[100],
    marginTop: 4,
  },
  planBadgePaid: { backgroundColor: Colors.amber[400] },
  planBadgeText: { color: Colors.gray[600], fontWeight: '600', fontSize: 13 },
  planBadgeTextPaid: { color: Colors.white },
  nameEditWrap: { width: '100%', marginTop: 8 },
  nameInput: {
    borderWidth: 1.5, borderColor: Colors.gray[200],
    borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 16, color: Colors.gray[900], textAlign: 'center',
    backgroundColor: Colors.white,
  },

  verifyBanner: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 16,
    ...Shadow.xl,
  },
  verifyTitle: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  verifySub: { color: Colors.brand[200], fontSize: 13, marginTop: 2 },

  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: Colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  bioText: { fontSize: 15, color: Colors.gray[700], lineHeight: 22 },
  textArea: {
    borderWidth: 1.5, borderColor: Colors.gray[200],
    borderRadius: Radius.md, padding: 14,
    fontSize: 15, color: Colors.gray[900],
    backgroundColor: Colors.white, minHeight: 80,
    textAlignVertical: 'top',
  },
  valueText: { fontSize: 15, color: Colors.gray[800] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.gray[200],
    backgroundColor: Colors.white,
  },
  chipActive: { borderColor: Colors.brand[500], backgroundColor: Colors.brand[50] },
  chipText: { fontSize: 14, fontWeight: '500', color: Colors.gray[600] },
  chipTextActive: { color: Colors.brand[600], fontWeight: '600' },

  promptCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 10,
    ...Shadow.sm,
  },
  promptLabel: { fontSize: 13, fontWeight: '700', color: Colors.brand[500], marginBottom: 6 },
  promptAnswer: { fontSize: 15, color: Colors.gray[700], lineHeight: 21 },
  promptInput: {
    fontSize: 15, color: Colors.gray[900],
    borderTopWidth: 1, borderTopColor: Colors.gray[100],
    paddingTop: 8, textAlignVertical: 'top', minHeight: 50,
  },

  subCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.sm,
  },
  subPlan: { fontSize: 16, fontWeight: '700', color: Colors.gray[900], marginBottom: 4 },
  subPerks: { fontSize: 13, color: Colors.gray[500], maxWidth: 200 },
  upgradeBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upgradeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },

  logoutBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.red[400],
    alignItems: 'center',
  },
  logoutBtnText: { color: Colors.red[500], fontWeight: '700', fontSize: 15 },
});

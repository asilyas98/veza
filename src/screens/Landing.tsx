import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation';
import { Colors, Radius, Shadow } from '../theme';

const { width } = Dimensions.get('window');

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Landing'> };

const FEATURES = [
  { label: 'Verified profiles', icon: '✓' },
  { label: 'AI-powered matching', icon: '✓' },
  { label: 'Private & secure', icon: '✓' },
];

export default function Landing({ navigation }: Props) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Hero */}
      <View style={s.hero}>
        <View style={s.logoRow}>
          <View style={s.logoCircle}>
            <Text style={s.logoText}>V</Text>
          </View>
          <Text style={s.logoName}>Veza</Text>
        </View>
        <Text style={s.tagline}>Find your person.</Text>
        <Text style={s.sub}>
          Authentic connections for the African diaspora and beyond.
        </Text>
      </View>

      {/* Features */}
      <View style={s.features}>
        {FEATURES.map((f) => (
          <View key={f.label} style={s.featureRow}>
            <View style={s.checkCircle}>
              <Text style={s.checkText}>{f.icon}</Text>
            </View>
            <Text style={s.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={s.cta}>
        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={s.primaryBtnText}>Create account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={s.secondaryBtnText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={s.terms}>
          By continuing, you agree to our{' '}
          <Text style={s.link}>Terms</Text> and{' '}
          <Text style={s.link}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 10 },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.xl,
  },
  logoText: { color: Colors.white, fontSize: 28, fontWeight: '800' },
  logoName: { fontSize: 36, fontWeight: '800', color: Colors.gray[900] },
  tagline: { fontSize: 32, fontWeight: '800', color: Colors.gray[900], textAlign: 'center' },
  sub: {
    fontSize: 16,
    color: Colors.gray[500],
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  features: { paddingHorizontal: 40, gap: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: Colors.brand[500], fontSize: 14, fontWeight: '700' },
  featureLabel: { fontSize: 15, color: Colors.gray[700], fontWeight: '500' },
  cta: { padding: 24, gap: 12 },
  primaryBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.xl,
  },
  primaryBtnText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: Colors.gray[200],
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  secondaryBtnText: { color: Colors.gray[700], fontSize: 17, fontWeight: '600' },
  terms: { textAlign: 'center', color: Colors.gray[400], fontSize: 12, lineHeight: 18 },
  link: { color: Colors.brand[500], fontWeight: '500' },
});

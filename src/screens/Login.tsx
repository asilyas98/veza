import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { Colors, Radius } from '../theme';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

export default function Login({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = login(email.trim().toLowerCase(), password);
      setLoading(false);
      if (!user) {
        Alert.alert('Invalid credentials', 'Email or password is incorrect.');
      }
      // On success navigation happens automatically via AuthContext → navigator
    }, 300);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={s.title}>Welcome back</Text>
          <Text style={s.sub}>Sign in to your Veza account</Text>

          <View style={s.form}>
            <View style={s.field}>
              <Text style={s.label}>Email</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={Colors.gray[400]}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={s.btnText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.switchText}>
              Don't have an account?{' '}
              <Text style={s.switchLink}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24 },
  back: { marginBottom: 32, alignSelf: 'flex-start' },
  backText: { color: Colors.brand[500], fontSize: 16, fontWeight: '500' },
  title: { fontSize: 30, fontWeight: '800', color: Colors.gray[900], marginBottom: 8 },
  sub: { fontSize: 15, color: Colors.gray[500], marginBottom: 32 },
  form: { gap: 16, marginBottom: 32 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.gray[700] },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.gray[200],
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.gray[900],
    backgroundColor: Colors.gray[50],
  },
  btn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  switchText: { textAlign: 'center', color: Colors.gray[500], fontSize: 15 },
  switchLink: { color: Colors.brand[500], fontWeight: '600' },
});

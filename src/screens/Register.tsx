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

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> };

const GENDERS = ['Man', 'Woman', 'Non-binary'];

export default function Register({ navigation }: Props) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const nextStep = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim() || !password) {
        Alert.alert('Required', 'Please fill in all fields.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Password too short', 'Password must be at least 6 characters.');
        return;
      }
    }
    setStep(2);
  };

  const handleRegister = () => {
    if (!age || !gender) {
      Alert.alert('Required', 'Please fill in all fields.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
      Alert.alert('Invalid age', 'You must be 18 or older to use Veza.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        age: ageNum,
        gender,
        mode: 'relationship',
      });
      setLoading(false);
      if (!user) {
        Alert.alert('Account exists', 'An account with that email already exists.');
      }
    }, 400);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={s.back}
            onPress={() => (step === 2 ? setStep(1) : navigation.goBack())}
          >
            <Text style={s.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Progress */}
          <View style={s.progress}>
            <View style={[s.dot, step >= 1 && s.dotActive]} />
            <View style={[s.dotLine, step >= 2 && s.dotLineActive]} />
            <View style={[s.dot, step >= 2 && s.dotActive]} />
          </View>

          {step === 1 ? (
            <>
              <Text style={s.title}>Create account</Text>
              <Text style={s.sub}>Join thousands finding authentic connections</Text>

              <View style={s.form}>
                <View style={s.field}>
                  <Text style={s.label}>Full name</Text>
                  <TextInput
                    style={s.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={Colors.gray[400]}
                    autoCapitalize="words"
                  />
                </View>
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
                    placeholder="Min. 6 characters"
                    placeholderTextColor={Colors.gray[400]}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity style={s.btn} onPress={nextStep} activeOpacity={0.85}>
                  <Text style={s.btnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={s.title}>About you</Text>
              <Text style={s.sub}>Help us find you better matches</Text>

              <View style={s.form}>
                <View style={s.field}>
                  <Text style={s.label}>Age</Text>
                  <TextInput
                    style={s.input}
                    value={age}
                    onChangeText={setAge}
                    placeholder="Your age"
                    placeholderTextColor={Colors.gray[400]}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>

                <View style={s.field}>
                  <Text style={s.label}>I am a…</Text>
                  <View style={s.chips}>
                    {GENDERS.map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[s.chip, gender === g && s.chipActive]}
                        onPress={() => setGender(g)}
                        activeOpacity={0.8}
                      >
                        <Text style={[s.chipText, gender === g && s.chipTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[s.btn, loading && s.btnDisabled]}
                  onPress={handleRegister}
                  activeOpacity={0.85}
                  disabled={loading}
                >
                  <Text style={s.btnText}>{loading ? 'Creating…' : 'Create account'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.switchText}>
              Already have an account?{' '}
              <Text style={s.switchLink}>Sign in</Text>
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
  back: { marginBottom: 20, alignSelf: 'flex-start' },
  backText: { color: Colors.brand[500], fontSize: 16, fontWeight: '500' },
  progress: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, gap: 0 },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.gray[200],
  },
  dotActive: { backgroundColor: Colors.brand[500] },
  dotLine: { flex: 1, height: 2, backgroundColor: Colors.gray[200], marginHorizontal: 6 },
  dotLineActive: { backgroundColor: Colors.brand[300] },
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.gray[200],
    backgroundColor: Colors.white,
  },
  chipActive: { borderColor: Colors.brand[500], backgroundColor: Colors.brand[50] },
  chipText: { fontSize: 14, fontWeight: '500', color: Colors.gray[600] },
  chipTextActive: { color: Colors.brand[600], fontWeight: '600' },
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

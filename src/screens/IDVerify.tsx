import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Colors, Radius, Shadow } from '../theme';

const STEPS = ['Upload ID', 'Selfie with ID', 'Submit'];

export default function IDVerify() {
  const navigation = useNavigation();
  const { updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async (setPhoto: (uri: string) => void, camera?: boolean) => {
    const result = camera
      ? await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: false })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.85, allowsEditing: false });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulate a 2s review
    setTimeout(() => {
      updateUser({ verified: true });
      setSubmitting(false);
      Alert.alert(
        'Verification submitted',
        'Your ID and selfie are under review. You\'ll get a verified badge within 24 hours.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.close}>✕</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>ID Verification</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Step indicators */}
      <View style={s.stepRow}>
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <View style={s.stepItem}>
              <View style={[s.stepCircle, i <= step && s.stepCircleActive]}>
                {i < step ? (
                  <Text style={s.stepCheckIcon}>✓</Text>
                ) : (
                  <Text style={[s.stepNum, i === step && s.stepNumActive]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[s.stepLabel, i === step && s.stepLabelActive]}>{label}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[s.stepLine, i < step && s.stepLineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {step === 0 && (
          <View style={s.stepContent}>
            <View style={s.stepIcon}>
              <Text style={s.stepIconText}>ID</Text>
            </View>
            <Text style={s.stepTitle}>Upload your ID</Text>
            <Text style={s.stepSub}>
              Take a clear photo of your government-issued ID (passport, driver's license, or national ID).
            </Text>
            <View style={s.tips}>
              <Text style={s.tipTitle}>For best results:</Text>
              {['All 4 corners clearly visible', 'Good lighting — no shadows', 'No blurry or glared text', 'Full ID in frame, not cropped'].map((t) => (
                <View key={t} style={s.tipRow}>
                  <View style={s.tipDot} />
                  <Text style={s.tipText}>{t}</Text>
                </View>
              ))}
            </View>

            {idPhoto ? (
              <View style={s.photoPreview}>
                <Image source={{ uri: idPhoto }} style={s.previewImg} />
                <TouchableOpacity style={s.retakeBtn} onPress={() => setIdPhoto(null)}>
                  <Text style={s.retakeBtnText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={s.pickBtns}>
                <TouchableOpacity
                  style={s.pickBtn}
                  onPress={() => pickImage(setIdPhoto, true)}
                  activeOpacity={0.85}
                >
                  <Text style={s.pickBtnIcon}>⬛</Text>
                  <Text style={s.pickBtnText}>Take photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.pickBtn, s.pickBtnSecondary]}
                  onPress={() => pickImage(setIdPhoto)}
                  activeOpacity={0.85}
                >
                  <Text style={s.pickBtnIcon}>⬜</Text>
                  <Text style={[s.pickBtnText, { color: Colors.gray[700] }]}>Choose from library</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[s.nextBtn, !idPhoto && s.nextBtnDisabled]}
              onPress={() => idPhoto && setStep(1)}
              activeOpacity={0.85}
              disabled={!idPhoto}
            >
              <Text style={s.nextBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View style={s.stepContent}>
            <View style={[s.stepIcon, { backgroundColor: Colors.brand[100] }]}>
              <Text style={s.stepIconText}>⬛</Text>
            </View>
            <Text style={s.stepTitle}>Selfie holding your ID</Text>
            <Text style={s.stepSub}>
              Hold your ID next to your face so both are clearly visible in one photo.
            </Text>
            <View style={s.tips}>
              <Text style={s.tipTitle}>Important tips:</Text>
              {[
                'Hold the ID flat beside your face — not covering it',
                'Make sure your face and the ID text are both in focus',
                'Good lighting — avoid backlighting or dark rooms',
                'No glare or reflection on the ID surface',
              ].map((t) => (
                <View key={t} style={s.tipRow}>
                  <View style={s.tipDot} />
                  <Text style={s.tipText}>{t}</Text>
                </View>
              ))}
            </View>

            {selfiePhoto ? (
              <View style={s.photoPreview}>
                <Image source={{ uri: selfiePhoto }} style={s.previewImg} />
                <TouchableOpacity style={s.retakeBtn} onPress={() => setSelfiePhoto(null)}>
                  <Text style={s.retakeBtnText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={s.pickBtns}>
                <TouchableOpacity
                  style={s.pickBtn}
                  onPress={() => pickImage(setSelfiePhoto, true)}
                  activeOpacity={0.85}
                >
                  <Text style={s.pickBtnIcon}>⬛</Text>
                  <Text style={s.pickBtnText}>Take selfie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.pickBtn, s.pickBtnSecondary]}
                  onPress={() => pickImage(setSelfiePhoto)}
                  activeOpacity={0.85}
                >
                  <Text style={s.pickBtnIcon}>⬜</Text>
                  <Text style={[s.pickBtnText, { color: Colors.gray[700] }]}>Choose from library</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={s.stepNavRow}>
              <TouchableOpacity style={s.backStepBtn} onPress={() => setStep(0)} activeOpacity={0.85}>
                <Text style={s.backStepBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.nextBtn, !selfiePhoto && s.nextBtnDisabled, { flex: 1 }]}
                onPress={() => selfiePhoto && setStep(2)}
                activeOpacity={0.85}
                disabled={!selfiePhoto}
              >
                <Text style={s.nextBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={s.stepContent}>
            <View style={[s.stepIcon, { backgroundColor: Colors.green[400] + '30' }]}>
              <Text style={{ fontSize: 32, color: Colors.green[500] }}>✓</Text>
            </View>
            <Text style={s.stepTitle}>Ready to submit</Text>
            <Text style={s.stepSub}>
              We'll review your documents within 24 hours and add a verified badge to your profile.
            </Text>

            <View style={s.reviewSummary}>
              <View style={s.reviewRow}>
                <Text style={s.reviewLabel}>Government ID</Text>
                <Image source={{ uri: idPhoto! }} style={s.reviewThumb} />
              </View>
              <View style={s.reviewRow}>
                <Text style={s.reviewLabel}>Selfie with ID</Text>
                <Image source={{ uri: selfiePhoto! }} style={s.reviewThumb} />
              </View>
            </View>

            <View style={s.privacyNote}>
              <Text style={s.privacyText}>
                Your documents are encrypted and used only for verification. They are never shared with other users.
              </Text>
            </View>

            <View style={s.stepNavRow}>
              <TouchableOpacity style={s.backStepBtn} onPress={() => setStep(1)} activeOpacity={0.85}>
                <Text style={s.backStepBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.nextBtn, { flex: 1 }, submitting && s.nextBtnDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={submitting}
              >
                <Text style={s.nextBtnText}>{submitting ? 'Submitting…' : 'Submit for review'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  close: { fontSize: 18, color: Colors.gray[500], padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.gray[900] },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.gray[200],
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: Colors.brand[500] },
  stepNum: { fontSize: 14, fontWeight: '700', color: Colors.gray[500] },
  stepNumActive: { color: Colors.white },
  stepCheckIcon: { fontSize: 14, color: Colors.white, fontWeight: '700' },
  stepLabel: { fontSize: 10, color: Colors.gray[400], fontWeight: '600', textAlign: 'center' },
  stepLabelActive: { color: Colors.brand[500] },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.gray[200], marginHorizontal: 4, marginBottom: 14 },
  stepLineActive: { backgroundColor: Colors.brand[300] },

  scroll: { flexGrow: 1, padding: 24 },
  stepContent: { gap: 16 },
  stepIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  stepIconText: { fontSize: 24, color: Colors.gray[600], fontWeight: '800' },
  stepTitle: { fontSize: 24, fontWeight: '800', color: Colors.gray[900], textAlign: 'center' },
  stepSub: { fontSize: 15, color: Colors.gray[500], textAlign: 'center', lineHeight: 22 },

  tips: {
    backgroundColor: Colors.gray[50],
    borderRadius: Radius.lg,
    padding: 16, gap: 8,
  },
  tipTitle: { fontSize: 13, fontWeight: '700', color: Colors.gray[600], marginBottom: 4 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.brand[400], marginTop: 7 },
  tipText: { flex: 1, fontSize: 14, color: Colors.gray[600], lineHeight: 20 },

  pickBtns: { gap: 12 },
  pickBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    ...Shadow.md,
  },
  pickBtnSecondary: { backgroundColor: Colors.gray[100] },
  pickBtnIcon: { fontSize: 18 },
  pickBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

  photoPreview: { alignItems: 'center', gap: 12 },
  previewImg: { width: '100%', height: 200, borderRadius: Radius.lg, resizeMode: 'cover' },
  retakeBtn: {
    borderWidth: 1.5, borderColor: Colors.gray[300],
    borderRadius: Radius.full,
    paddingHorizontal: 24, paddingVertical: 8,
  },
  retakeBtnText: { color: Colors.gray[600], fontWeight: '600' },

  nextBtn: {
    backgroundColor: Colors.brand[500],
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.xl,
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },

  stepNavRow: { flexDirection: 'row', gap: 12 },
  backStepBtn: {
    borderWidth: 1.5, borderColor: Colors.gray[200],
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backStepBtnText: { color: Colors.gray[600], fontWeight: '600', fontSize: 15 },

  reviewSummary: {
    backgroundColor: Colors.gray[50],
    borderRadius: Radius.lg,
    padding: 16, gap: 14,
  },
  reviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewLabel: { fontSize: 15, fontWeight: '600', color: Colors.gray[700] },
  reviewThumb: { width: 64, height: 48, borderRadius: Radius.sm, resizeMode: 'cover' },
  privacyNote: {
    backgroundColor: Colors.blue[400] + '15',
    borderRadius: Radius.md,
    padding: 14,
  },
  privacyText: { fontSize: 13, color: Colors.blue[600], lineHeight: 20 },
});

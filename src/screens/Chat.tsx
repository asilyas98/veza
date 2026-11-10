import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { getMessages, sendMessage, getCurrentUser } from '../store';
import { Colors, Radius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

export default function Chat({ navigation, route }: Props) {
  const { matchId, name } = route.params;
  const myId = getCurrentUser()?.id;
  const [messages, setMessages] = useState<any[]>(() => getMessages(matchId));
  const [text, setText] = useState('');
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);

  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(matchId, t);
    setMessages(getMessages(matchId));
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderItem = ({ item }: { item: any }) => {
    const mine = item.sender_id === myId;
    return (
      <View style={[s.bubble, mine ? s.bubbleMine : s.bubbleOther]}>
        <Text style={[s.bubbleText, mine ? s.bubbleTextMine : s.bubbleTextOther]}>
          {item.text}
        </Text>
        <Text style={[s.bubbleTime, mine ? s.bubbleTimeMine : s.bubbleTimeOther]}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>{name}</Text>
          <View style={s.onlineRow}>
            <View style={s.onlineDot} />
            <Text style={s.onlineText}>Active now</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          onContentSizeChange={() => flatRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>Say hello to {name}!</Text>
            </View>
          }
        />

        {/* Input */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={text}
            onChangeText={setText}
            placeholder={`Message ${name}…`}
            placeholderTextColor={Colors.gray[400]}
            multiline
            maxLength={500}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[s.sendBtn, !text.trim() && s.sendBtnDisabled]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!text.trim()}
          >
            <Text style={s.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    gap: 12,
  },
  back: { padding: 4 },
  backText: { fontSize: 32, color: Colors.brand[500], lineHeight: 32 },
  headerInfo: {},
  headerName: { fontSize: 17, fontWeight: '700', color: Colors.gray[900] },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.green[500] },
  onlineText: { fontSize: 12, color: Colors.green[600], fontWeight: '500' },
  list: { paddingHorizontal: 16, paddingVertical: 12, gap: 10, flexGrow: 1 },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radius.lg,
    marginBottom: 2,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.brand[500],
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gray[100],
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextMine: { color: Colors.white },
  bubbleTextOther: { color: Colors.gray[900] },
  bubbleTime: { fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  bubbleTimeMine: { color: Colors.brand[200] },
  bubbleTimeOther: { color: Colors.gray[400] },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: Colors.gray[400], fontSize: 15 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    gap: 10,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    borderRadius: Radius['2xl'],
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.gray[900],
    maxHeight: 120,
  },
  sendBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  sendBtnDisabled: { backgroundColor: Colors.gray[300] },
  sendIcon: { color: Colors.white, fontSize: 18, fontWeight: '700' },
});

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── In-memory cache ──────────────────────────────────────────────────────────
const cache: Record<string, any> = {};

function load<T>(key: string, fallback: T): T {
  return cache[key] !== undefined ? cache[key] : fallback;
}

function save(key: string, value: any) {
  cache[key] = value;
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
}

// ─── Options ──────────────────────────────────────────────────────────────────
export const OPTIONS = {
  countries: ['Serbia','Croatia','Bosnia','Slovenia','Montenegro','North Macedonia','Kosovo','Albania','Bulgaria','Romania'],
  languages: ['Serbian','Croatian','Bosnian','Slovenian','Macedonian','Albanian','Bulgarian','Romanian'],
  religions: ['Orthodox','Catholic','Muslim','Agnostic','Atheist','Other'],
  interests: ['Hiking','Cooking','Music','Travel','Sports','Reading','Photography','Gaming','Fitness','Art','Film','Dancing'],
  relationship_goals: ['Long-term relationship','Marriage-minded','Open to dating','Companionship'],
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id:'s1', name:'Ana Jovanovic',    age:26, gender:'female', country:'Serbia',      city:'Belgrade',  language:'Serbian',  religion:'Orthodox', interests:['Hiking','Music','Travel'], bio:'Architect by day, hiker by weekend. Looking for someone who appreciates the small things — good coffee, long walks, honest conversations.', photo_url:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face', relationship_goal:'Long-term relationship', occupation:'Architect',   diaspora:false, mode:'relationship', verified:true,  plan:'free', plan_tier:null, super_likes_remaining:0 },
  { id:'s2', name:'Marko Petrovic',   age:29, gender:'male',   country:'Croatia',     city:'Split',     language:'Croatian', religion:'Catholic', interests:['Sports','Cooking','Music'], bio:'Growing up between Split and Vienna gave me two homes. Weekend sailor, weekday engineer. Loves cooking traditional Dalmatian food.', photo_url:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face', relationship_goal:'Marriage-minded',       occupation:'Engineer',   diaspora:true, mode:'relationship', verified:false, plan:'free', plan_tier:null, super_likes_remaining:0 },
  { id:'s3', name:'Lejla Hasanovic',  age:24, gender:'female', country:'Bosnia',      city:'Sarajevo',  language:'Bosnian',  religion:'Muslim',   interests:['Art','Photography','Reading'], bio:'Born in Sarajevo, raised with stories of its resilience. I find beauty in everyday moments. Huge reader, amateur photographer.', photo_url:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face', relationship_goal:'Long-term relationship', occupation:'Graphic Designer', diaspora:false, mode:'relationship', verified:true,  plan:'free', plan_tier:null, super_likes_remaining:0 },
  { id:'s4', name:'Stefan Nikolic',   age:31, gender:'male',   country:'Serbia',      city:'Novi Sad',  language:'Serbian',  religion:'Orthodox', interests:['Film','Gaming','Travel'], bio:'Filmmaker and storyteller. I believe every person has a documentary worth making. Looking for my leading lady.', photo_url:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=600&fit=crop&crop=face', relationship_goal:'Open to dating',         occupation:'Filmmaker',  diaspora:false, mode:'relationship', verified:false, plan:'free', plan_tier:null, super_likes_remaining:0 },
  { id:'s5', name:'Mia Horvat',       age:27, gender:'female', country:'Slovenia',    city:'Ljubljana', language:'Slovenian', religion:'Catholic', interests:['Fitness','Hiking','Cooking'], bio:'Personal trainer and nutrition enthusiast. If you can keep up on a mountain trail, we might just get along.', photo_url:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop&crop=face', relationship_goal:'Long-term relationship', occupation:'Personal Trainer', diaspora:false, mode:'relationship', verified:true,  plan:'free', plan_tier:null, super_likes_remaining:0 },
  { id:'s6', name:'Nikola Djordjevic',age:28, gender:'male',   country:'Serbia',      city:'Toronto',   language:'Serbian',  religion:'Orthodox', interests:['Music','Sports','Travel'], bio:'Software developer in Toronto, heart in Nis. Miss the food, the warmth, the summer nights. Looking for someone who feels the same pull.', photo_url:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&crop=face', relationship_goal:'Marriage-minded',       occupation:'Software Developer', diaspora:true, mode:'relationship', verified:false, plan:'free', plan_tier:null, super_likes_remaining:0 },
  { id:'s7', name:'Amra Besic',       age:25, gender:'female', country:'Bosnia',      city:'Vienna',    language:'Bosnian',  religion:'Muslim',   interests:['Reading','Art','Film'], bio:'Lawyer by training, bookworm by nature. Diaspora life gave me perspective. Looking for depth over small talk.', photo_url:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face', relationship_goal:'Long-term relationship', occupation:'Lawyer',      diaspora:true, mode:'relationship', verified:true,  plan:'free', plan_tier:null, super_likes_remaining:0 },
  { id:'s8', name:'Ivan Markovic',    age:30, gender:'male',   country:'Montenegro',  city:'Podgorica', language:'Serbian',  religion:'Orthodox', interests:['Hiking','Photography','Cooking'], bio:"Montenegrin soul — slow mornings, strong coffee, beautiful mountains. I'll cook for you if you join me on a sunrise hike.", photo_url:'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=600&fit=crop&crop=face', relationship_goal:'Open to dating',         occupation:'Chef',       diaspora:false, mode:'relationship', verified:false, plan:'free', plan_tier:null, super_likes_remaining:0 },
];

const SEED_STORIES = [
  { id:'st1', author_id:'s1', author_name:'Ana Jovanovic',   content:'Just got back from hiking Tara Mountain. The views are indescribable. Highly recommend for anyone visiting Serbia!', is_public:true,  created_at: Date.now() - 3600000 },
  { id:'st2', author_id:'s3', author_name:'Lejla Hasanovic', content:'First snow in Sarajevo this season. This city looks magical in white. Missing home more than ever from Vienna.', is_public:true,  created_at: Date.now() - 7200000 },
  { id:'st3', author_id:'s5', author_name:'Mia Horvat',      content:'Triglav done! Hardest climb of my life but completely worth it. Already planning the next summit.', is_public:true,  created_at: Date.now() - 14400000 },
  { id:'st4', author_id:'s2', author_name:'Marko Petrovic',  content:'Cooked my grandma\'s peka recipe tonight. Some traditions are worth preserving no matter where you live.', is_public:true,  created_at: Date.now() - 86400000 },
  { id:'st5', author_id:'s7', author_name:'Amra Besic',      content:'Finished my third book this month. Recommend "The Bridge on the Drina" to anyone who wants to understand the Balkans.', is_public:true,  created_at: Date.now() - 172800000 },
  { id:'st6', author_id:'s8', author_name:'Ivan Markovic',   content:'Made fresh pršut today — 18 months of curing finally paid off. Some things in life are worth the wait.', is_public:true,  created_at: Date.now() - 259200000 },
];

// ─── Init ──────────────────────────────────────────────────────────────────────
export async function initStore(): Promise<void> {
  const keys = ['veza_users','veza_swipes','veza_matches','veza_messages','veza_stories','veza_current_user'];
  const pairs = await AsyncStorage.multiGet(keys);
  for (const [key, value] of pairs) {
    cache[key] = value ? JSON.parse(value) : null;
  }
  if (!cache['veza_users'] || (cache['veza_users'] as any[]).length === 0) {
    save('veza_users', SEED_USERS);
    save('veza_stories', SEED_STORIES);
    save('veza_swipes', []);
    save('veza_matches', []);
    save('veza_messages', []);
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export function getCurrentUser(): any | null {
  const uid = load<string | null>('veza_current_user', null);
  if (!uid) return null;
  const users = load<any[]>('veza_users', []);
  return users.find(u => u.id === uid) || null;
}

export function login(email: string, password: string): any | null {
  const users = load<any[]>('veza_users', []);
  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return null;
  save('veza_current_user', user.id);
  return user;
}

export function register(data: any): any | null {
  const users = load<any[]>('veza_users', []);
  if (users.find(u => u.email?.toLowerCase() === data.email?.toLowerCase())) {
    return null;
  }
  const id = `u_${Date.now()}`;
  const newUser = {
    ...data,
    id,
    plan: 'free',
    plan_tier: null,
    likes_today: 0,
    likes_day_reset: getDayKey(),
    super_likes_remaining: 0,
    verified: false,
    created_at: Date.now(),
  };
  save('veza_users', [...users, newUser]);
  save('veza_current_user', id);
  seedLikesForNewUser(id);
  return newUser;
}

export function logout() {
  save('veza_current_user', null);
}

/** Merge partial data into the current user record and return the full merged user. */
export function updateUser(data: any): any {
  const me = getCurrentUser();
  if (!me) return data;
  const users = load<any[]>('veza_users', []);
  const merged = { ...me, ...data, id: me.id };
  save('veza_users', users.map(u => u.id === me.id ? merged : u));
  return merged;
}

/** Convenience wrappers for screens */
export function getDailyLikesLeft(): number {
  return getLikeStatus().remaining;
}

export function getLikes(): any[] {
  return getWhoLikedMe();
}

// ─── Day key ──────────────────────────────────────────────────────────────────
function getDayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ─── Discover / Swipe ─────────────────────────────────────────────────────────
export function getProfiles(): any[] {
  return load<any[]>('veza_users', []);
}

export function getDiscover(): any[] {
  const me = getCurrentUser();
  if (!me) return [];
  const swipes = load<any[]>('veza_swipes', []);
  const mySwipes = new Set(swipes.filter(s => s.swiper_id === me.id).map(s => s.swiped_id));
  const profiles = getProfiles();
  return profiles.filter(p => {
    if (p.id === me.id) return false;
    if (mySwipes.has(p.id)) return false;
    if (me.mode === 'relationship' && p.gender === me.gender) return false;
    if (me.mode === 'friendship' && p.gender !== me.gender) return false;
    return true;
  });
}

export function getLikeStatus() {
  const me = getCurrentUser();
  if (!me) return { remaining: 0, dailyLimit: 50, resetAt: null };
  const today = getDayKey();
  if (me.likes_day_reset !== today) {
    const updated = { ...me, likes_today: 0, likes_day_reset: today };
    updateUser(updated);
    return { remaining: 50, dailyLimit: 50, resetAt: null };
  }
  const used = me.likes_today || 0;
  return { remaining: Math.max(0, 50 - used), dailyLimit: 50, resetAt: null };
}

export function swipe(swipedId: string, direction: 'like' | 'pass' | 'superlike'): { matched: boolean; matchId?: string } {
  const me = getCurrentUser();
  if (!me) return { matched: false };

  if (direction === 'like' || direction === 'superlike') {
    const { remaining } = getLikeStatus();
    if (remaining <= 0) return { matched: false };
    const updated = { ...me, likes_today: (me.likes_today || 0) + 1 };
    updateUser(updated);
  }

  const swipe = { swiper_id: me.id, swiped_id: swipedId, direction, created_at: Date.now() };
  const swipes = load<any[]>('veza_swipes', []);
  save('veza_swipes', [...swipes, swipe]);

  if (direction !== 'pass') {
    const theyLikedMe = swipes.some(s => s.swiper_id === swipedId && s.swiped_id === me.id && s.direction !== 'pass');
    if (theyLikedMe) {
      const matchId = `m_${me.id}_${swipedId}`;
      const matches = load<any[]>('veza_matches', []);
      const exists = matches.some(m => m.id === matchId || m.id === `m_${swipedId}_${me.id}`);
      if (!exists) {
        save('veza_matches', [...matches, { id: matchId, user1_id: me.id, user2_id: swipedId, created_at: Date.now() }]);
      }
      return { matched: true, matchId };
    }
  }
  return { matched: false };
}

export function canGoBack(): boolean {
  const me = getCurrentUser();
  if (!me) return false;
  return me.plan !== 'free' && !!me.plan_tier;
}

export function undoLastSwipe(): any | null {
  const me = getCurrentUser();
  if (!me) return null;
  const swipes = load<any[]>('veza_swipes', []);
  const mine = swipes.filter(s => s.swiper_id === me.id);
  if (mine.length === 0) return null;
  const last = mine[mine.length - 1];
  save('veza_swipes', swipes.filter(s => !(s.swiper_id === me.id && s.created_at === last.created_at)));
  return getProfiles().find(p => p.id === last.swiped_id) || null;
}

export function getSuperLikeStatus() {
  const me = getCurrentUser();
  if (!me) return { remaining: 0 };
  return { remaining: me.super_likes_remaining || 0 };
}

// ─── Likes ────────────────────────────────────────────────────────────────────
export function getWhoLikedMe(): any[] {
  const me = getCurrentUser();
  if (!me) return [];
  const swipes = load<any[]>('veza_swipes', []);
  const profiles = getProfiles();
  const likers = swipes.filter(s => s.swiped_id === me.id && s.direction !== 'pass').map(s => s.swiper_id);
  return profiles.filter(p => likers.includes(p.id));
}

export function seedLikesForNewUser(userId: string) {
  const profiles = getProfiles();
  const swipes = load<any[]>('veza_swipes', []);
  const fakers = profiles.filter(p => p.id !== userId).slice(0, 4);
  const newSwipes = fakers.map(f => ({
    swiper_id: f.id,
    swiped_id: userId,
    direction: 'like',
    created_at: Date.now() - Math.random() * 86400000,
  }));
  save('veza_swipes', [...swipes, ...newSwipes]);
}

// ─── Matches ──────────────────────────────────────────────────────────────────
export function getMatches(): any[] {
  const me = getCurrentUser();
  if (!me) return [];
  const matches = load<any[]>('veza_matches', []);
  const profiles = getProfiles();
  const messages = load<any[]>('veza_messages', []);
  return matches
    .filter(m => m.user1_id === me.id || m.user2_id === me.id)
    .map(m => {
      const otherId = m.user1_id === me.id ? m.user2_id : m.user1_id;
      const other = profiles.find(p => p.id === otherId);
      const matchMessages = messages.filter(msg => msg.match_id === m.id);
      const last = matchMessages[matchMessages.length - 1];
      return { ...m, other, last_message: last || null, unread: matchMessages.filter(msg => msg.sender_id !== me.id && !msg.read).length };
    })
    .filter(m => !!m.other)
    .sort((a, b) => (b.last_message?.created_at || b.created_at) - (a.last_message?.created_at || a.created_at));
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export function getMessages(matchId: string): any[] {
  const messages = load<any[]>('veza_messages', []);
  return messages.filter(m => m.match_id === matchId).sort((a, b) => a.created_at - b.created_at);
}

export function sendMessage(matchId: string, text: string): any {
  const me = getCurrentUser();
  if (!me) throw new Error('Not logged in');
  const msg = { id: `msg_${Date.now()}`, match_id: matchId, sender_id: me.id, text, created_at: Date.now(), read: false };
  const messages = load<any[]>('veza_messages', []);
  save('veza_messages', [...messages, msg]);
  return msg;
}

// ─── Stories ──────────────────────────────────────────────────────────────────
export function getStories(filter: 'public' | 'private'): any[] {
  const me = getCurrentUser();
  const stories = load<any[]>('veza_stories', []);
  if (filter === 'public') {
    return stories.filter(s => s.is_public).sort((a, b) => b.created_at - a.created_at);
  }
  if (!me) return [];
  const matchedIds = new Set(getMatches().map(m => m.other?.id).filter(Boolean));
  return stories.filter(s => !s.is_public && (s.author_id === me.id || matchedIds.has(s.author_id))).sort((a, b) => b.created_at - a.created_at);
}

export function postStory(content: string, is_public: boolean): any {
  const me = getCurrentUser();
  if (!me) throw new Error('Not logged in');
  const story = { id: `st_${Date.now()}`, author_id: me.id, author_name: me.name, content, is_public, created_at: Date.now() };
  const stories = load<any[]>('veza_stories', []);
  save('veza_stories', [story, ...stories]);
  return story;
}

// ─── Bio generation ───────────────────────────────────────────────────────────
export function generateBio(form: any): string {
  const parts: string[] = [];
  if (form.prompt_food) parts.push(`I like ${form.prompt_food}.`);
  if (form.prompt_hobbies) parts.push(`I have ${form.prompt_hobbies}.`);
  if (form.prompt_unique) parts.push(`Unique thing about me is ${form.prompt_unique}.`);
  if (form.country) parts.push(`Proud ${form.country}${form.diaspora ? ' diaspora' : ''} roots.`);
  if (form.relationship_goal) parts.push(`Looking for ${form.relationship_goal.toLowerCase()}.`);
  return parts.join(' ') || `${form.name || 'Hey'} — here to find a genuine connection.`;
}

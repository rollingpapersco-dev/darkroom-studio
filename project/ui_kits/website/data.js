// Sample Season One data. Genre + context lines are copied from yt.js ENRICH (in playlist order).
// Artist/track names marked TODO are not in the repo (they load live from YouTube) — confirm before shipping.
window.EPISODES = [
  { num: 'EP.01', artist: 'KJUNI', track: 'Leather', genre: 'Alt · Experimental', context: 'Where it started. The first artist to walk into the room and prove the format holds — no crowd, no safety net, just the record.' },
  { num: 'EP.02', artist: 'KJUNI', track: '', genre: 'Alt · Experimental', context: 'The only artist to come back. Kjuni returned to the Darkroom — the first and only two-episode run of Season One.' },
  { num: 'EP.03', artist: 'ARTIST (TODO)', track: 'PARIWO', genre: 'Afrobeats · Street', context: 'PARIWO means make noise — and the room did. Street energy compressed into a space built for silence.' },
  { num: 'EP.04', artist: 'ARTIST (TODO)', track: 'Alubarika', genre: 'Afrobeats', context: 'Alubarika — blessings. A record about gratitude, performed in a room that gives an artist nothing for free.' },
  { num: 'EP.05', artist: 'NELLY BARADI', track: '', genre: 'Afrobeats', context: "Some records don't ask for your attention — they already have it. Nelly Baradi held the room without raising it." },
  { num: 'EP.06', artist: 'YKB AND DANPAPA', track: 'Dey My Body', genre: 'Afrobeats', context: 'Two viral moments, one room. The man behind YII and the voice of Ikeja (No Go Thief) — one take, walls shaking.' },
  { num: 'EP.07', artist: 'ARTIST (TODO)', track: '', genre: 'Afrobeats · Street', context: 'The quiet episode. A sermon on staying calm, moving smart, and not letting Lagos swallow you — melodic and unbothered.' },
  { num: 'EP.08', artist: 'RANDY MORGAN', track: 'Changes', genre: 'Hip-Hop · Rap', context: '"I don dey see changes." The Radio Rap Guy — years behind the mic in Benin, now in front of the camera in Lagos.' },
  { num: 'EP.09', artist: 'FIDO', track: 'Dance for Jesus', genre: 'Afrofusion · Street-Gospel', context: 'A record built for fifty thousand people, performed in a room built for one. Ft. Zlatan & ODUMODUBLVCK on the record.' },
].map((e, i) => ({ ...e, img: '../../assets/episodes/ep' + String(i + 1).padStart(2, '0') + '.jpg' }));

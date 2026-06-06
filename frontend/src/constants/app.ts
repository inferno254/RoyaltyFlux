export const GENRES = [
  { value: 'AFROBEATS', label: 'Afrobeats' },
  { value: 'KAPUKA', label: 'Kapuka' },
  { value: 'GOSPEL', label: 'Gospel' },
  { value: 'R_AND_B', label: 'R&B' },
  { value: 'HIPHOP', label: 'Hip Hop' },
  { value: 'REGGAE', label: 'Reggae' },
  { value: 'TRAP', label: 'Trap' },
  { value: 'DRILL', label: 'Drill' },
  { value: 'POP', label: 'Pop' },
] as const;

export const COLLABORATOR_ROLES = [
  { value: 'LYRICIST', label: 'Lyricist' },
  { value: 'COMPOSER', label: 'Composer' },
  { value: 'PRODUCER', label: 'Producer' },
] as const;

export const ROLES = [
  { value: 'ARTIST', label: 'Artist' },
  { value: 'PRODUCER', label: 'Producer' },
] as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  EARNINGS: '/earnings',
  SETTINGS: '/settings',
  SONG: (id: string) => `/songs/${id}`,
  ARTIST: (id: string) => `/artist/${id}`,
} as const;

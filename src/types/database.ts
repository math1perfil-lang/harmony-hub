// Custom types for the application
export type AppRole = 'super_admin' | 'house_admin' | 'user';
export type ProfileType = 'individual' | 'couple';
export type IdentityType = 'man' | 'woman' | 'non_binary' | 'other';
export type InteractionPreference = 'individuals' | 'couples' | 'all';
export type ParticipationStatus = 'listed' | 'confirmed';

export interface House {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  custom_domain: string | null;
  rules: string | null;
  about: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  house_id: string;
  nickname: string;
  profile_type: ProfileType;
  age: number;
  city: string;
  avatar_url: string | null;
  bio: string | null;
  identity: IdentityType;
  identity_other: string | null;
  interaction_preference: InteractionPreference;
  is_subscriber: boolean;
  subscription_expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  house_id: string;
  title: string;
  description: string | null;
  benefits: string | null;
  image_url: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventParticipation {
  id: string;
  event_id: string;
  profile_id: string;
  status: ParticipationStatus;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  event_id: string;
  profile_a_id: string;
  profile_b_id: string;
  is_mutual: boolean;
  created_at: string;
}

export interface Like {
  id: string;
  event_id: string;
  from_profile_id: string;
  to_profile_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  connection_id: string;
  sender_profile_id: string;
  content: string;
  created_at: string;
}

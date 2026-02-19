
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  AVAILABLE = 'AVAILABLE',
  CLOSED = 'CLOSED',
  APPLIED = 'APPLIED'
}

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Appointment {
  timeRange: string;
  volunteerNames: string[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  location: string; // 시간대별 개별 장소 추가
  currentParticipants: number;
  maxParticipants: number;
  status: ApplicationStatus;
  applicants?: string[]; 
  appointments?: Appointment[];
  notice?: string; // 슬롯별 공지사항 추가
}

export interface ServiceDate {
  date: string;
  location: string; // 기본 장소 (하위 호환 및 기본값용)
  slots: TimeSlot[];
  isFeatured?: boolean;
}

export interface ServiceRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
}

export interface Volunteer {
  id: string;
  name: string;
  requestDate: string;
  phone: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  department?: string;
  note: string;
  isAdmin?: boolean;
}

export type ApprovalRequest = Volunteer;

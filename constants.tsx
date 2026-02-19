
import { ServiceDate, ApplicationStatus, ServiceRecord, Volunteer } from './types';

export const MOCK_SERVICES: ServiceDate[] = [
  {
    date: '2024-06-15',
    location: '서울 강남역 11번 출구 광장',
    isFeatured: true,
    slots: [
      { 
        id: '1', 
        startTime: '09:00', 
        endTime: '11:00', 
        location: '호반아파트 정문',
        currentParticipants: 2, 
        maxParticipants: 2, 
        status: ApplicationStatus.CLOSED,
        applicants: ['김민수', '이서연', '박준호']
      },
      { 
        id: '2', 
        startTime: '11:00', 
        endTime: '13:00', 
        location: '역곡역 앞 광장',
        currentParticipants: 1, 
        maxParticipants: 2, 
        status: ApplicationStatus.AVAILABLE,
        applicants: ['정성호']
      }
    ]
  }
];

export const MOCK_RECORDS: ServiceRecord[] = [
  {
    id: 'r1',
    title: '전시대 봉사',
    date: '2024-06-15',
    time: '11:00-13:00',
    duration: '2시간',
    participants: ['김민수', '이서연'],
    status: 'UPCOMING'
  }
];

export const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: '1', name: '김민수', requestDate: '2023.10.27', phone: '010-1234-5678', age: 28, gender: 'MALE', note: '장로', isAdmin: true },
  { id: '2', name: '이서연', requestDate: '2023.10.26', phone: '010-9876-5432', age: 24, gender: 'FEMALE', note: '정파' },
  { id: '3', name: '박준호', requestDate: '2023.10.25', phone: '010-1111-2222', age: 35, gender: 'MALE', note: '봉종' },
  { id: '4', name: '정성호', requestDate: '2023.10.24', phone: '010-3333-4444', age: 30, gender: 'MALE', note: '장로', isAdmin: true },
];

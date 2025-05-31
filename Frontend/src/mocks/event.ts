// src/mocks/event.ts
import type { Event } from '@/types/event';

export const mockEvent: Event = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'Пример мероприятия (мок)',
  budget_type: 'SOLO',
  venue_type: 'OWN',
  venue_cost: null,
  event_date: '2024-12-31T19:00:00',
  description: 'Это тестовое мероприятие с мок-данными' // description был в исходном интерфейсе
};

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Новый год 2024',
    budget_type: 'GROUP',
    venue_type: 'RENTED',
    venue_cost: 15000,
    event_date: '2024-12-31T23:00:00',
    description: 'Корпоратив в ресторане'
  },
  {
    id: '2',
    title: 'День рождения',
    budget_type: 'SOLO',
    venue_type: 'OWN',
    venue_cost: null,
    event_date: '2024-07-15T18:00:00',
    description: 'Домашняя вечеринка'
  }
];
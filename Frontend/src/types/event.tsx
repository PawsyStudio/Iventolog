export interface Event {
  id: string;
  title: string;
  budget_type: 'SOLO' | 'GROUP';
  venue_type?: 'OWN' | 'RENTED';
  venue_cost?: number | null;
  event_date?: string;
  description?: string;
  guests_count?: number | null;
}
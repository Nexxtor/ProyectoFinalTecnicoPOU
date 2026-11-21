import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import EventCard from '../components/events/EventCard.jsx';

const event = {
  id: 1,
  title: 'Noche de Jazz',
  category: 'Música',
  date: '2026-12-05',
  time: '19:30',
  venue: 'Teatro Nacional',
  city: 'San Salvador',
  image: '/images/event-1.svg',
  status: 'published',
  minPrice: 18,
  available: 100
};

describe('EventCard', () => {
  it('muestra la información y enlaza al detalle', () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );
    expect(screen.getByText('Noche de Jazz')).toBeInTheDocument();
    expect(screen.getByText(/Teatro Nacional/)).toBeInTheDocument();
    expect(screen.getByText(/Desde/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Noche de Jazz/i })[0]).toHaveAttribute(
      'href',
      '/eventos/1'
    );
  });
});

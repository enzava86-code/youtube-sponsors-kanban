"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sponsorship } from "@/types/sponsorship";
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface SponsorshipCalendarProps {
  sponsorships: Sponsorship[];
}

type CalendarEvent = {
  date: Date;
  title: string;
  type: 'delivery' | 'publish';
  sponsorship: Sponsorship;
};

export function SponsorshipCalendar({ sponsorships }: SponsorshipCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events: CalendarEvent[] = sponsorships.flatMap(s => {
    const eventsList: CalendarEvent[] = [];
    if (s.deliveryDate) {
      eventsList.push({
        date: new Date(s.deliveryDate),
        title: `${s.brandName} - Entrega`,
        type: 'delivery',
        sponsorship: s,
      });
    }
    if (s.publishDate) {
      eventsList.push({
        date: new Date(s.publishDate),
        title: `${s.brandName} - Publicación`,
        type: 'publish',
        sponsorship: s,
      });
    }
    return eventsList;
  });

  const DayContent = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(event.date, day));

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative h-full w-full flex items-center justify-center">
            <span>{format(day, 'd')}</span>
            {dayEvents.length > 0 && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.title}
                    className={`h-1.5 w-1.5 rounded-full ${event.type === 'delivery' ? 'bg-blue-500' : 'bg-red-500'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </PopoverTrigger>
        {dayEvents.length > 0 && (
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">{format(day, "d 'de' MMMM", { locale: es })}</h4>
                <p className="text-sm text-muted-foreground">
                  {dayEvents.length} evento(s) programado(s).
                </p>
              </div>
              <div className="grid gap-2">
                {dayEvents.map(event => (
                  <div key={event.title} className="grid grid-cols-[25px_1fr] items-start pb-4 last:pb-0">
                    <span className={`flex h-2 w-2 translate-y-1 rounded-full ${event.type === 'delivery' ? 'bg-blue-500' : 'bg-red-500'}`} />
                    <div className="grid gap-1">
                      <p className="font-semibold">{event.sponsorship.title}</p>
                      <p className="text-sm text-muted-foreground">{event.type === 'delivery' ? 'Fecha de Entrega' : 'Fecha de Publicación'}</p>
                      <Badge variant="outline">{event.sponsorship.brandName}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendario de Patrocinios</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-2 md:p-4">
        <Calendar
          mode="single"
          selected={new Date()} // This can be changed to show a selected day's details
          onMonthChange={setCurrentMonth}
          className="rounded-md border w-full"
          components={{
            DayContent: ({ date }) => DayContent(date),
          }}
        />
      </CardContent>
    </Card>
  );
}

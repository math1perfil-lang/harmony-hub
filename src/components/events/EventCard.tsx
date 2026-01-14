import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/database';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = parseISO(event.event_date);
  const formattedDate = format(eventDate, "d 'de' MMMM", { locale: ptBR });
  const dayOfWeek = format(eventDate, 'EEEE', { locale: ptBR });
  const isUpcoming = eventDate >= new Date();

  return (
    <Link to={`/evento/${event.id}`}>
      <Card className="group overflow-hidden hover-lift bg-card border-border/50 hover:border-primary/50 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary opacity-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {/* Date Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="glass font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </Badge>
          </div>

          {/* Status Badge */}
          {isUpcoming && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-success text-success-foreground">
                Em breve
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <div className="space-y-3">
            <div>
              <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {dayOfWeek}
              </p>
            </div>

            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.start_time.slice(0, 5)}
                {event.end_time && ` - ${event.end_time.slice(0, 5)}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

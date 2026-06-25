import { useState, useCallback } from 'react';

export type PublicType = 'Brasil' | 'Hispânicos' | 'NCA' | 'Americas' | string;

export interface Audience {
  type: 'hotel' | 'sede';
  value: PublicType;
}

export interface Training {
  id: string;
  name: string;
  trainingType: 'Nova ferramenta' | 'Reciclagem de ferramenta' | 'Boas práticas' | string;
  audiences: Audience[];
  date: Date;
  status: 'Planejado' | 'Confirmado' | 'Realizado' | 'Cancelado' | 'Adiado';
  facilitator?: string;
  link?: string;
  description?: string;
  duration?: string;
  maxParticipants?: number;
}

export interface Communication {
  id: string;
  trainingId?: string;
  trainingName?: string;
  communicationType: 'Convite/Save the Date' | 'Está chegando' | 'Pós-treinamento' | string;
  audiences: Audience[];
  date: Date;
  channel: 'E-mail' | 'WhatsApp' | 'LMS' | 'Outro';
  status: 'Planejado' | 'Enviado' | 'Cancelado' | 'Adiado';
  subject?: string;
  description?: string;
  recipientCount?: number;
  reinforcement?: boolean;
  reinforcementNames?: string;
}

const AUDIENCE_SIGLA = {
  'Brasil': 'BR',
  'Hispânicos': 'HISP',
  'NCA': 'NCA',
  'Americas': 'AMER',
};

function getAudienceSigla(audience: Audience): string {
  if (audience.type === 'hotel') {
    return AUDIENCE_SIGLA[audience.value as keyof typeof AUDIENCE_SIGLA] || audience.value.substring(0, 3).toUpperCase();
  } else {
    return audience.value.substring(0, 3).toUpperCase();
  }
}

export function useTrainingData() {
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: 'T001',
      name: 'HCM',
      trainingType: 'Nova ferramenta',
      audiences: [{ type: 'hotel', value: 'Brasil' }],
      date: new Date(2026, 6, 1),
      status: 'Confirmado',
      facilitator: 'Ana Lima',
    },
    {
      id: 'T002',
      name: 'Yext',
      trainingType: 'Reciclagem de ferramenta',
      audiences: [{ type: 'hotel', value: 'Hispânicos' }],
      date: new Date(2026, 6, 5),
      status: 'Planejado',
    },
    {
      id: 'T003',
      name: 'Sismaker',
      trainingType: 'Boas práticas',
      audiences: [{ type: 'hotel', value: 'NCA' }],
      date: new Date(2026, 6, 8),
      status: 'Confirmado',
    },
  ]);

  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: 'C001',
      trainingId: 'T003',
      trainingName: 'Sismaker',
      communicationType: 'Convite/Save the Date',
      audiences: [{ type: 'hotel', value: 'Hispânicos' }],
      date: new Date(2026, 6, 12),
      channel: 'WhatsApp',
      status: 'Planejado',
      subject: 'Convite: Treinamento Sismaker',
      reinforcement: false,
    },
  ]);

  const addTraining = useCallback((training: Omit<Training, 'id'>) => {
    const id = `T${String(trainings.length + 1).padStart(3, '0')}`;
    setTrainings(prev => [...prev, { ...training, id }]);
    return id;
  }, [trainings.length]);

  const updateTraining = useCallback((id: string, updates: Partial<Training>) => {
    setTrainings(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTraining = useCallback((id: string) => {
    setTrainings(prev => prev.filter(t => t.id !== id));
  }, []);

  const addCommunication = useCallback((comm: Omit<Communication, 'id'>) => {
    const id = `C${String(communications.length + 1).padStart(3, '0')}`;
    setCommunications(prev => [...prev, { ...comm, id }]);
    return id;
  }, [communications.length]);

  const updateCommunication = useCallback((id: string, updates: Partial<Communication>) => {
    setCommunications(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCommunication = useCallback((id: string) => {
    setCommunications(prev => prev.filter(c => c.id !== id));
  }, []);

  const getGanttData = useCallback((month: number, year: number, filterAudience?: Audience, eventType?: 'all' | 'trainings' | 'communications') => {
    const ganttMap = new Map<string, Map<number, string>>();

    if (eventType !== 'communications') {
      trainings.forEach(t => {
        if (t.date.getMonth() === month && t.date.getFullYear() === year) {
          // Se há filtro, verificar se o treinamento tem esse público
          if (filterAudience) {
            const hasAudience = t.audiences.some(a => a.type === filterAudience.type && a.value === filterAudience.value);
            if (!hasAudience) return;
          }

          const key = `${t.name}|${t.trainingType}`;
          if (!ganttMap.has(key)) ganttMap.set(key, new Map());
          
          const siglas = t.audiences.map(a => getAudienceSigla(a)).join(', ');
          ganttMap.get(key)!.set(t.date.getDate(), siglas);
        }
      });
    }

    if (eventType !== 'trainings') {
      communications.forEach(c => {
        if (c.date.getMonth() === month && c.date.getFullYear() === year) {
          // Se há filtro, verificar se a comunicação tem esse público
          if (filterAudience) {
            const hasAudience = c.audiences.some(a => a.type === filterAudience.type && a.value === filterAudience.value);
            if (!hasAudience) return;
          }

          const key = `${c.trainingName || 'Comunicação Avulsa'}|${c.communicationType}`;
          if (!ganttMap.has(key)) ganttMap.set(key, new Map());
          
          const siglas = c.audiences.map(a => getAudienceSigla(a)).join(', ');
          const existing = ganttMap.get(key)!.get(c.date.getDate());
          ganttMap.get(key)!.set(c.date.getDate(), existing ? `${existing}, ${siglas}` : siglas);
        }
      });
    }

    return ganttMap;
  }, [trainings, communications]);

  return {
    trainings,
    communications,
    addTraining,
    updateTraining,
    deleteTraining,
    addCommunication,
    updateCommunication,
    deleteCommunication,
    getGanttData,
  };
}

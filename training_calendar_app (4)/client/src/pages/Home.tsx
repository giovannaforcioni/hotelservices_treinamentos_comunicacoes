import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { GanttChart } from '@/components/GanttChart';
import { TrainingForm } from '@/components/TrainingForm';
import { CommunicationForm } from '@/components/CommunicationForm';
import { EditTrainingDialog } from '@/components/EditTrainingDialog';
import { EditCommunicationDialog } from '@/components/EditCommunicationDialog';
import { TrainingCommunications } from '@/components/TrainingCommunications';
import { useTrainingData } from '@/hooks/useTrainingData';
import { Calendar, MessageSquare, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Audience } from '@/hooks/useTrainingData';

function getAudiencesDisplay(audiences: Audience[]): string {
  return audiences.map(a => a.value).join(', ');
}

export default function Home() {
  const {
    trainings,
    communications,
    addTraining,
    updateTraining,
    deleteTraining,
    addCommunication,
    updateCommunication,
    deleteCommunication,
    getGanttData,
  } = useTrainingData();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expandedTraining, setExpandedTraining] = useState<string | null>(null);
  const [filterAudience, setFilterAudience] = useState<Audience | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'trainings' | 'communications'>('all');

  const ganttData = getGanttData(currentMonth, currentYear, filterAudience || undefined, eventTypeFilter);

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const hotelOptions = ['Brasil', 'Hispânicos', 'NCA'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" style={{backgroundColor: '#fffcf0'}}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm" style={{backgroundColor: '#e4e8ca'}}>
        <div className="container mx-auto px-4 py-6" style={{backgroundColor: '#020075'}}>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-slate-900" style={{backgroundColor: '#a48484'}} />
            <h1 className="text-3xl font-bold text-slate-900" style={{fontSize: '25px'}}>
              Treinamento e Comunicações
            </h1>
          </div>
          <p className="text-slate-600">
            Plataforma de gestão de conteúdos, cronogramas e disparos de comunicação
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="gantt" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="gantt" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Cronograma
            </TabsTrigger>
            <TabsTrigger value="trainings" className="gap-2">
              <Calendar className="w-4 h-4" />
              Treinamentos
            </TabsTrigger>
            <TabsTrigger value="communications" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Comunicações
            </TabsTrigger>
          </TabsList>

          {/* Aba: Cronograma Gantt */}
          <TabsContent value="gantt" className="space-y-4">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro de Público */}
              <Card className="p-4 bg-white">
                <h3 className="font-semibold text-slate-900 mb-3">Filtrar por Público</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterAudience === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterAudience(null)}
                  >
                    Todos
                  </Button>
                  {hotelOptions.map((hotel) => (
                    <Button
                      key={hotel}
                      variant={
                        filterAudience?.type === 'hotel' && filterAudience?.value === hotel
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => setFilterAudience({ type: 'hotel', value: hotel })} style={{backgroundColor: '#fbc44b', backgroundColor: '#a0f08a', backgroundColor: '#e481dc', backgroundColor: '#fbc44b'}} style={{backgroundColor: '#d894eb'}} style={{backgroundColor: '#f3c053'}}
                    >
                      {hotel}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Filtro de Tipo de Evento */}
              <Card className="p-4 bg-white">
                <h3 className="font-semibold text-slate-900 mb-3">Filtrar por Tipo</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={eventTypeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEventTypeFilter('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={eventTypeFilter === 'trainings' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEventTypeFilter('trainings')}
                  >
                    Treinamentos
                  </Button>
                  <Button
                    variant={eventTypeFilter === 'communications' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEventTypeFilter('communications')}
                  >
                    Comunicações
                  </Button>
                </div>
              </Card>
            </div>

            <GanttChart
              ganttData={ganttData}
              month={currentMonth}
              year={currentYear}
              onMonthChange={handleMonthChange}
            />
          </TabsContent>

          {/* Aba: Treinamentos */}
          <TabsContent value="trainings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Treinamentos Cadastrados
              </h2>
              <TrainingForm onAdd={addTraining} />
            </div>

            <div className="grid gap-4">
              {trainings.length === 0 ? (
                <Card className="p-8 text-center text-slate-500">
                  Nenhum treinamento cadastrado. Clique em "Novo Treinamento" para começar.
                </Card>
              ) : (
                trainings.map((training) => (
                  <Card key={training.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">{training.name}</h3>
                            <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded">
                              {training.id}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              training.status === 'Confirmado' ? 'bg-green-100 text-green-700' :
                              training.status === 'Realizado' ? 'bg-blue-100 text-blue-700' :
                              training.status === 'Cancelado' ? 'bg-red-100 text-red-700' :
                              training.status === 'Adiado' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {training.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">
                            {training.trainingType} • {getAudiencesDisplay(training.audiences)}
                          </p>
                          <p className="text-sm text-slate-600">
                            📅 {training.date.toLocaleDateString('pt-BR')}
                            {training.facilitator && ` • 👤 ${training.facilitator}`}
                            {training.duration && ` • ⏱️ ${training.duration}`}
                          </p>
                          {training.description && (
                            <p className="text-sm text-slate-600 mt-2">{training.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <EditTrainingDialog
                            training={training}
                            onUpdate={updateTraining}
                            onDelete={deleteTraining}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedTraining(expandedTraining === training.id ? null : training.id)}
                          >
                            {expandedTraining === training.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {expandedTraining === training.id && (
                        <TrainingCommunications
                          training={training}
                          communications={communications}
                          onAddCommunication={addCommunication}
                          onDeleteCommunication={deleteCommunication}
                        />
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Aba: Comunicações */}
          <TabsContent value="communications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Comunicações Cadastradas
              </h2>
              <CommunicationForm onAdd={addCommunication} />
            </div>

            <div className="grid gap-4">
              {communications.length === 0 ? (
                <Card className="p-8 text-center text-slate-500">
                  Nenhuma comunicação cadastrada. Clique em "Nova Comunicação" para começar.
                </Card>
              ) : (
                communications.map((comm) => (
                  <Card key={comm.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{comm.subject}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {comm.communicationType} • {comm.channel} • {comm.date.toLocaleDateString('pt-BR')} • {getAudiencesDisplay(comm.audiences)}
                        </p>
                        <p className={`text-xs font-semibold mt-2 ${
                          comm.status === 'Enviado' ? 'text-green-600' :
                          comm.status === 'Cancelado' ? 'text-red-600' :
                          comm.status === 'Adiado' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {comm.status}
                        </p>
                        {comm.reinforcement && comm.reinforcementNames && (
                          <p className="text-xs text-orange-600 mt-1">🚀 Reforço: {comm.reinforcementNames}</p>
                        )}
                        {comm.trainingName && (
                          <p className="text-xs text-slate-500 mt-2">📌 Vinculado a: {comm.trainingName}</p>
                        )}
                        {comm.description && (
                          <p className="text-sm text-slate-600 mt-2">{comm.description}</p>
                        )}
                        {comm.recipientCount && (
                          <p className="text-xs text-slate-600 mt-2">👥 {comm.recipientCount} destinatários</p>
                        )}
                      </div>
                      <EditCommunicationDialog
                        communication={comm}
                        onUpdate={updateCommunication}
                        onDelete={deleteCommunication}
                      />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

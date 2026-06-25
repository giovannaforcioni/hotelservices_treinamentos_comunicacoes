import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AUDIENCE_COLORS = {
  BR: { bg: '#92D050', text: '#000000' },
  HISP: { bg: '#FCE4D6', text: '#833C0C' },
  NCA: { bg: '#EAD1DC', text: '#7030A0' },
  AMER: { bg: '#BDD7EE', text: '#1F3864' },
  ALL: { bg: '#D9D9D9', text: '#000000' },
};

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAY_NAMES = ['SEG', 'TER', 'QUAR', 'QUI', 'SEX', 'SÁB', 'DOM'];

interface GanttChartProps {
  ganttData: Map<string, Map<number, string>>;
  month: number;
  year: number;
  onMonthChange: (month: number, year: number) => void;
}

export function GanttChart({ ganttData, month, year, onMonthChange }: GanttChartProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(11, year - 1);
    } else {
      onMonthChange(month - 1, year);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(0, year + 1);
    } else {
      onMonthChange(month + 1, year);
    }
  };

  const rows = Array.from(ganttData.entries()).map(([key, days]) => {
    const [action, type] = key.split('|');
    return { action, type, days };
  });

  return (
    <div className="w-full space-y-4">
      {/* Cabeçalho com navegação de mês */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 rounded-lg" style={{backgroundColor: '#b0aba0'}}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-white">
          {MONTH_NAMES[month]} {year}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="text-white hover:bg-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabela Gantt */}
      <Card className="overflow-x-auto">
        <div className="min-w-full">
          {/* Cabeçalho de dias da semana */}
          <div className="flex border-b border-slate-200">
            <div className="w-56 min-w-56 bg-slate-50 border-r border-slate-200 p-3 font-semibold text-sm">
              AÇÃO
            </div>
            <div className="w-40 min-w-40 bg-slate-50 border-r border-slate-200 p-3 font-semibold text-sm">
              TIPO
            </div>
            <div className="flex flex-1">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = new Date(year, month, i + 1);
                const dayOfWeek = date.getDay();
                const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                return (
                  <div
                    key={i}
                    className="flex-1 min-w-12 bg-slate-900 border-r border-slate-300 text-center py-2"
                  >
                    <div className="text-xs text-slate-400 font-medium">
                      {DAY_NAMES[adjustedDay]}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linhas de dados */}
          {rows.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Nenhum evento cadastrado para este mês
            </div>
          ) : (
            rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex border-b border-slate-200 hover:bg-slate-50">
                <div className="w-56 min-w-56 bg-slate-50 border-r border-slate-200 p-3 text-sm font-semibold truncate">
                  {row.action}
                </div>
                <div className="w-40 min-w-40 bg-slate-50 border-r border-slate-200 p-3 text-xs font-medium text-slate-600 truncate">
                  {row.type}
                </div>
                <div className="flex flex-1">
                  {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                    const dayNum = dayIdx + 1;
                    const sigla = row.days.get(dayNum);
                    const isAlternate = rowIdx % 2 === 0;
                    
                    return (
                      <div
                        key={dayIdx}
                        className={`flex-1 min-w-12 border-r border-slate-200 p-1 flex items-center justify-center ${
                          isAlternate ? 'bg-white' : 'bg-slate-50'
                        }`}
                      >
                        {sigla && (
                          <div
                            className="px-2 py-1 rounded text-xs font-bold text-center"
                            style={{
                              backgroundColor: AUDIENCE_COLORS[sigla as keyof typeof AUDIENCE_COLORS]?.bg || '#D9D9D9',
                              color: AUDIENCE_COLORS[sigla as keyof typeof AUDIENCE_COLORS]?.text || '#000000',
                            }}
                          >
                            {sigla}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

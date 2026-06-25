import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Audience } from '@/hooks/useTrainingData';

interface MultiAudienceSelectorProps {
  value: Audience[];
  onChange: (audiences: Audience[]) => void;
}

export function MultiAudienceSelector({ value, onChange }: MultiAudienceSelectorProps) {
  const [sedeInput, setSedeInput] = useState('');

  const hotelOptions = ['Brasil', 'Hispânicos', 'NCA'];

  const toggleHotel = (hotel: string) => {
    const exists = value.some(a => a.type === 'hotel' && a.value === hotel);
    if (exists) {
      onChange(value.filter(a => !(a.type === 'hotel' && a.value === hotel)));
    } else {
      onChange([...value, { type: 'hotel', value: hotel }]);
    }
  };

  const addSede = () => {
    if (sedeInput.trim()) {
      onChange([...value, { type: 'sede', value: sedeInput.trim() }]);
      setSedeInput('');
    }
  };

  const removeSede = (name: string) => {
    onChange(value.filter(a => !(a.type === 'sede' && a.value === name)));
  };

  return (
    <div className="space-y-4">
      <Label>Públicos *</Label>

      {/* Hotéis */}
      <Card className="p-4 bg-slate-50">
        <h4 className="font-semibold text-sm text-slate-900 mb-3">Hotéis</h4>
        <div className="space-y-2">
          {hotelOptions.map((hotel) => (
            <div key={hotel} className="flex items-center gap-2">
              <Checkbox
                id={`hotel-${hotel}`}
                checked={value.some(a => a.type === 'hotel' && a.value === hotel)}
                onCheckedChange={() => toggleHotel(hotel)}
              />
              <label htmlFor={`hotel-${hotel}`} className="text-sm cursor-pointer">
                {hotel}
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Sede */}
      <Card className="p-4 bg-slate-50">
        <h4 className="font-semibold text-sm text-slate-900 mb-3">Sede</h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Nome da pessoa ou grupo"
              value={sedeInput}
              onChange={(e) => setSedeInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSede();
                }
              }}
            />
            <Button size="sm" onClick={addSede} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          {value.filter(a => a.type === 'sede').length > 0 && (
            <div className="space-y-2">
              {value
                .filter(a => a.type === 'sede')
                .map((sede) => (
                  <div key={sede.value} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                    <span className="text-sm text-slate-700">{sede.value}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSede(sede.value)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </Card>

      {/* Resumo */}
      {value.length > 0 && (
        <div className="p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Selecionados:</strong> {value.map(a => a.value).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Trash2 } from 'lucide-react';
import { MultiAudienceSelector } from './MultiAudienceSelector';
import type { Training, Audience } from '@/hooks/useTrainingData';

interface EditTrainingDialogProps {
  training: Training;
  onUpdate: (id: string, updates: Partial<Training>) => void;
  onDelete: (id: string) => void;
}

export function EditTrainingDialog({ training, onUpdate, onDelete }: EditTrainingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: training.name,
    trainingType: training.trainingType as any,
    customType: '',
    audiences: training.audiences,
    date: training.date.toISOString().split('T')[0],
    status: training.status,
    facilitator: training.facilitator || '',
    link: training.link || '',
    description: training.description || '',
    duration: training.duration || '',
    maxParticipants: training.maxParticipants?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trainingType = (formData.trainingType as string) === 'Outro' ? formData.customType : formData.trainingType;
    
    onUpdate(training.id, {
      name: formData.name,
      trainingType: trainingType as any,
      audiences: formData.audiences,
      date: new Date(formData.date),
      status: formData.status as any,
      facilitator: formData.facilitator || undefined,
      link: formData.link || undefined,
      description: formData.description || undefined,
      duration: formData.duration || undefined,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
    });
    setOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja apagar "${training.name}"?`)) {
      onDelete(training.id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Edit2 className="w-4 h-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Treinamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Treinamento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="trainingType">Tipo de Treinamento *</Label>
              <Select
                value={formData.trainingType}
                onValueChange={(value: any) => setFormData({ ...formData, trainingType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nova ferramenta">Nova ferramenta</SelectItem>
                  <SelectItem value="Reciclagem de ferramenta">Reciclagem de ferramenta</SelectItem>
                  <SelectItem value="Boas práticas">Boas práticas</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.trainingType as string) === 'Outro' && (
              <div className="col-span-2">
                <Label htmlFor="customType">Especifique o tipo *</Label>
                <Input
                  id="customType"
                  value={formData.customType}
                  onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                  placeholder="Ex: Compliance"
                />
              </div>
            )}

            <div className="col-span-2">
              <MultiAudienceSelector
                value={formData.audiences}
                onChange={(audiences) => setFormData({ ...formData, audiences })}
              />
            </div>

            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Realizado">Realizado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Adiado">Adiado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="facilitator">Facilitador</Label>
              <Input
                id="facilitator"
                value={formData.facilitator}
                onChange={(e) => setFormData({ ...formData, facilitator: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                placeholder="Ex: 2h, 1 dia"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="maxParticipants">Máx. Participantes</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="link">Link/Local</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="URL ou local do evento"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes adicionais sobre o treinamento"
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Apagar
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { MultiAudienceSelector } from './MultiAudienceSelector';
import type { Training, Audience } from '@/hooks/useTrainingData';

interface TrainingFormProps {
  onAdd: (training: Omit<Training, 'id'>) => void;
}

export function TrainingForm({ onAdd }: TrainingFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trainingType: 'Nova ferramenta' as const,
    customType: '',
    audiences: [] as Audience[],
    date: '',
    status: 'Planejado' as const,
    facilitator: '',
    link: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || formData.audiences.length === 0) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const trainingType = (formData.trainingType as string) === 'Outro' ? formData.customType : formData.trainingType;

    onAdd({
      name: formData.name,
      trainingType: trainingType as any,
      audiences: formData.audiences,
      date: new Date(formData.date),
      status: formData.status,
      facilitator: formData.facilitator || undefined,
      link: formData.link || undefined,
    });

    setFormData({
      name: '',
      trainingType: 'Nova ferramenta',
      customType: '',
      audiences: [],
      date: '',
      status: 'Planejado',
      facilitator: '',
      link: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Treinamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Treinamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Treinamento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: HCM, Sismaker"
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
            <div>
              <Label htmlFor="customType">Especifique o tipo *</Label>
              <Input
                id="customType"
                value={formData.customType}
                onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                placeholder="Ex: Compliance"
              />
            </div>
          )}

          <MultiAudienceSelector
            value={formData.audiences}
            onChange={(audiences) => setFormData({ ...formData, audiences })}
          />

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
              placeholder="Nome do facilitador"
            />
          </div>

          <div>
            <Label htmlFor="link">Link/Local</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="URL ou local do evento"
            />
          </div>

          <Button type="submit" className="w-full">
            Adicionar Treinamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

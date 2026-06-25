import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { MultiAudienceSelector } from './MultiAudienceSelector';
import type { Communication, Audience } from '@/hooks/useTrainingData';

interface CommunicationFormProps {
  onAdd: (communication: Omit<Communication, 'id'>) => void;
}

export function CommunicationForm({ onAdd }: CommunicationFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    trainingId: '',
    trainingName: '',
    communicationType: 'Convite/Save the Date' as const,
    customType: '',
    audiences: [] as Audience[],
    date: '',
    channel: 'E-mail' as const,
    status: 'Planejado' as const,
    subject: '',
    reinforcement: false,
    reinforcementNames: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.subject || formData.audiences.length === 0) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const commType = (formData.communicationType as string) === 'Outro' ? formData.customType : formData.communicationType;

    onAdd({
      trainingId: formData.trainingId || undefined,
      trainingName: formData.trainingName || undefined,
      communicationType: commType as any,
      audiences: formData.audiences,
      date: new Date(formData.date),
      channel: formData.channel,
      status: formData.status,
      subject: formData.subject,
      reinforcement: formData.reinforcement,
      reinforcementNames: formData.reinforcement ? formData.reinforcementNames : undefined,
    });

    setFormData({
      trainingId: '',
      trainingName: '',
      communicationType: 'Convite/Save the Date',
      customType: '',
      audiences: [],
      date: '',
      channel: 'E-mail',
      status: 'Planejado',
      subject: '',
      reinforcement: false,
      reinforcementNames: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Comunicação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Comunicação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="trainingName">Treinamento Relacionado (opcional)</Label>
            <Input
              id="trainingName"
              value={formData.trainingName}
              onChange={(e) => setFormData({ ...formData, trainingName: e.target.value })}
              placeholder="Ex: Sismaker"
            />
          </div>

          <div>
            <Label htmlFor="communicationType">Tipo de Comunicação *</Label>
            <Select
              value={formData.communicationType}
              onValueChange={(value: any) => setFormData({ ...formData, communicationType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Convite/Save the Date">Convite/Save the Date</SelectItem>
                <SelectItem value="Está chegando">Está chegando</SelectItem>
                <SelectItem value="Pós-treinamento">Pós-treinamento</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.communicationType as string) === 'Outro' && (
            <div>
              <Label htmlFor="customType">Especifique o tipo *</Label>
              <Input
                id="customType"
                value={formData.customType}
                onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                placeholder="Ex: Feedback, Pesquisa"
              />
            </div>
          )}

          <MultiAudienceSelector
            value={formData.audiences}
            onChange={(audiences) => setFormData({ ...formData, audiences })}
          />

          <div>
            <Label htmlFor="date">Data de Disparo *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="channel">Canal</Label>
            <Select value={formData.channel} onValueChange={(value: any) => setFormData({ ...formData, channel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="E-mail">E-mail</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="LMS">LMS</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planejado">Planejado</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Adiado">Adiado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Assunto/Título *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Assunto da comunicação"
            />
          </div>

          {/* Reforço de Comunicação */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Checkbox
                id="reinforcement"
                checked={formData.reinforcement}
                onCheckedChange={(checked) => setFormData({ ...formData, reinforcement: checked as boolean })}
              />
              <Label htmlFor="reinforcement" className="cursor-pointer">
                Precisa de reforço de comunicação?
              </Label>
            </div>

            {formData.reinforcement && (
              <div>
                <Label htmlFor="reinforcementNames">Nomes das pessoas para escalar *</Label>
                <Input
                  id="reinforcementNames"
                  value={formData.reinforcementNames}
                  onChange={(e) => setFormData({ ...formData, reinforcementNames: e.target.value })}
                  placeholder="Ex: João, Maria, Carlos"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Adicionar Comunicação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

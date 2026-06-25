import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { MultiAudienceSelector } from './MultiAudienceSelector';
import type { Training, Communication, Audience } from '@/hooks/useTrainingData';

interface TrainingCommunicationsProps {
  training: Training;
  communications: Communication[];
  onAddCommunication: (comm: Omit<Communication, 'id'>) => void;
  onDeleteCommunication: (id: string) => void;
}

export function TrainingCommunications({
  training,
  communications,
  onAddCommunication,
  onDeleteCommunication,
}: TrainingCommunicationsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    communicationType: 'Convite/Save the Date' as const,
    customType: '',
    audiences: [] as Audience[],
    date: '',
    channel: 'E-mail' as const,
    status: 'Planejado' as const,
    subject: '',
    description: '',
    recipientCount: '',
    reinforcement: false,
    reinforcementNames: '',
  });

  const trainingCommunications = communications.filter(
    (c) => c.trainingId === training.id || c.trainingName === training.name
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.subject || formData.audiences.length === 0) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const commType = (formData.communicationType as string) === 'Outro' ? formData.customType : formData.communicationType;

    onAddCommunication({
      trainingId: training.id,
      trainingName: training.name,
      communicationType: commType as any,
      audiences: formData.audiences,
      date: new Date(formData.date),
      channel: formData.channel,
      status: formData.status,
      subject: formData.subject,
      description: formData.description || undefined,
      recipientCount: formData.recipientCount ? parseInt(formData.recipientCount) : undefined,
      reinforcement: formData.reinforcement,
      reinforcementNames: formData.reinforcement ? formData.reinforcementNames : undefined,
    });

    setFormData({
      communicationType: 'Convite/Save the Date',
      customType: '',
      audiences: [],
      date: '',
      channel: 'E-mail',
      status: 'Planejado',
      subject: '',
      description: '',
      recipientCount: '',
      reinforcement: false,
      reinforcementNames: '',
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900">
          Comunicações ({trainingCommunications.length})
        </h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Comunicação
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-slate-50 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Ex: Feedback"
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
              <Select
                value={formData.channel}
                onValueChange={(value: any) => setFormData({ ...formData, channel: value })}
              >
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
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
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

            {/* Reforço */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="reinforcement"
                  checked={formData.reinforcement}
                  onCheckedChange={(checked) => setFormData({ ...formData, reinforcement: checked as boolean })}
                />
                <Label htmlFor="reinforcement" className="cursor-pointer text-sm">
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
                    placeholder="Ex: João, Maria"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Salvar Comunicação
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {trainingCommunications.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhuma comunicação cadastrada para este treinamento</p>
      ) : (
        <div className="space-y-2">
          {trainingCommunications.map((comm) => (
            <Card key={comm.id} className="p-3 bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-900">{comm.subject}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {comm.communicationType} • {comm.channel} • {comm.date.toLocaleDateString('pt-BR')} • {comm.status}
                  </p>
                  {comm.reinforcement && comm.reinforcementNames && (
                    <p className="text-xs text-orange-600 mt-1">🚀 Reforço: {comm.reinforcementNames}</p>
                  )}
                  {comm.description && (
                    <p className="text-xs text-slate-600 mt-2">{comm.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteCommunication(comm.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

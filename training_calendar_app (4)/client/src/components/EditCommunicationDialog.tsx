import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiAudienceSelector } from './MultiAudienceSelector';
import type { Communication, Audience } from '@/hooks/useTrainingData';

interface EditCommunicationDialogProps {
  communication: Communication;
  onUpdate: (id: string, updates: Partial<Communication>) => void;
  onDelete: (id: string) => void;
}

export function EditCommunicationDialog({ communication, onUpdate, onDelete }: EditCommunicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    trainingName: communication.trainingName || '',
    communicationType: communication.communicationType as any,
    customType: '',
    audiences: communication.audiences,
    date: communication.date.toISOString().split('T')[0],
    channel: communication.channel,
    status: communication.status,
    subject: communication.subject || '',
    description: communication.description || '',
    recipientCount: communication.recipientCount?.toString() || '',
    reinforcement: communication.reinforcement || false,
    reinforcementNames: communication.reinforcementNames || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commType = (formData.communicationType as string) === 'Outro' ? formData.customType : formData.communicationType;
    
    onUpdate(communication.id, {
      trainingName: formData.trainingName || undefined,
      communicationType: commType as any,
      audiences: formData.audiences,
      date: new Date(formData.date),
      channel: formData.channel as any,
      status: formData.status as any,
      subject: formData.subject || undefined,
      description: formData.description || undefined,
      recipientCount: formData.recipientCount ? parseInt(formData.recipientCount) : undefined,
      reinforcement: formData.reinforcement,
      reinforcementNames: formData.reinforcement ? formData.reinforcementNames : undefined,
    });
    setOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja apagar esta comunicação?`)) {
      onDelete(communication.id);
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
          <DialogTitle>Editar Comunicação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trainingName">Treinamento Relacionado</Label>
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
              <div className="col-span-2">
                <Label htmlFor="customType">Especifique o tipo *</Label>
                <Input
                  id="customType"
                  value={formData.customType}
                  onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                  placeholder="Ex: Feedback, Pesquisa"
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

            <div className="col-span-2">
              <Label htmlFor="subject">Assunto/Título *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Assunto da comunicação"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes adicionais sobre a comunicação"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="recipientCount">Quantidade de Destinatários</Label>
              <Input
                id="recipientCount"
                type="number"
                value={formData.recipientCount}
                onChange={(e) => setFormData({ ...formData, recipientCount: e.target.value })}
              />
            </div>

            {/* Reforço */}
            <div className="col-span-2 space-y-2 pt-2 border-t border-slate-200">
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

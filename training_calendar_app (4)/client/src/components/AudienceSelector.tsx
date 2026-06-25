import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Audience } from '@/hooks/useTrainingData';

interface AudienceSelectorProps {
  value: Audience;
  onChange: (audience: Audience) => void;
}

export function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Público</Label>
      <Tabs
        value={value.type}
        onValueChange={(type: any) => {
          if (type === 'hotel') {
            onChange({ type: 'hotel', value: 'Brasil' });
          } else {
            onChange({ type: 'sede', value: '' });
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hotel">Hotéis</TabsTrigger>
          <TabsTrigger value="sede">Sede</TabsTrigger>
        </TabsList>

        <TabsContent value="hotel" className="mt-3">
          <Select
            value={value.type === 'hotel' ? value.value : 'Brasil'}
            onValueChange={(val) => onChange({ type: 'hotel', value: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Brasil">Brasil</SelectItem>
              <SelectItem value="Hispânicos">Hispânicos</SelectItem>
              <SelectItem value="NCA">NCA</SelectItem>
              <SelectItem value="Americas">Americas</SelectItem>
            </SelectContent>
          </Select>
        </TabsContent>

        <TabsContent value="sede" className="mt-3">
          <Input
            placeholder="Digite o nome da pessoa ou grupo"
            value={value.type === 'sede' ? value.value : ''}
            onChange={(e) => onChange({ type: 'sede', value: e.target.value })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

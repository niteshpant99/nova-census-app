// src/components/census/ReviewScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type CensusFormData, calculateTotals } from '@/lib/schemas/census';

interface ReviewScreenProps {
  data: CensusFormData;
  onEdit: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ReviewScreen({ data, onEdit, onSubmit, isLoading }: ReviewScreenProps) {
  const { total_transfers_in, total_transfers_out, current_patients } = calculateTotals(data);

  // Generate WhatsApp message preview
  const whatsappMessage = `${data.department} Census Update ${data.date.toLocaleDateString()}
Previous Patients: ${data.previous_patients}
Transfers In: ${total_transfers_in}
- Referrals: ${data.referrals_in}
- Dept Transfers: ${data.department_transfers_in}
- Admissions: ${data.admissions}
Transfers Out: ${total_transfers_out}
- Recovered: ${data.recovered}
- LAMA: ${data.lama}
- Absconded: ${data.absconded}
- Referred Out: ${data.referred_out}
- Not Improved: ${data.not_improved}
- Deaths: ${data.deaths}
Current Patients: ${current_patients}
OT Cases: ${data.ot_cases}`;

  return (
    <div className="space-y-6 p-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Review Census Data</h2>
        
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground">Date</span>
            <p className="font-medium">{data.date.toLocaleDateString()}</p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Department</span>
            <p className="font-medium">{data.department}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Patient Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>Previous patients:</span>
              <span className="text-right">{data.previous_patients}</span>
              <span>Total transfers in:</span>
              <span className="text-right">{total_transfers_in}</span>
              <span>Total transfers out:</span>
              <span className="text-right">{total_transfers_out}</span>
              <span className="font-medium">Current patients:</span>
              <span className="font-medium text-right">{current_patients}</span>
              <span>OT Cases:</span>
              <span className="text-right">{data.ot_cases}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">WhatsApp Message Preview</h3>
            <ScrollArea className="h-48 rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap">{whatsappMessage}</pre>
            </ScrollArea>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full" 
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? "Submitting..." : "Confirm & Submit"}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onEdit}
          disabled={isLoading}
        >
          Edit Data
        </Button>
      </div>
    </div>
  );
}
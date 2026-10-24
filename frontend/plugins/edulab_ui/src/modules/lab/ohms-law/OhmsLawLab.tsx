import { useMemo, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button, Label, Slider } from 'erxes-ui';
import { LabWorkbench } from '@/lab/LabWorkbench';
import { ILabDefinition, LabMeasurement } from '@/lab/types';
import {
  RESISTANCE_RANGE,
  VOLTAGE_RANGE,
  readAmmeter,
} from '@/lab/ohms-law/ohmsLaw';
import { OhmsLawCircuit } from '@/lab/ohms-law/OhmsLawCircuit';
import { OhmsLawChart } from '@/lab/ohms-law/OhmsLawChart';

const OhmsLawSimulation = ({
  measurements,
  onChange,
}: {
  measurements: LabMeasurement[];
  onChange: (measurements: LabMeasurement[]) => void;
}) => {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(3);
  const current = useMemo(
    () => readAmmeter(voltage, resistance),
    [voltage, resistance],
  );

  return (
    <LabWorkbench
      lab={ohmsLawLab}
      measurements={measurements}
      onChange={onChange}
      apparatus={
        <>
          <div className="flex items-center justify-center">
            <OhmsLawCircuit
              voltage={voltage}
              resistance={resistance}
              current={current}
            />
          </div>
          <div className="flex flex-col gap-6 justify-center">
            <div className="flex flex-col gap-3">
              <Label>Хүчдэл U: {voltage} В</Label>
              <Slider
                min={VOLTAGE_RANGE.min}
                max={VOLTAGE_RANGE.max}
                step={VOLTAGE_RANGE.step}
                value={[voltage]}
                onValueChange={([value]) => setVoltage(value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Эсэргүүцэл R: {resistance} Ом</Label>
              <Slider
                min={RESISTANCE_RANGE.min}
                max={RESISTANCE_RANGE.max}
                step={RESISTANCE_RANGE.step}
                value={[resistance]}
                onValueChange={([value]) => setResistance(value)}
              />
            </div>
            <div className="rounded-md border bg-accent p-4">
              <p className="text-xs text-muted-foreground">Амперметрийн заалт</p>
              <p className="text-3xl font-semibold tabular-nums">
                {current.toFixed(2)} А
              </p>
            </div>
            <Button
              type="button"
              onClick={() =>
                onChange([...measurements, { voltage, resistance, current }])
              }
            >
              <IconPlus />
              Хэмжилт хадгалах
            </Button>
          </div>
        </>
      }
    />
  );
};

export const ohmsLawLab: ILabDefinition = {
  key: 'ohmsLaw',
  label: 'Омын хууль (цахилгаан хэлхээ)',
  variables: [
    { key: 'voltage', label: 'U', unit: 'В', digits: 1 },
    { key: 'resistance', label: 'R', unit: 'Ом', digits: 0 },
    { key: 'current', label: 'I', unit: 'А', digits: 2 },
  ],
  Simulation: OhmsLawSimulation,
  Chart: OhmsLawChart,
  hint: 'U болон R-ийг өөрчилж, "Хэмжилт хадгалах" товчийг дарна уу. Хамгийн багадаа 3 хэмжилт хийхийг зөвлөж байна.',
};

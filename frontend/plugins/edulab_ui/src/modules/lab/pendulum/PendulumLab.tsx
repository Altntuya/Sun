import { useState } from 'react';
import { IconPlus, IconStopwatch } from '@tabler/icons-react';
import { Button, Label, Slider } from 'erxes-ui';
import { LabWorkbench } from '@/lab/LabWorkbench';
import { ILabDefinition, LabMeasurement } from '@/lab/types';
import {
  LENGTH_RANGE,
  MASS_RANGE,
  SWINGS_TIMED,
  timeSwings,
} from '@/lab/pendulum/pendulum';
import { PendulumApparatus } from '@/lab/pendulum/PendulumApparatus';
import { PendulumChart } from '@/lab/pendulum/PendulumChart';

const PendulumSimulation = ({
  measurements,
  onChange,
}: {
  measurements: LabMeasurement[];
  onChange: (measurements: LabMeasurement[]) => void;
}) => {
  const [length, setLength] = useState(1);
  const [mass, setMass] = useState(0.2);
  const [timing, setTiming] = useState<{ total: number; period: number }>();

  // Changing the setup invalidates the last stopwatch reading.
  const changeLength = (value: number) => {
    setLength(value);
    setTiming(undefined);
  };
  const changeMass = (value: number) => {
    setMass(value);
    setTiming(undefined);
  };

  const record = () => {
    if (!timing) {
      return;
    }

    onChange([...measurements, { length, mass, period: timing.period }]);
    setTiming(undefined);
  };

  return (
    <LabWorkbench
      lab={pendulumLab}
      measurements={measurements}
      onChange={onChange}
      apparatus={
        <>
          <div className="flex items-center justify-center">
            <PendulumApparatus length={length} mass={mass} />
          </div>
          <div className="flex flex-col gap-6 justify-center">
            <div className="flex flex-col gap-3">
              <Label>Утасны урт L: {length.toFixed(1)} м</Label>
              <Slider
                min={LENGTH_RANGE.min}
                max={LENGTH_RANGE.max}
                step={LENGTH_RANGE.step}
                value={[length]}
                onValueChange={([value]) => changeLength(value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Бөмбөлгийн масс m: {mass.toFixed(2)} кг</Label>
              <Slider
                min={MASS_RANGE.min}
                max={MASS_RANGE.max}
                step={MASS_RANGE.step}
                value={[mass]}
                onValueChange={([value]) => changeMass(value)}
              />
            </div>
            <div className="rounded-md border bg-accent p-4">
              <p className="text-xs text-muted-foreground">
                Секундомер ({SWINGS_TIMED} бүтэн хэлбэлзэл)
              </p>
              <p className="text-3xl font-semibold tabular-nums">
                {timing ? `${timing.total.toFixed(2)} с` : '—'}
              </p>
              <p className="text-sm text-muted-foreground tabular-nums">
                {timing
                  ? `Нэг хэлбэлзлийн үе T = ${timing.period.toFixed(2)} с`
                  : 'Хэмжилт хийгээгүй'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTiming(timeSwings(length))}
              >
                <IconStopwatch />
                Хугацаа хэмжих
              </Button>
              <Button type="button" onClick={record} disabled={!timing}>
                <IconPlus />
                Хадгалах
              </Button>
            </div>
          </div>
        </>
      }
    />
  );
};

export const pendulumLab: ILabDefinition = {
  key: 'pendulum',
  label: 'Математик дүүжин (хэлбэлзлийн үе)',
  variables: [
    { key: 'length', label: 'L', unit: 'м', digits: 1 },
    { key: 'mass', label: 'm', unit: 'кг', digits: 2 },
    { key: 'period', label: 'T', unit: 'с', digits: 2 },
  ],
  Simulation: PendulumSimulation,
  Chart: PendulumChart,
  hint: 'Урт эсвэл массыг тохируулаад "Хугацаа хэмжих", дараа нь "Хадгалах" дарна уу. Уртыг болон массыг тус тусад нь өөрчилж үзээрэй.',
};

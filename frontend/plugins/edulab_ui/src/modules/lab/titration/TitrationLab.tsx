import { useMemo, useRef, useState } from 'react';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconDeviceFloppy,
  IconRefresh,
} from '@tabler/icons-react';
import { Badge, Button, Label, Select, Slider, cn } from 'erxes-ui';
import { LabWorkbench } from '@/lab/LabWorkbench';
import { ILabDefinition, LabMeasurement } from '@/lab/types';
import {
  ACID_VOLUMES,
  BASE_CONCENTRATION,
  BURETTE_CAPACITY,
  COARSE,
  FINE,
  NEAR_ENDPOINT_PH,
  PINK_FROM_PH,
  curveUpTo,
  equivalenceVolume,
  indicatorColor,
  randomAcidConcentration,
  roundVolume,
  solutionPh,
} from '@/lab/titration/titration';
import { TitrationApparatus } from '@/lab/titration/TitrationApparatus';
import { TitrationChart } from '@/lab/titration/TitrationChart';
import { TitrationCurve } from '@/lab/titration/TitrationCurve';

const HINT_STYLES = {
  info: 'border-border bg-accent/50 text-muted-foreground',
  warning: 'border-warning/40 bg-warning/10 text-warning',
  success: 'border-success/40 bg-success/10 text-success',
  danger: 'border-destructive/40 bg-destructive/10 text-destructive',
};

// Tells the student which slider to move next.
const getHint = (ph: number, faint: boolean) => {
  if (ph < NEAR_ENDPOINT_PH) {
    return {
      tone: 'info' as const,
      icon: IconArrowRight,
      text: '«Ерөнхий» slider-ийг баруун тийш гүйлгэж NaOH нэм.',
    };
  }

  if (ph < PINK_FROM_PH) {
    return {
      tone: 'warning' as const,
      icon: IconAlertTriangle,
      text: 'Эквивалент цэгт ойртлоо — одоо «Нарийн» slider-ийг дусал дуслаар баруун тийш гүйлгэ.',
    };
  }

  if (faint) {
    return {
      tone: 'success' as const,
      icon: IconCircleCheck,
      text: 'Цайвар ягаан боллоо — эквивалент цэг олдлоо. «Туршилт хадгалах» дар.',
    };
  }

  return {
    tone: 'danger' as const,
    icon: IconArrowLeft,
    text: 'Хэтэрсэн (тод ягаан) — «Нарийн» slider-ийг зүүн тийш буцааж цайвар ягааныг ол.',
  };
};

const TitrationSimulation = ({
  measurements,
  onChange,
}: {
  measurements: LabMeasurement[];
  onChange: (measurements: LabMeasurement[]) => void;
}) => {
  // Hidden from the student: the concentration they have to determine.
  const [acidConcentration] = useState(randomAcidConcentration);
  const [acidVolume, setAcidVolume] = useState(20);
  const [coarse, setCoarse] = useState(0);
  const [fine, setFine] = useState(0);
  const [dropKey, setDropKey] = useState(0);
  const lastVolume = useRef(0);

  const baseVolume = roundVolume(
    Math.min(Math.max(coarse + fine, 0), BURETTE_CAPACITY),
  );
  const ph = solutionPh(acidConcentration, acidVolume, baseVolume);
  const overshoot = roundVolume(
    Math.max(baseVolume - equivalenceVolume(acidConcentration, acidVolume), 0),
  );
  const color = indicatorColor(ph, overshoot);
  const hint = getHint(ph, color.faint);
  const curve = useMemo(
    () => curveUpTo(acidConcentration, acidVolume, baseVolume),
    [acidConcentration, acidVolume, baseVolume],
  );

  // A drop falls whenever the sliders add base.
  const setVolumes = (nextCoarse: number, nextFine: number) => {
    const next = roundVolume(nextCoarse + nextFine);

    if (next > lastVolume.current) {
      setDropKey((key) => key + 1);
    }

    lastVolume.current = next;
    setCoarse(nextCoarse);
    setFine(nextFine);
  };

  const resetTrial = (volume = acidVolume) => {
    setAcidVolume(volume);
    lastVolume.current = 0;
    setCoarse(0);
    setFine(0);
  };

  const record = () => {
    onChange([
      ...measurements,
      {
        acidVolume,
        baseConcentration: BASE_CONCENTRATION,
        baseVolume,
        overshoot,
        finalPh: Math.round(ph * 100) / 100,
      },
    ]);
    resetTrial();
  };

  return (
    <LabWorkbench
      lab={titrationLab}
      measurements={measurements}
      onChange={onChange}
      apparatus={
        <>
          <div className="flex flex-col items-center gap-3">
            <TitrationApparatus
              baseVolume={baseVolume}
              acidVolume={acidVolume}
              ph={ph}
              fill={color.fill}
              dropKey={dropKey}
            />
            <TitrationCurve points={curve} />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Колбонд хийх HCl (концентраци тодорхойгүй)</Label>
              <Select
                value={String(acidVolume)}
                onValueChange={(value) => resetTrial(Number(value))}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {ACID_VOLUMES.map((volume) => (
                    <Select.Item key={volume} value={String(volume)}>
                      {volume} мл HCl + 2 дусал фенолфталеин
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
              <p className="text-xs text-muted-foreground">
                Бюретканд {BASE_CONCENTRATION} моль/л NaOH байна.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border bg-accent p-3">
                <p className="text-xs text-muted-foreground">Бюреткийн заалт</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {baseVolume.toFixed(2)} мл
                </p>
              </div>
              <div className="rounded-md border bg-accent p-3">
                <p className="text-xs text-muted-foreground">pH-метр</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {ph.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-md border p-4">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <Label>1. Ерөнхий — ойртох</Label>
                  <span className="tabular-nums text-muted-foreground">
                    {coarse.toFixed(1)} мл
                  </span>
                </div>
                <Slider
                  min={COARSE.min}
                  max={COARSE.max}
                  step={COARSE.step}
                  value={[coarse]}
                  onValueChange={([value]) => setVolumes(value, fine)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <Label>2. Нарийн — дусал дуслаар (1 алхам = 1 дусал)</Label>
                  <span className="tabular-nums text-muted-foreground">
                    {fine > 0 ? '+' : ''}
                    {fine.toFixed(2)} мл
                  </span>
                </div>
                <Slider
                  min={FINE.min}
                  max={FINE.max}
                  step={FINE.step}
                  value={[fine]}
                  onValueChange={([value]) => setVolumes(coarse, value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              Уусмалын өнгө:
              <Badge variant="secondary">{color.label}</Badge>
            </div>
            <div
              className={cn(
                'flex items-start gap-2 rounded-md border p-3 text-sm',
                HINT_STYLES[hint.tone],
              )}
            >
              <hint.icon size={18} className="mt-0.5 shrink-0" />
              {hint.text}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => resetTrial()}
              >
                <IconRefresh />
                Шинэ туршилт
              </Button>
              <Button type="button" onClick={record} disabled={!baseVolume}>
                <IconDeviceFloppy />
                Туршилт хадгалах
              </Button>
            </div>
          </div>
        </>
      }
    />
  );
};

export const titrationLab: ILabDefinition = {
  key: 'titration',
  label: 'Хүчил-шүлтийн титрлэлт (HCl + NaOH)',
  variables: [
    { key: 'acidVolume', label: 'V(HCl)', unit: 'мл', digits: 0 },
    { key: 'baseConcentration', label: 'C(NaOH)', unit: 'моль/л', digits: 2 },
    { key: 'baseVolume', label: 'V(NaOH)', unit: 'мл', digits: 2 },
    { key: 'overshoot', label: 'Хэтрүүлсэн', unit: 'мл', digits: 2 },
    { key: 'finalPh', label: 'pH', unit: '', digits: 2 },
  ],
  Simulation: TitrationSimulation,
  Chart: TitrationChart,
  hint: '«Ерөнхий» slider-аар эквивалент цэгт ойртоод, «Нарийн» slider-аар дусал дуслаар нэмж уусмал цайвар ягаан болмогц «Туршилт хадгалах» дарна уу. Дор хаяж 2–3 удаа давтаарай.',
};

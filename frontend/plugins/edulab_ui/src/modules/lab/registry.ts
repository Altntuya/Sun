import { ohmsLawLab } from '@/lab/ohms-law/OhmsLawLab';
import { pendulumLab } from '@/lab/pendulum/PendulumLab';
import { titrationLab } from '@/lab/titration/TitrationLab';
import { ILabDefinition } from '@/lab/types';

// A new simulation is one folder under lab/ plus an entry here, and the
// matching definition in edulab_api's lab registry.
export const LABS: ILabDefinition[] = [ohmsLawLab, pendulumLab, titrationLab];

export const getLab = (key?: string) => LABS.find((lab) => lab.key === key);

export const getLabLabel = (key?: string) => getLab(key)?.label ?? '';

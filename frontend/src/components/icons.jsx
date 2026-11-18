import { Droplets, Hammer, Paintbrush, Sparkles, WashingMachine, Wrench, Zap } from 'lucide-react';

const SERVICE_ICONS = {
  'Electrical Repair': Zap,
  Plumbing: Droplets,
  'Appliance Repair': WashingMachine,
  Carpentry: Hammer,
  Painting: Paintbrush,
  Cleaning: Sparkles,
};

export function ServiceIcon({ name, size = 20 }) {
  const Icon = SERVICE_ICONS[name] ?? Wrench;
  return <Icon size={size} aria-hidden="true" />;
}

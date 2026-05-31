'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Plus, Trash2, TrendingDown, TrendingUp, Minus, AlertCircle } from 'lucide-react';
import type { WeightLog } from '@/types';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function LogForm({ onAdd }: { onAdd: (log: WeightLog) => void }) {
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    onAdd({
      id: uuidv4(),
      date,
      weight: parseFloat(weight),
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      note: note || undefined,
      mood: mood as 1 | 2 | 3 | 4 | 5,
      energy: energy as 1 | 2 | 3 | 4 | 5,
    });
    setWeight('');
    setWaist('');
    setHips('');
    setNote('');
  };

  const EmojiPicker = ({ value, onChange, emojis }: { value: number; onChange: (v: number) => void; emojis: string[] }) => (
    <div className="flex gap-1">
      {emojis.map((e, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`text-xl p-1.5 rounded-lg transition-colors ${value === i + 1 ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
          {e}
        </button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>Zaznamenat vážení</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Datum" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input label="Váha (kg) *" type="number" step="0.1" min={30} max={300} placeholder="80.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Obvod pasu (cm)" type="number" step="0.5" placeholder="nepovinné" value={waist} onChange={(e) => setWaist(e.target.value)} />
            <Input label="Obvod boků (cm)" type="number" step="0.5" placeholder="nepovinné" value={hips} onChange={(e) => setHips(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nálada</label>
            <EmojiPicker value={mood} onChange={setMood} emojis={['😞', '😕', '😐', '🙂', '😄']} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Energie</label>
            <EmojiPicker value={energy} onChange={setEnergy} emojis={['🪫', '😴', '⚡', '🔥', '💥']} />
          </div>
          <Input label="Poznámka" placeholder="Jak se cítíš?" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button type="submit" fullWidth disabled={!weight}>
            <Plus size={16} /> Uložit záznam
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-3 border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="font-bold text-slate-900 dark:text-slate-100">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
};

export function WeightTrackerView() {
  const { profile, weightLogs, addWeightLog, deleteWeightLog } = useAppStore();

  if (!profile) return null;

  const sortedLogs = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
  const first = sortedLogs[0];
  const last = sortedLogs[sortedLogs.length - 1];
  const change = last && first ? last.weight - first.weight : 0;
  const toGoal = last ? last.weight - profile.targetWeight : profile.weight - profile.targetWeight;

  const chartData = sortedLogs.map((log) => ({
    date: log.date.slice(5),
    weight: log.weight,
  }));

  const minWeight = Math.min(...sortedLogs.map((l) => l.weight), profile.targetWeight) - 1;
  const maxWeight = Math.max(...sortedLogs.map((l) => l.weight), profile.weight) + 1;

  const weeklyAvgs = (() => {
    if (sortedLogs.length < 2) return null;
    const weeks: Record<string, number[]> = {};
    sortedLogs.forEach((log) => {
      const d = new Date(log.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      if (!weeks[key]) weeks[key] = [];
      weeks[key].push(log.weight);
    });
    return Object.entries(weeks).map(([date, weights]) => ({
      date: date.slice(5),
      avg: Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10,
    }));
  })();

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sledování váhy</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {last?.weight ?? profile.weight} kg
            </div>
            <div className="text-xs text-slate-500">Aktuální váha</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className={`text-xl font-bold flex items-center justify-center gap-1 ${change < 0 ? 'text-green-600' : change > 0 ? 'text-red-500' : 'text-slate-500'}`}>
              {change < 0 ? <TrendingDown size={18} /> : change > 0 ? <TrendingUp size={18} /> : <Minus size={18} />}
              {Math.abs(change).toFixed(1)} kg
            </div>
            <div className="text-xs text-slate-500">Celková změna</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className={`text-xl font-bold ${toGoal > 0 ? 'text-orange-500' : 'text-green-600'}`}>
              {toGoal > 0 ? `-${toGoal.toFixed(1)}` : '✓'} kg
            </div>
            <div className="text-xs text-slate-500">Do cíle</div>
          </CardContent>
        </Card>
      </div>

      {/* Warning about fluctuations */}
      <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <span>Váha přirozeně kolísá až o 2–3 kg vlivem vody, soli, sacharidů, menstruace nebo spánku. Sleduj týdenní průměr, ne denní výkyvy.</span>
      </div>

      {/* Chart */}
      {sortedLogs.length >= 2 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Vývoj váhy</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[minWeight, maxWeight]} tick={{ fontSize: 11, fill: '#94a3b8' }} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={profile.targetWeight} stroke="#22c55e" strokeDasharray="4 4" label={{ value: `Cíl ${profile.targetWeight}kg`, fill: '#22c55e', fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Log form */}
      <LogForm onAdd={addWeightLog} />

      {/* History */}
      {sortedLogs.length > 0 && (
        <Card>
          <CardHeader className="p-4"><CardTitle>Historie vážení</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {[...sortedLogs].reverse().map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{log.weight} kg</span>
                    {log.mood && <span title="Nálada">{['😞', '😕', '😐', '🙂', '😄'][log.mood - 1]}</span>}
                    {log.energy && <span title="Energie">{['🪫', '😴', '⚡', '🔥', '💥'][log.energy - 1]}</span>}
                  </div>
                  <div className="text-xs text-slate-500">{formatDate(log.date)}</div>
                  {log.waist && <div className="text-xs text-slate-500">Pas: {log.waist}cm {log.hips ? `| Boky: ${log.hips}cm` : ''}</div>}
                  {log.note && <div className="text-xs text-slate-500 italic">"{log.note}"</div>}
                </div>
                <button
                  onClick={() => deleteWeightLog(log.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

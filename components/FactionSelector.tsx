

import React from 'react';
import { ResearchMandate } from '../types';
import { RESEARCH_MANDATES } from '../constants';

interface FactionSelectorProps {
  selectedFaction: ResearchMandate | null;
  onSelectFaction: (faction: ResearchMandate) => void;
  disabled: boolean;
}

// Fix: Define props interface and type component as React.FC to handle 'key' prop correctly.
interface FactionCardProps {
  faction: ResearchMandate;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

const FactionCard: React.FC<FactionCardProps> = ({ faction, isSelected, onSelect, disabled }) => {
  const Icon = faction.icon;
  return (
    <div
      onClick={() => !disabled && onSelect()}
      className={`p-4 border rounded-lg transition-all duration-300 ${
        isSelected
          ? 'border-brand-teal bg-teal-50 ring-2 ring-brand-teal shadow-lg'
          : 'border-slate-300 bg-white hover:border-slate-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center mb-2">
        <Icon className="w-8 h-8 mr-3 text-brand-teal" />
        <h3 className="text-lg font-bold text-slate-900">{faction.name}</h3>
      </div>
      <p className="text-sm text-slate-500 font-mono mb-2">
        <strong>Focus:</strong> {faction.focus}
      </p>
      <p className="text-sm text-slate-600">{faction.philosophy}</p>
    </div>
  );
};

export const FactionSelector = ({ selectedFaction, onSelectFaction, disabled }: FactionSelectorProps) => {
  return (
    <div id="tour-step-1">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Select a Research Mandate</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESEARCH_MANDATES.map((faction) => (
          <FactionCard
            key={faction.id}
            faction={faction}
            isSelected={selectedFaction?.id === faction.id}
            onSelect={() => onSelectFaction(faction)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
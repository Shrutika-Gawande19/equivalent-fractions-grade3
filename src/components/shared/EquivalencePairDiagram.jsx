import React from 'react';
import { FractionBarDiagram } from './FractionBarDiagram';

export const EquivalencePairDiagram = ({ fractionA, fractionB }) => (
  <div className="flex gap-4 items-center justify-center">
    <div className="w-40"><FractionBarDiagram {...fractionA} /></div>
    <span className="text-3xl font-bold text-white">=</span>
    <div className="w-40"><FractionBarDiagram {...fractionB} /></div>
  </div>
);

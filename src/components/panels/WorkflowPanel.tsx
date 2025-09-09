// chemin: vscript_call/src/components/panels/WorkflowPanel.tsx

import React, { useState } from 'react';
import { Plus, Play, Settings, Zap } from 'lucide-react';
// import { WorkflowRule } from '../../types';

// Temporairement, on utilise un type simplifié en attendant la connexion à l'état global
interface WorkflowRule {
    id: string;
    name: string;
    trigger: { type: string };
    actions: any[];
}


interface WorkflowPanelProps {
  // Props à définir
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = () => {
    // État local temporaire pour l'exemple
    const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>([]);

    return (
        <div className="space-y-4">
            <button
                onClick={() => alert("Ajouter un workflow")}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus size={18} />
                <span>Nouveau Workflow</span>
            </button>

            <div className="space-y-2">
                {workflowRules.map(rule => (
                <div key={rule.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-slate-900">{rule.name}</h5>
                    <div className="flex space-x-1">
                        <button className="p-1 text-slate-400 hover:text-green-600 rounded">
                        <Play size={14} />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-blue-600 rounded">
                        <Settings size={14} />
                        </button>
                    </div>
                    </div>
                    <p className="text-xs text-slate-500">
                    Déclencheur: {rule.trigger.type} → {rule.actions.length} action(s)
                    </p>
                </div>
                ))}
            </div>

            {workflowRules.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                <Zap className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">Aucun workflow</p>
                <p className="text-xs mt-1">Créez votre premier workflow pour ajouter de l'interactivité.</p>
                </div>
            )}
        </div>
    );
};
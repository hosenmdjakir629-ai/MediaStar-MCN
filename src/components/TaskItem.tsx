import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

interface TaskProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  id,
  title,
  description,
  dueDate,
  status,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskProps) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${status === 'completed' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'} shadow-sm transition-all`}>
      <input
        type="checkbox"
        checked={status === 'completed'}
        onChange={() => onToggleComplete(id)}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      
      <div className="flex-1">
        <h4 className={`font-semibold text-slate-900 ${status === 'completed' ? 'line-through text-slate-500' : ''}`}>
          {title}
        </h4>
        <p className="text-sm text-slate-600 mt-0.5">{description}</p>
        <p className="text-xs text-slate-400 mt-2">Due: {new Date(dueDate).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(id)}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

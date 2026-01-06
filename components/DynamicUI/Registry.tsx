import React from 'react';
import { ComponentType, UINode } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  AlertCircle, CheckCircle, Info, Layout, MousePointerClick, Type as TypeIcon 
} from 'lucide-react';

// --- Atomic Components ---

const Container: React.FC<{ node: UINode; children: React.ReactNode }> = ({ node, children }) => {
  const { direction = 'column', gap = 4, className = '' } = node.props || {};
  const flexDir = direction === 'row' ? 'flex-row' : 'flex-col';
  // Map gap number to tailwind gap class (approximate)
  const gapClass = `gap-${Math.min(gap, 12)}`; // Limit gap to prevent invalid classes
  
  return (
    <div className={`flex ${flexDir} ${gapClass} w-full ${className}`}>
      {children}
    </div>
  );
};

const Text: React.FC<{ node: UINode }> = ({ node }) => {
  const { content, variant } = node.props || {};
  let styleClass = "text-gray-700";
  if (variant === 'primary') styleClass = "text-2xl font-bold text-gray-900";
  if (variant === 'secondary') styleClass = "text-lg font-semibold text-gray-600";
  if (variant === 'danger') styleClass = "text-red-600";
  
  return <div className={styleClass}>{content}</div>;
};

const Button: React.FC<{ node: UINode }> = ({ node }) => {
  const { label, variant } = node.props || {};
  let bgClass = "bg-blue-600 hover:bg-blue-700";
  if (variant === 'secondary') bgClass = "bg-gray-600 hover:bg-gray-700";
  if (variant === 'danger') bgClass = "bg-red-600 hover:bg-red-700";
  if (variant === 'success') bgClass = "bg-emerald-600 hover:bg-emerald-700";

  return (
    <button className={`${bgClass} text-white px-4 py-2 rounded shadow transition-colors flex items-center gap-2`}>
      <MousePointerClick size={16} />
      {label}
    </button>
  );
};

const Card: React.FC<{ node: UINode; children: React.ReactNode }> = ({ node, children }) => {
  const { title } = node.props || {};
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      {title && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 font-medium text-gray-800">
          {title}
        </div>
      )}
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
};

const Metric: React.FC<{ node: UINode }> = ({ node }) => {
  const { label, content, variant } = node.props || {};
  let colorClass = "text-blue-600";
  if (variant === 'success') colorClass = "text-emerald-600";
  if (variant === 'danger') colorClass = "text-red-600";
  if (variant === 'warning') colorClass = "text-amber-600";

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
      <span className={`text-3xl font-bold ${colorClass} mt-1`}>{content}</span>
    </div>
  );
};

const Alert: React.FC<{ node: UINode }> = ({ node }) => {
  const { content, variant } = node.props || {};
  let styles = "bg-blue-50 text-blue-800 border-blue-200";
  let Icon = Info;

  if (variant === 'danger') {
    styles = "bg-red-50 text-red-800 border-red-200";
    Icon = AlertCircle;
  } else if (variant === 'success') {
    styles = "bg-green-50 text-green-800 border-green-200";
    Icon = CheckCircle;
  } else if (variant === 'warning') {
    styles = "bg-amber-50 text-amber-800 border-amber-200";
    Icon = AlertCircle;
  }

  return (
    <div className={`px-4 py-3 rounded-lg border flex items-start gap-3 ${styles}`}>
      <Icon className="mt-0.5 shrink-0" size={18} />
      <div>{content}</div>
    </div>
  );
};

const Divider: React.FC = () => <hr className="border-t border-gray-200 my-2" />;

const Chart: React.FC<{ node: UINode }> = ({ node }) => {
  const { data, title, variant = 'bar' } = node.props || {};
  // Mock data if missing for preview stability
  const chartData = data || [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 600 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="w-full h-64 min-w-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        {variant === 'line' ? (
           <LineChart data={chartData}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
             <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
             <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
             <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             />
             <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{r:4}} />
           </LineChart>
        ) : variant === 'pie' ? (
           <PieChart>
             <Pie
               data={chartData}
               cx="50%"
               cy="50%"
               innerRadius={60}
               outerRadius={80}
               paddingAngle={5}
               dataKey="value"
             >
               {chartData.map((entry: any, index: number) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
               ))}
             </Pie>
             <Tooltip />
           </PieChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
               cursor={{fill: '#f3f4f6'}}
               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// --- Registry Map ---

export const ComponentRegistry: Record<string, React.FC<any>> = {
  [ComponentType.CONTAINER]: Container,
  [ComponentType.TEXT]: Text,
  [ComponentType.BUTTON]: Button,
  [ComponentType.CARD]: Card,
  [ComponentType.METRIC]: Metric,
  [ComponentType.CHART]: Chart,
  [ComponentType.ALERT]: Alert,
  [ComponentType.DIVIDER]: Divider,
};

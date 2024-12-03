import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, BarChart2, HelpCircle } from 'lucide-react';

export default function EnhancedVisualizer() {
  const [data, setData] = useState([]);
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('line');

  // Your specific colors with added gradient definitions
  const colors = {
    BAS: {
      main: 'rgb(221,66,44)',
      background: 'rgba(221,66,44,0.1)',
      gradient: ['rgb(221,66,44)', 'rgba(221,66,44,0.7)']
    },
    ATS: {
      main: 'rgb(24,71,141)',
      background: 'rgba(24,71,141,0.1)',
      gradient: ['rgb(24,71,141)', 'rgba(24,71,141,0.7)']
    },
    RAS: {
      main: 'rgb(250,223,0)',
      background: 'rgba(250,223,0,0.1)',
      gradient: ['rgb(250,223,0)', 'rgba(250,223,0,0.7)']
    },
    CNS: {
      main: 'rgb(0,128,0)',
      background: 'rgba(0,128,0,0.1)',
      gradient: ['rgb(0,128,0)', 'rgba(0,128,0,0.7)']
    }
  };

  const parseCSV = (csv) => {
    try {
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      return lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',');
          const entry = {};
          headers.forEach((header, index) => {
            const value = values[index]?.trim();
            entry[header] = isNaN(value) ? value : Number(value);
          });
          return entry;
        });
    } catch (err) {
      throw new Error('Error parsing CSV data');
    }
  };

  const handleParse = () => {
    try {
      if (!csvText.trim()) {
        setError('Please paste some CSV data');
        return;
      }
      const parsedData = parseCSV(csvText);
      setData(parsedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
    }
  };

  const sampleData = `Quarter,BAS,ATS,RAS,CNS
Q1,16.59,14.95,14.13,13.92
Q2,19.48,14.18,11.55,10.90
Q3,26.16,16.53,13.08,10.48
Q4,35.55,20.07,16.08,12.18`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span style={{ color: entry.color }}>{entry.name}</span>
                <span className="font-medium" style={{ color: entry.color }}>
                  {Number(entry.value).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Performance Analytics Dashboard</h1>
          <p className="text-gray-600">Visualize and analyze performance metrics across quarters</p>
        </div>

        {/* Input Section */}
        <div className="p-6 space-y-4">
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Paste your CSV data here..."
            className="w-full h-32 p-4 text-sm border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          
          <div className="flex gap-3">
            <button
              onClick={handleParse}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center gap-2"
            >
              <TrendingUp size={18} />
              Visualize Data
            </button>
            <button
              onClick={() => setCsvText(sampleData)}
              className="px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium flex items-center gap-2"
            >
              <HelpCircle size={18} />
              Load Sample
            </button>
            {error && (
              <div className="text-red-500 flex items-center gap-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {data.length > 0 && (
          <div className="p-6 space-y-6">
            {/* Chart Type Selector */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('line')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'line' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp size={18} />
                Line Chart
              </button>
              <button
                onClick={() => setActiveTab('bar')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'bar' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart2 size={18} />
                Bar Chart
              </button>
            </div>

            {/* Charts */}
            <div className="bg-white rounded-xl p-6">
              {activeTab === 'line' ? (
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      {Object.entries(colors).map(([key, color]) => (
                        <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color.gradient[0]} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={color.gradient[1]} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="Quarter" 
                      tick={{ fill: '#666' }}
                      axisLine={{ stroke: '#eee' }}
                    />
                    <YAxis 
                      tick={{ fill: '#666' }}
                      axisLine={{ stroke: '#eee' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                    {Object.entries(colors).map(([key, color]) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={color.main}
                        strokeWidth={3}
                        dot={{
                          fill: color.main,
                          stroke: 'white',
                          strokeWidth: 2,
                          r: 6
                        }}
                        activeDot={{
                          r: 8,
                          stroke: 'white',
                          strokeWidth: 2
                        }}
                        fill={`url(#gradient-${key})`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="Quarter" 
                      tick={{ fill: '#666' }}
                      axisLine={{ stroke: '#eee' }}
                    />
                    <YAxis 
                      tick={{ fill: '#666' }}
                      axisLine={{ stroke: '#eee' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                    {Object.entries(colors).map(([key, color], index) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={color.main}
                        fillOpacity={0.8}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(colors).map(([key, color]) => {
                const latestValue = data[data.length - 1]?.[key];
                const previousValue = data[data.length - 2]?.[key];
                const change = latestValue - previousValue;
                const percentChange = ((change / previousValue) * 100).toFixed(1);

                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl border bg-white"
                    style={{ borderColor: color.main + '40' }}
                  >
                    <div className="text-sm font-medium mb-1" style={{ color: color.main }}>
                      {key}
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {latestValue?.toFixed(2)}
                    </div>
                    <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(percentChange)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Users, Settings } from 'lucide-react';
import api from '../services/api';
import { Shift, User } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState<'schedule' | 'team' | 'settings'>('schedule');
  const [schedules, setSchedules] = useState<Shift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchedules();
    if (['admin', 'cppo'].includes(user?.role || '')) {
      loadUsers();
    }
  }, [currentDate, view, user]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schedules');
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const getShiftsForDay = (day: number) => {
    const dateStr = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');
    return schedules.filter((s) => s.shift_date === dateStr);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const shiftColors = {
    'Office Hours': 'bg-green-100 text-green-800',
    'In the Field': 'bg-yellow-100 text-yellow-800',
    'E-Day': 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">CoSync</h1>
            <p className="text-xs text-slate-400">Team Manager</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView('schedule')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              view === 'schedule'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            My Schedule
          </button>

          {['admin', 'cppo'].includes(user?.role || '') && (
            <button
              onClick={() => setView('team')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                view === 'team'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              Team Calendar
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => setView('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                view === 'settings'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-sm font-semibold">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              ←
            </button>
            <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Today
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {view === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">My Schedule</h3>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-3 text-center font-semibold text-slate-700">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                  {daysInMonth.map((day) => (
                    <div
                      key={day.toISOString()}
                      className="min-h-24 p-2 border border-slate-200 bg-white hover:bg-slate-50 transition"
                    >
                      <div className="font-semibold text-slate-900 mb-1">{format(day, 'd')}</div>
                      <div className="space-y-1">
                        {getShiftsForDay(day.getDate()).map((shift) => (
                          <div
                            key={shift.id}
                            className={`text-xs px-2 py-1 rounded truncate font-medium ${
                              shiftColors[shift.shift_type as keyof typeof shiftColors] || 'bg-slate-100'
                            }`}
                          >
                            {shift.shift_type}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'team' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Calendar</h3>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-600">Team schedule view coming soon...</p>
              </div>
            </div>
          )}

          {view === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Settings</h3>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-600">Settings panel coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

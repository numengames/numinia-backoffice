/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react';
import { fetchMetrics, formatDateTime, getSpaceNameLink, spaceNameMap } from './utils';

export default function MetricsPage() {
  const [currentSessions, setCurrentSessions] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [averageTime, setAverageTime] = useState<number>(0);
  const [selectedSpace, setSelectedSpace] = useState<string>('age_of_ai');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>('1');
  const sessionsPerPage = 5;
  const totalSpaces = Object.keys(spaceNameMap).length;

  useEffect(() => {
    const spaceKey = Object.keys(spaceNameMap).find(key => spaceNameMap[key] === selectedSpace) || selectedSpace;

    fetchMetrics('count-sessions', setCurrentSessions);
    fetchMetrics('active-sessions', setActiveSessions);
    fetchMetrics('average-time', setAverageTime, { spaceName: spaceKey, days: selectedTimeFrame });

    const intervalId = setInterval(async () => {
      fetchMetrics('count-sessions', setCurrentSessions);
      fetchMetrics('active-sessions', setActiveSessions);
      fetchMetrics('average-time', setAverageTime, { spaceName: spaceKey, days: selectedTimeFrame });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedSpace, selectedTimeFrame]);

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessionsPage = activeSessions.slice(indexOfFirstSession, indexOfLastSession);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSpaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpace(event.target.value);
  };

  const handleTimeFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeFrame(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Game Metrics</h1>
      <div className="flex flex-col gap-4">
        <div className="border p-4 rounded shadow h-32 flex flex-col items-center justify-center bg-white">
          <h2 className="text-xl font-semibold mb-2 text-black">Current Sessions in Real Time</h2>
          <p className="text-3xl mt-4 text-black">{currentSessions}</p>
        </div>
        <div className="border p-4 rounded shadow h-32 flex flex-col items-center justify-center bg-white">
          <h2 className="text-xl font-semibold mb-2 text-black">Average Time in Space</h2>
          <select value={selectedSpace} onChange={handleSpaceChange} className="mb-2 text-black">
            {Object.entries(spaceNameMap).map(([key, value]) => (
              <option key={value} value={value}>{key}</option>
            ))}
          </select>
          <select value={selectedTimeFrame} onChange={handleTimeFrameChange} className="mb-2 text-black">
            <option value="1">Last day</option>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
          </select>
          <p className="text-3xl mt-4 text-black">{averageTime} mins</p>
        </div>
        <div className="border p-4 rounded shadow h-32 flex flex-col items-center justify-center bg-white">
          <h2 className="text-xl font-semibold mb-2 text-black">Total Spaces</h2>
          <p className="text-3xl mt-4 text-black">{totalSpaces}</p>
        </div>
        <div className="border p-4 rounded shadow flex flex-col items-center justify-center bg-white">
          <h2 className="text-xl font-semibold mb-2 text-black">Active Sessions</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSessionsPage.map((session, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{session.playerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{session.playerInfo?.playerName || 'Anon'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{formatDateTime(session.startAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{session.platform || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={getSpaceNameLink(session.spaceName || 'N/A')} target='_blank' className="text-blue-500 underline">
                      {session.spaceName || 'N/A'}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            {Array.from({ length: Math.ceil(activeSessions.length / sessionsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 border ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
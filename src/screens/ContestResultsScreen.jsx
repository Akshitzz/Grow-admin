import React, { useState } from 'react';

function ContestResultsScreen() {
  const [contestId, setContestId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResult = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/results/${contestId}`);
      if (!res.ok) throw new Error('No results found for this contest.');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Results Awaited / Contest is Upcoming or Active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Contest Results Viewer</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Enter Contest ID"
          value={contestId}
          onChange={e => setContestId(e.target.value)}
          style={{ padding: 8, width: '70%', marginRight: 8 }}
        />
        <button onClick={fetchResult} disabled={loading || !contestId} style={{ padding: '8px 16px' }}>
          {loading ? 'Loading...' : 'Fetch Results'}
        </button>
      </div>
      {error && <div style={{ color: 'orange', marginBottom: 16 }}>{error}</div>}
      {result && (
        <div>
          <h3>Contest: {result.contestName}</h3>
          <div><b>Ended At:</b> {result.endedAt && new Date(result.endedAt).toLocaleString()}</div>
          <div><b>Prize Pool:</b> {result.prizePool}</div>
          <div style={{ marginTop: 16 }}>
            <h4>Winners</h4>
            <ol>
              {result.winners.map((w, idx) => (
                <li key={w.userId || idx}>
                  {w.name || w.username || w.userId} <b>({w.points} pts)</b>
                </li>
              ))}
            </ol>
          </div>
          <div style={{ marginTop: 16 }}>
            <h4>Prize Distribution</h4>
            <ul>
              {result.prizeDistribution && result.prizeDistribution.length > 0 ? (
                result.prizeDistribution.map((p, idx) => (
                  <li key={idx}>Rank {idx + 1}: {p} </li>
                ))
              ) : <li>No prize distribution info.</li>}
            </ul>
          </div>
          <div style={{ marginTop: 16 }}>
            <h4>All Contestants</h4>
            <ul>
              {result.contestants.map((c, idx) => (
                <li key={c.userId || idx}>
                  {c.name || c.username || c.userId} ({c.points} pts)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContestResultsScreen;

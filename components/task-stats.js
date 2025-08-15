export default function TaskStats({ stats }) {
  const { total, pending, completed, urgent } = stats;

  // likely more benefitial for more complex task systems
  // ie if this were an app combining personal task lists with once assigned by a supervisior
  //and with tasks that have specific deadlines or possibly even multiple steps
  // currently, having something like a 'pending' status might not be that useful, if i'm targetting single users instead of groups?
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-number total">{total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number pending">{pending}</div>
        <div className="stat-label">Pending</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number completed">{completed}</div>
        <div className="stat-label">Completed</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-number urgent">{urgent}</div>
        <div className="stat-label">Urgent</div>
      </div>
    </div>
  );
}
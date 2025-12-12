const FeedbackList = ({ items }) => {
    const displayData = items || [];

    return (
        <div className="feedback-list">
            <h2>Feedback-uri primite ({displayData.length})</h2>
            {displayData.length === 0 ? (
                <p>Nu există feedback-uri pentru selecția curentă.</p>
            ) : (
                <div className="grid-container" style={{ display: 'grid', gap: '15px' }}>
                    {displayData.map((fb) => (
                        <div key={fb.id} className="feedback-card" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, color: '#004aad' }}>{fb.project}</h3>
                                <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9em' }}>
                                    ★ {fb.organization}
                                </span>
                            </div>
                            
                            {fb.comment && (
                                <p style={{ fontStyle: 'italic', color: '#555', marginTop: '10px' }}>
                                    "{fb.comment}"
                                </p>
                            )}
                            
                            <p className="feedback-date" style={{ fontSize: '0.8em', color: '#999', marginTop: '10px', textAlign: 'right' }}>
                                {new Date(fb.date).toLocaleString("ro-RO")}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
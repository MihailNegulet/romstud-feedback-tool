import { useState, useEffect, useMemo } from "react";
import ChartOverview from "../components/ChartOverview";
import { projects } from "../data/projects";

// Importuri Firebase
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth"; 
import { db } from "../firebase";

const Admin = () => {
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); 

  // 1. CITIRE DATE DIN FIREBASE
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "feedbacks"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sortăm descrescător după dată (cel mai recent sus)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAllFeedbacks(data);
    } catch (error) {
      console.error("Eroare:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. FUNCȚII DE ACȚIUNE
  const toggleApproval = async (id, currentStatus) => {
    try {
      const feedbackRef = doc(db, "feedbacks", id);
      await updateDoc(feedbackRef, { approved: !currentStatus });
      
      setAllFeedbacks(prev => prev.map(item => 
        item.id === id ? { ...item, approved: !currentStatus } : item
      ));
    } catch (error) {
      console.error("Eroare la update:", error);
      alert("Nu am putut actualiza statusul.");
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Sigur ștergi acest feedback? Acțiunea este ireversibilă.")) return;
    try {
      await deleteDoc(doc(db, "feedbacks", id));
      setAllFeedbacks(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Eroare la stergere:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth); 
  };

  // 3. EXPORT CSV 
  const exportCSV = () => {
    if (filtered.length === 0) {
      alert("Nu există feedback-uri de exportat.");
      return;
    }

    // Header extins
    const header = [
        "Proiect", 
        "Medie Gen.", 
        "Org Rating", 
        "Cazare Rating", 
        "Vibe Rating", 
        "Ce a placut", 
        "De imbunatatit", 
        "Sugestie Viitor", 
        "Data", 
        "Status"
    ];
    
    const rows = filtered.map((fb) => [
      fb.project.replace(/\s+/g, " ").trim(),
      String(fb.organization), // Media
      fb.details?.org || "-",
      fb.details?.cazare || "-",
      fb.details?.vibe || "-",
      fb.comment ? fb.comment.replace(/[\r\n\t]+/g, " ").trim() : "",
      fb.details?.improved ? fb.details.improved.replace(/[\r\n\t]+/g, " ").trim() : "",
      fb.details?.next || "",
      new Date(fb.date).toLocaleString("ro-RO").replace(",", ""),
      fb.approved ? "APROBAT" : "ASCUNS"
    ]);

    const csvContent = [header, ...rows]
      .map((e) => e.map((v) => `"${v}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `romstud_feedback_full_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. FILTRARE SI CALCULE
  const filtered = useMemo(() => {
    if (!selectedProject) return allFeedbacks;
    return allFeedbacks.filter(fb => fb.project === selectedProject);
  }, [allFeedbacks, selectedProject]);

  const avgOrganization = useMemo(() => {
      if (filtered.length === 0) return 0;
      const sum = filtered.reduce((acc, fb) => acc + Number(fb.organization || 0), 0);
      return (sum / filtered.length).toFixed(2);
    }, [filtered]);

  // 5. RENDERIZARE
  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Panou Admin</h1>
        <button onClick={handleLogout} style={{ background: '#333', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}>
          Ieșire Cont
        </button>
      </div>

      {loading ? <p>Se încarcă datele din cloud...</p> : (
        <>
           {/* Controale */}
           <div className="admin-controls">
              <label> 
                 Proiect: 
                 <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                    <option value="">Toate Proiectele</option>
                    {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                 </select>
              </label>

              <div className="admin-stats">
                  <span>Total: <strong>{filtered.length}</strong></span>
                  <span style={{marginLeft: '15px'}}>Medie Gen: <strong>{avgOrganization}</strong>/5</span>
              </div>

              <div className="admin-buttons">
                 <button onClick={exportCSV} style={{background: '#004aad', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                    Export CSV Complet 📥
                 </button>
              </div>
           </div>

            {/* CHART OVERVIEW */}
           <div className="chart-section">  
              <ChartOverview data={filtered} />
           </div>

            {/* LISTA FEEDBACK-URI */}
           <div className="list-section">
              <h3 style={{marginTop: 0, color: '#555'}}>Feedback-uri Recente</h3>
              <div style={{display: 'grid', gap: '20px'}}>
                
                {filtered.map(fb => (
                  <div key={fb.id} className="feedback-card" style={{ 
                      borderLeft: fb.approved ? '6px solid #4caf50' : '6px solid #ccc', // Verde daca e aprobat, Gri daca nu
                      background: '#fff',
                      padding: '20px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                  }}>
                    
                    {/* Header Card: Titlu si Medie */}
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'}}>
                        <div>
                            <h3 style={{margin:0, color: '#004aad', fontSize: '1.2rem'}}>{fb.project}</h3>
                            <div style={{fontSize: '0.85rem', color: '#999', marginTop: '4px'}}>
                                📅 {new Date(fb.date).toLocaleString('ro-RO')}
                            </div>
                        </div>
                        <div style={{textAlign: 'center', background: '#e3f2fd', padding: '5px 10px', borderRadius: '8px'}}>
                            <div style={{fontSize: '1.4rem', fontWeight: 'bold', color: '#004aad'}}>{fb.organization}</div>
                            <div style={{fontSize: '0.7rem', color: '#555', textTransform: 'uppercase'}}>Medie</div>
                        </div>
                    </div>

                    {/* GRILA DE STELE*/}
                    {fb.details && (
                        <div style={{
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                            gap: '10px', 
                            background: '#f8f9fa', 
                            padding: '12px', 
                            borderRadius: '8px',
                            marginBottom: '15px',
                            textAlign: 'center'
                        }}>
                            <div>
                                <span style={{display:'block', fontSize: '0.75rem', color:'#666', marginBottom:'2px'}}>LOGISTICĂ</span>
                                <strong>{fb.details.org} ⭐</strong>
                            </div>
                            <div style={{borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd'}}>
                                <span style={{display:'block', fontSize: '0.75rem', color:'#666', marginBottom:'2px'}}>CAZARE</span>
                                <strong>{fb.details.cazare} ⭐</strong>
                            </div>
                            <div>
                                <span style={{display:'block', fontSize: '0.75rem', color:'#666', marginBottom:'2px'}}>VIBE</span>
                                <strong>{fb.details.vibe} ⭐</strong>
                            </div>
                        </div>
                    )}

                    {/* Comentarii Text */}
                    <div style={{display: 'grid', gap: '10px'}}>
                        <div>
                            <strong style={{color: '#2e7d32', fontSize: '0.9rem'}}>✅ Ce a plăcut:</strong>
                            <p style={{margin: '5px 0 0 0', fontStyle: 'italic', color: '#333', background: '#f1f8e9', padding: '10px', borderRadius: '6px'}}>
                                "{fb.comment}"
                            </p>
                        </div>

                        {fb.details?.improved && (
                            <div>
                                <strong style={{color: '#c62828', fontSize: '0.9rem'}}>🔧 De îmbunătățit:</strong>
                                <p style={{margin: '5px 0 0 0', color: '#333', background: '#ffebee', padding: '10px', borderRadius: '6px'}}>
                                    "{fb.details.improved}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sugestie Viitor */}
                    {fb.details?.next && (
                        <div style={{marginTop: '15px', fontSize: '0.9rem', color: '#004aad'}}>
                            ✈️ Vrea să meargă în: <strong>{fb.details.next}</strong>
                        </div>
                    )}
                    
                    {/* Butoane Actiune */}
                    <div style={{marginTop: '20px', display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                        <button 
                            onClick={() => toggleApproval(fb.id, fb.approved)}
                            style={{
                                flex: 1,
                                background: fb.approved ? '#ff9800' : '#4caf50',
                                color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600'
                            }}
                        >
                            {fb.approved ? "ASCUNDE (Unpublish)" : "PUBLICĂ PE SITE"}
                        </button>

                        <button 
                             onClick={() => handleDelete(fb.id)}
                             style={{ background: '#e53935', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600'}}
                        >
                            ȘTERGE
                        </button>
                    </div>

                  </div>
                ))}

              </div>
           </div>
        </>
      )}
    </div>
  );
};

export default Admin;
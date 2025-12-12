import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import { mediaCollections } from "../data/mediaCollections";

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchPublicFeedbacks = async () => {
      try {
        const q = query(collection(db, "feedbacks"), where("approved", "==", true));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFeedbacks(data);
      } catch (error) {
        console.error("Eroare:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicFeedbacks();
  }, []);

 const getGradient = (name) => {
    if (!name) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    const colors = [
      "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)", // Roz Pastel
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", // Mov deschis
      "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", // Turcoaz/Verde
      "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)", // Portocaliu/Mov
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", // Albastru Lavandă
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Roșu/Roz vibrant
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Albastru Electric
      "linear-gradient(135deg, #004aad 0%, #cb6ce6 100%)", // RomStud Brand
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Verde Mentă
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", // Galben/Roz Sunset
    ];

    // Calculăm un număr unic bazat pe literele numelui
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }
    
    // Folosim acel număr pentru a alege culoarea
    return colors[sum % colors.length];
  };

  const renderStars = (count) => "⭐".repeat(count);

  return (
    <div className="public-page">
      <div className="hero-section">
        <h1>Jurnal de Călătorie 🌍</h1>
        <p>Experiențe reale și amintiri din proiectele RomStud.</p>
      </div>

      <div className="testimonials-container">
        
        {/* PARTEA 1: FEEDBACK-URI */}
        <h2 className="section-title">💬 Ce spun participanții</h2>
        
        {loading ? (
          <div className="loading-spinner" style={{textAlign: 'center', padding: '2rem'}}>Se încarcă...</div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state"><h3>Încă nu sunt experiențe publicate.</h3></div>
        ) : (
          <div className="cards-grid">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="travel-card">
                <div className="card-header" style={{ background: getGradient(fb.project) }}>
                  <span className="project-badge">{fb.project}</span>
                  <div className="rating-badge">
                     <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{fb.organization}</span> <small>/5</small>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="quote-icon">❝</div>
                  <p className="card-text">{fb.comment}</p>
                  
                  {fb.details?.next && (
                    <div className="next-dest-tag">
                       📍 Next Stop: <strong>{fb.details.next}</strong>
                    </div>
                  )}

                  <div className="card-footer">
                    {fb.details ? (
                        <div className="ratings-grid">
                            <div className="rating-item">
                                <span className="r-label">🎉 Vibe</span>
                                <span className="r-val">{renderStars(fb.details.vibe)}</span>
                            </div>
                            <div className="rating-item">
                                <span className="r-label">🏠 Cazare</span>
                                <span className="r-val">{renderStars(fb.details.cazare)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="user-info">
                            <span className="user-name">Participant RomStud</span>
                            <span className="user-date">{new Date(fb.date).toLocaleDateString("ro-RO")}</span>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PARTEA 2: GALERIE MEDIA*/}
        <div className="media-section">
            <h2 className="section-title" style={{marginTop: '4rem'}}>🎬 Galerie Proiecte</h2>
            
            <div className="projects-grid-layout">
                {mediaCollections.map((collection, index) => (
                  <div key={index} className="project-media-card">
                     
                     {/* 1. Imaginea Mare de Copertă */}
                     <div className="project-cover" style={{backgroundImage: `url(${collection.projectImage})`}}>
                        <div className="cover-overlay">
                            <h3>{collection.projectName}</h3>
                        </div>
                     </div>

                     {/* 2. Lista simplă de link-uri */}
                     <div className="links-list">
                        {collection.items?.length === 0 && <p style={{color:'#999', fontSize:'0.9rem'}}>În curând...</p>}
                        
                        {collection.links.map((link, idx) => (
                           <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="media-link-btn">
                              {link.title} <span style={{marginLeft: 'auto'}}>↗</span>
                           </a>
                        ))}
                     </div>
                  </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
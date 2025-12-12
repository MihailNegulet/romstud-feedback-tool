import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/projects";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import Confetti from "react-confetti";
import RatingStars from "./RatingStars"; 

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowDimension, setWindowDimension] = useState({width: window.innerWidth, height: window.innerHeight});

  const [formData, setFormData] = useState({
    project: "",
    ratingOrg: 0,
    ratingCazare: 0,
    ratingVibe: 0,
    liked: "",
    improved: "",
    nextDest: ""
  });

  useEffect(() => {
    const detectSize = () => setWindowDimension({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  // Funcție specială care se potrivește cu componenta RatingStars
  const handleRatingChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.ratingOrg === 0 || formData.ratingCazare === 0 || formData.ratingVibe === 0) {
      alert("Te rugăm să acorzi o notă (stele) la toate categoriile.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculăm media pentru compatibilitate cu graficele vechi
      const averageScore = ((formData.ratingOrg + formData.ratingCazare + formData.ratingVibe) / 3).toFixed(1);

      await addDoc(collection(db, "feedbacks"), {
        project: formData.project,
        organization: Number(averageScore), 
        details: { 
            org: formData.ratingOrg,
            cazare: formData.ratingCazare,
            vibe: formData.ratingVibe,
            next: formData.nextDest,
            improved: formData.improved
        },
        comment: formData.liked,
        date: new Date().toISOString(),
        approved: false
      });

      setShowConfetti(true);
      setTimeout(() => navigate("/thankyou"), 3500);
      
    } catch (error) {
      console.error("Eroare:", error);
      alert("Eroare la trimitere.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showConfetti && <Confetti width={windowDimension.width} height={windowDimension.height} numberOfPieces={200} gravity={0.2} />}
      
      <form onSubmit={handleSubmit} className="modern-form">
        <div style={{textAlign: 'center', marginBottom: '1rem'}}>
           <h3 style={{margin: 0, color: '#004aad'}}>Feedback Detaliat ✍️</h3>
           <p style={{fontSize: '0.9rem', color: '#666'}}>Ajută-ne să devenim mai buni!</p>
        </div>
        
        {/* 1. SELECTARE PROIECT */}
        <div className="form-group">
          <label>Proiectul la care ai fost:</label>
          <select
            value={formData.project}
            onChange={(e) => setFormData({...formData, project: e.target.value})}
            required
            className="styled-input"
          >
            <option value="">-- Alege destinația --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}    
          </select>
        </div>
        
        {/* 2. SECȚIUNEA DE RATING (STELE) */}
        <div style={{background: '#f0f4f8', padding: '15px', borderRadius: '10px', margin: '10px 0'}}>
            <RatingStars 
                label="📅 Organizare & Comunicare" 
                name="ratingOrg" 
                value={formData.ratingOrg} 
                onChange={handleRatingChange} 
            />
            <RatingStars 
                label="🏠 Cazare & Transport" 
                name="ratingCazare" 
                value={formData.ratingCazare} 
                onChange={handleRatingChange} 
            />
            <RatingStars 
                label="🎉 Vibe & Activități" 
                name="ratingVibe" 
                value={formData.ratingVibe} 
                onChange={handleRatingChange} 
            />
        </div>

        {/* 3. TEXT AREAS */}
        <div className="form-group">
          <label>Ce ți-a plăcut cel mai mult? (Highlight)</label>
          <textarea
            value={formData.liked}
            onChange={(e) => setFormData({...formData, liked: e.target.value})}
            placeholder="Ex: Oamenii, vizita la muzeu, petrecerea..."    
            rows="3"
            className="styled-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Ce putem îmbunătăți data viitoare?</label>
          <textarea
            value={formData.improved}
            onChange={(e) => setFormData({...formData, improved: e.target.value})}
            placeholder="Ex: Mai mult timp liber, autocar mai confortabil..."    
            rows="2"
            className="styled-input"
          />
        </div>

        {/* 4. SUGESTIE VIITOR */}
        <div className="form-group">
          <label>Unde ai vrea să mergem în următorul proiect? ✈️</label>
          <input
            type="text"
            value={formData.nextDest}
            onChange={(e) => setFormData({...formData, nextDest: e.target.value})}
            placeholder="Ex: Lisabona, Berlin, Atena..."
            className="styled-input"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || showConfetti}
          className="submit-btn"
        >
          {isSubmitting ? "Se trimite..." : (showConfetti ? "Mulțumim! 🎉" : "Trimite Feedback")}
        </button>
      </form>
    </>
  );
};

export default FeedbackForm;
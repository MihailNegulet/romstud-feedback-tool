import { useState } from 'react';

const RatingStars = ({ label, name, value, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
        <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                {label}
            </label>
            <div className="star-container">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          
          return (
            <span
              key={index}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                color: ratingValue <= (hover || value) ? "#ffc107" : "#e4e5e9",
                transition: "color 0.2s"
              }}
              onClick={() => onChange(name, ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default RatingStars;

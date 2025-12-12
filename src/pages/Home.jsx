import FeedbackForm from "../components/FeedbackForm";

const Home = () => {
  return (
    <div className="home-container">
        <div className="background-overlay"></div>

        <div className="content-wrapper">
          <div className="hero-text">
            <h1>Povestea ta contează! 🌍</h1>
            <p>
              Ai participat la un proiect RomStud? <br />
              Ajută-ne să creăm experiențe și mai faine pentru viitorii studenți.
              Durează doar <strong>60 de secunde</strong>.
            </p>
          </div>

          <div className="form-card glass-effect">
            <FeedbackForm />
          </div>
        </div>
      </div>
    );
};

export default Home;

export default function WelcomeScreen({ onGetStarted }) {
  const droplets = Array.from({ length: 35 });

  return (
    <div className="welcome-screen">

      <div className="water-droplets">
        {droplets.map((_, index) => (
          <span
            key={index}
            className="water-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${5 + Math.random() * 6}s`,
              transform: `scale(${0.5 + Math.random() * 0.8})`,
            }}
          >
            💧
          </span>
        ))}
      </div>

      <div className="welcome-content">

        <div className="welcome-icon">
          💧
        </div>

        <h1>AquaGuard</h1>

        <p className="welcome-subtitle">
          Smart Community Water Monitoring
        </p>

        <p className="welcome-description">
          Report water issues, monitor community problems,
          and help keep our water safe.
        </p>

        <button
          className="get-started-button"
          onClick={onGetStarted}
        >
          Get Started
          <span>→</span>
        </button>

      </div>
    </div>
  );
}
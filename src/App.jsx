import { useState } from "react";

import WelcomeScreen from "./pages/WelcomeScreen.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import WaterMap from "./pages/WaterMap.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Emergency from "./pages/Emergency.jsx";
import Alerts from "./pages/Alerts.jsx";
export default function App() {
  const [screen, setScreen] = useState("welcome");

  /* =====================================================
     WELCOME
  ===================================================== */

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        onGetStarted={() => setScreen("dashboard")}
      />
    );
  }

  /* =====================================================
     ADMIN PANEL
  ===================================================== */
if (screen === "admin-login") {
  return (
    <AdminLogin
      onLogin={() => setScreen("admin")}
      onBack={() => setScreen("dashboard")}
    />
  );
}
  if (screen === "admin") {
    return (
      <AdminPanel
        onBack={() => setScreen("dashboard")}
        onWaterMap={() => setScreen("watermap")}
      />
    );
  }
if (screen === "emergency") {
  return (
    <Emergency
      onBack={() => setScreen("dashboard")}
      onSubmitted={() => setScreen("dashboard")}
    />
  );
}
  /* =====================================================
     DASHBOARD
  ===================================================== */

 if (screen === "dashboard") {
  return (
    <>
      <Dashboard
        onReportIssue={() => setScreen("report")}
        onEmergency={() => setScreen("emergency")}
        onWaterMap={() => setScreen("watermap")}
        onAnalytics={() => setScreen("analytics")}
        onRecommendations={() =>
          setScreen("recommendations")
        }
        onAdmin={() => setScreen("admin-login")}
        onLogout={() => setScreen("welcome")}
      />

      <Chatbot />

      <Alerts />
    </>
  );
}

  /* =====================================================
     REPORT ISSUE
  ===================================================== */

  if (screen === "report") {
    return (
      <ReportIssue
        onBack={() => setScreen("dashboard")}
        onSubmitted={() => setScreen("dashboard")}
      />
    );
  }

  /* =====================================================
     WATER MAP
  ===================================================== */

  if (screen === "watermap") {
    return (
      <FeatureLayout
        active="watermap"
        setScreen={setScreen}
      >
        <div className="feature-heading">
          <div>
            <h1>Local Water Map</h1>

            <p>
              Community water issue locations and
              monitoring areas
            </p>
          </div>

          <div className="feature-user">
            👤 Community User
          </div>
        </div>

        <div className="feature-content-card">
          <div className="feature-card-heading">
            <div>
              <h2>
                Community Water Monitoring
              </h2>

              <span>
                View reported water issues on the map
              </span>
            </div>

            <div className="feature-live">
              <span></span>
              Live
            </div>
          </div>

          <WaterMap />
        </div>
      </FeatureLayout>
    );
  }

  /* =====================================================
     ANALYTICS
  ===================================================== */

  if (screen === "analytics") {
    return (
      <AnalyticsPage
        onBack={() => setScreen("dashboard")}
        active="analytics"
        setScreen={setScreen}
      />
    );
  }

  /* =====================================================
     RECOMMENDATIONS
  ===================================================== */

  if (screen === "recommendations") {
    return (
      <RecommendationsPage
        onBack={() => setScreen("dashboard")}
        active="recommendations"
        setScreen={setScreen}
      />
    );
  }

  return null;
}

/* =========================================================
   FEATURE LAYOUT
========================================================= */

function FeatureLayout({
  children,
  active,
  setScreen,
}) {
  return (
    <div className="dashboard-page">

      <aside className="sidebar">

        <div className="logo">
  <span className="logo-drop">💧</span>
  <span className="logo-name">AquaGuard</span>
</div>

        <button
          className={`menu-item ${
            active === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setScreen("dashboard")
          }
        >
          <span>📊</span>
          Dashboard
        </button>

        <button
          className={`menu-item ${
            active === "report"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setScreen("report")
          }
        >
          <span>📝</span>
          Report Issue
        </button>

        <button
          className={`menu-item ${
            active === "watermap"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setScreen("watermap")
          }
        >
          <span>🗺️</span>
          Water Map
        </button>

        <button
          className={`menu-item ${
            active === "analytics"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setScreen("analytics")
          }
        >
          <span>📈</span>
          Analytics
        </button>

        <button
          className={`menu-item ${
            active === "recommendations"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setScreen("recommendations")
          }
        >
          <span>💡</span>
          Recommendations
        </button>

       <button
  className="menu-item"
  onClick={() =>
    setScreen("admin-login")
  }
>
  <span>👮</span>
  Admin Panel
</button>

        <button
          className="logout-button"
          onClick={() =>
            setScreen("welcome")
          }
        >
          ↪ Logout
        </button>

      </aside>

      <main className="dashboard-main feature-main-clean">

        <div className="feature-page-content">
          {children}
        </div>

      </main>

    </div>
  );
}

/* =========================================================
   ANALYTICS PAGE
========================================================= */

function AnalyticsPage({
  onBack,
  active,
  setScreen,
}) {
  const reports =
    JSON.parse(
      localStorage.getItem(
        "aquaGuardReports"
      )
    ) || [];

  const activeReports =
    reports.filter(
      (report) =>
        report.status !== "Solved"
    );

  const leakage =
    activeReports.filter(
      (report) =>
        report.issueType === "leakage"
    ).length;

  const availability =
    activeReports.filter(
      (report) =>
        report.issueType === "availability"
    ).length;

  const groundwater =
    activeReports.filter(
      (report) =>
        report.issueType === "groundwater"
    ).length;

  const other =
    activeReports.filter(
      (report) =>
        report.issueType === "other"
    ).length;

  const high =
    activeReports.filter(
      (report) =>
        report.severity === "high"
    ).length;

  const medium =
    activeReports.filter(
      (report) =>
        report.severity === "medium"
    ).length;

  const low =
    activeReports.filter(
      (report) =>
        report.severity === "low"
    ).length;

  const solved =
    reports.filter(
      (report) =>
        report.status === "Solved"
    ).length;

  return (
    <FeatureLayout
      active={active}
      setScreen={setScreen}
    >

      <div className="feature-heading">

        <div>
          <h1>Water Analytics</h1>

          <p>
            Community water report analysis
            and risk overview
          </p>
        </div>

        <div className="feature-user">
          👤 Community User
        </div>

      </div>

      <div className="analytics-grid">

        <div className="analytics-card">
          <div className="analytics-icon">
            🚰
          </div>

          <div>
            <span>WATER LEAKAGE</span>

            <strong>
              {leakage}
            </strong>

            <small>
              Active reports
            </small>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            💧
          </div>

          <div>
            <span>LOW AVAILABILITY</span>

            <strong>
              {availability}
            </strong>

            <small>
              Active reports
            </small>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            🌱
          </div>

          <div>
            <span>GROUNDWATER</span>

            <strong>
              {groundwater}
            </strong>

            <small>
              Observations
            </small>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            ⚠️
          </div>

          <div>
            <span>OTHER ISSUES</span>

            <strong>
              {other}
            </strong>

            <small>
              Active reports
            </small>
          </div>
        </div>

      </div>

      <div className="feature-content-card">

        <div className="feature-card-heading">
          <div>
            <h2>
              Severity Analysis
            </h2>

            <span>
              Current active water issue
              severity
            </span>
          </div>
        </div>

        <div className="analytics-severity">

          <div className="analytics-severity-card high">
            <span>HIGH</span>

            <strong>
              {high}
            </strong>

            <small>
              Needs immediate attention
            </small>
          </div>

          <div className="analytics-severity-card medium">
            <span>MEDIUM</span>

            <strong>
              {medium}
            </strong>

            <small>
              Requires monitoring
            </small>
          </div>

          <div className="analytics-severity-card low">
            <span>LOW</span>

            <strong>
              {low}
            </strong>

            <small>
              Currently manageable
            </small>
          </div>

        </div>

      </div>

      <div className="feature-content-card">

        <div className="feature-card-heading">
          <div>
            <h2>
              📊 Community Overview
            </h2>

            <span>
              AquaGuard report summary
            </span>
          </div>
        </div>

        <div className="analytics-overview">

          <div>
            <span>
              Total Active Reports
            </span>

            <strong>
              {activeReports.length}
            </strong>
          </div>

          <div>
            <span>
              Solved Reports
            </span>

            <strong>
              {solved}
            </strong>
          </div>

          <div>
            <span>
              Total Reports
            </span>

            <strong>
              {reports.length}
            </strong>
          </div>

        </div>

      </div>

    </FeatureLayout>
  );
}

/* =========================================================
   RECOMMENDATIONS
========================================================= */

function RecommendationsPage({
  onBack,
  active,
  setScreen,
}) {
  const reports =
    JSON.parse(
      localStorage.getItem(
        "aquaGuardReports"
      )
    ) || [];

  const activeReports =
    reports.filter(
      (report) =>
        report.status !== "Solved"
    );

  const hasLeakage =
    activeReports.some(
      (report) =>
        report.issueType === "leakage"
    );

  const hasAvailability =
    activeReports.some(
      (report) =>
        report.issueType === "availability"
    );

  const hasGroundwater =
    activeReports.some(
      (report) =>
        report.issueType === "groundwater"
    );

  const highReports =
    activeReports.filter(
      (report) =>
        report.severity === "high"
    ).length;

  const recommendations = [];

  if (highReports >= 3) {
    recommendations.push({
      icon: "⚠️",
      title: "Immediate Attention",
      text:
        "Multiple high-severity reports have been detected. Prioritize field inspection and local water monitoring.",
      type: "high",
    });
  }

  if (hasLeakage) {
    recommendations.push({
      icon: "🚰",
      title: "Leakage Control",
      text:
        "Water leakage has been reported. Inspect affected locations and prioritize repair to reduce unnecessary water loss.",
      type: "blue",
    });
  }

  if (hasAvailability) {
    recommendations.push({
      icon: "💧",
      title: "Water Availability",
      text:
        "Low water availability has been reported. Monitor local supply conditions and identify areas requiring additional attention.",
      type: "blue",
    });
  }

  if (hasGroundwater) {
    recommendations.push({
      icon: "🌱",
      title: "Groundwater Monitoring",
      text:
        "Continue recording groundwater observations to identify changes over time.",
      type: "green",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      icon: "💧",
      title: "Community Water Monitoring",
      text:
        "Continue reporting local water issues to improve community monitoring and identify emerging problem areas.",
      type: "green",
    });
  }

  return (
    <FeatureLayout
      active={active}
      setScreen={setScreen}
    >

      <div className="feature-heading">

        <div>
          <h1>
            Recommendations
          </h1>

          <p>
            Data-driven guidance for
            better community water
            management
          </p>
        </div>

        <div className="feature-user">
          👤 Community User
        </div>

      </div>

      <div className="recommendation-grid">

        {recommendations.map(
          (recommendation, index) => (
            <div
              className={`recommendation-card ${recommendation.type}`}
              key={index}
            >

              <div className="recommendation-icon">
                {recommendation.icon}
              </div>

              <div>
                <h2>
                  {recommendation.title}
                </h2>

                <p>
                  {recommendation.text}
                </p>
              </div>

            </div>
          )
        )}

      </div>

      <div className="feature-content-card recommendation-summary">

        <h2>
          🌊 AquaGuard Community Goal
        </h2>

        <p>
          Report water problems early,
          monitor repeated issue locations
          and encourage timely action to
          protect local water resources.
        </p>

        <button
          type="button"
          className="feature-primary-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>

    </FeatureLayout>
  );
}
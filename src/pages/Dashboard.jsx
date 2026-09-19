import { useState } from "react";
import WaterMap from "./WaterMap.jsx";

export default function Dashboard({
  onReportIssue,
  onEmergency,
  onWaterMap,
  onAnalytics,
  onRecommendations,
  onAdmin,
  onLogout,
}) {
  const [reports, setReports] = useState(() => {
    return (
      JSON.parse(
        localStorage.getItem("aquaGuardReports")
      ) || []
    );
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [reportFilter, setReportFilter] = useState("all");

  // ==========================================
  // SAVE REPORTS
  // ==========================================

  const saveReports = (updatedReports) => {
    setReports(updatedReports);

    localStorage.setItem(
      "aquaGuardReports",
      JSON.stringify(updatedReports)
    );

    window.dispatchEvent(
      new Event("aquaGuardReportsUpdated")
    );
  };

  // ==========================================
  // ISSUE DETAILS
  // ==========================================

  function getIssueDetails(issueType) {
    if (issueType === "leakage") {
      return {
        title: "Water Leakage",
        icon: "🚰",
      };
    }

    if (issueType === "availability") {
      return {
        title: "Low Water Availability",
        icon: "💧",
      };
    }

    if (issueType === "groundwater") {
      return {
        title: "Groundwater Observation",
        icon: "🌱",
      };
    }

    return {
      title: "Other Water Issue",
      icon: "⚠️",
    };
  }

  // ==========================================
  // MARK REPORT AS SOLVED
  // ==========================================

  function markAsSolved(reportId) {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            status: "Solved",
            solvedAt: new Date().toISOString(),
          }
        : report
    );

    saveReports(updatedReports);
  }

  // ==========================================
  // DELETE SOLVED REPORT
  // ==========================================

  function deleteReport(reportId) {
    const reportToDelete = reports.find(
      (report) => report.id === reportId
    );

    if (
      !reportToDelete ||
      reportToDelete.status !== "Solved"
    ) {
      return;
    }

    const confirmDelete = window.confirm(
      "Delete this solved water report?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedReports = reports.filter(
      (report) => report.id !== reportId
    );

    saveReports(updatedReports);
  }

  // ==========================================
  // ACTIVE REPORTS
  // ==========================================

  const activeReports = reports.filter(
    (report) => report.status !== "Solved"
  );

  // ==========================================
  // SEVERITY COUNTS
  // ==========================================

  const highReports = activeReports.filter(
    (report) => report.severity === "high"
  ).length;

  const mediumReports = activeReports.filter(
    (report) => report.severity === "medium"
  ).length;

  const lowReports = activeReports.filter(
    (report) => report.severity === "low"
  ).length;

  // ==========================================
  // SMART WATER RISK SCORE
  // ==========================================

  let riskScore = 0;

  activeReports.forEach((report) => {
    if (report.severity === "high") {
      riskScore += 20;
    } else if (report.severity === "medium") {
      riskScore += 10;
    } else {
      riskScore += 5;
    }
  });

  // ==========================================
  // REPEATED LOCATION RISK
  // ==========================================

  const locationCounts = {};

  activeReports.forEach((report) => {
    const location = report.location?.trim();

    if (!location) {
      return;
    }

    locationCounts[location] =
      (locationCounts[location] || 0) + 1;
  });

  Object.values(locationCounts).forEach((count) => {
    if (count >= 3) {
      riskScore += 15;
    } else if (count === 2) {
      riskScore += 8;
    }
  });

  riskScore = Math.min(riskScore, 100);

  // ==========================================
  // RISK LEVEL
  // ==========================================

  let riskLevel = "Low";

  let riskMessage =
    "Water conditions look stable based on current reports.";

  if (riskScore >= 61) {
    riskLevel = "High";

    riskMessage =
      "Multiple water issues are creating a high-risk condition. Immediate attention is recommended.";
  } else if (riskScore >= 31) {
    riskLevel = "Medium";

    riskMessage =
      "Some water issues require monitoring and community attention.";
  }

  // ==========================================
  // RISK SCORE MESSAGE
  // ==========================================

  let riskScoreMessage =
    "Water conditions are currently stable.";

  if (riskScore >= 61) {
    riskScoreMessage =
      "High community water risk detected. Priority action is recommended.";
  } else if (riskScore >= 31) {
    riskScoreMessage =
      "Moderate water risk detected. Continue monitoring reported areas.";
  }

  // ==========================================
  // HOTSPOTS
  // ==========================================

  const locations = activeReports
    .map((report) => report.location)
    .filter(Boolean);

  const uniqueLocations = [
    ...new Set(locations),
  ];

  const hotspotCount = uniqueLocations.length;

  const highRiskAreas = highReports;

  // ==========================================
  // RECOMMENDATIONS
  // ==========================================

  let recommendationTitle =
    "💧 Community Water Monitoring";

  let recommendationText =
    "Continue reporting local water issues to improve community monitoring and identify emerging problem areas.";

  if (highReports >= 3) {
    recommendationTitle =
      "⚠️ Immediate Attention Recommended";

    recommendationText =
      "Multiple high-severity reports have been detected. Prioritize field inspection, leakage control and local water availability monitoring.";
  } else if (
    activeReports.some(
      (report) =>
        report.issueType === "leakage"
    )
  ) {
    recommendationTitle =
      "🚰 Leakage Control";

    recommendationText =
      "Water leakage has been reported. Inspect the affected location and prioritize repair to reduce unnecessary water loss.";
  } else if (
    activeReports.some(
      (report) =>
        report.issueType === "availability"
    )
  ) {
    recommendationTitle =
      "💧 Water Availability";

    recommendationText =
      "Low water availability has been reported. Monitor local supply conditions and identify areas requiring additional attention.";
  } else if (
    activeReports.some(
      (report) =>
        report.issueType === "groundwater"
    )
  ) {
    recommendationTitle =
      "🌱 Groundwater Monitoring";

    recommendationText =
      "Groundwater observations have been reported. Continue monitoring groundwater conditions and record changes over time.";
  }

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredReports = reports.filter(
    (report) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        (report.location || "")
          .toLowerCase()
          .includes(search) ||
        (report.issueType || "")
          .toLowerCase()
          .includes(search) ||
        (report.description || "")
          .toLowerCase()
          .includes(search);

      const matchesFilter =
        reportFilter === "all" ||
        (
          reportFilter === "solved" &&
          report.status === "Solved"
        ) ||
        (
          reportFilter !== "solved" &&
          report.status !== "Solved" &&
          report.severity === reportFilter
        );

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
  <span className="logo-drop">💧</span>
  <span className="logo-name">AquaGuard</span>
</div>

        <div className="menu-item active">
          <span>📊</span>
          Dashboard
        </div>

        <button
          type="button"
          className="menu-item menu-button"
          onClick={onReportIssue}
        >
          <span>🚰</span>
          Report Issue
        </button>

        <button
          type="button"
          className="menu-item menu-button"
          onClick={onWaterMap}
        >
          <span>🗺️</span>
          Water Map
        </button>

        <button
          type="button"
          className="menu-item menu-button"
          onClick={onAnalytics}
        >
          <span>📈</span>
          Analytics
        </button>

        <button
          type="button"
          className="menu-item menu-button"
          onClick={onRecommendations}
        >
          <span>💡</span>
          Recommendations
        </button>

        {/* ADMIN PANEL */}

        <button
          type="button"
          className="menu-item menu-button"
          onClick={onAdmin}
        >
          <span>👮</span>
          Admin Panel
        </button>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          ↪ Logout
        </button>

      </aside>

      {/* MAIN DASHBOARD */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <h1>
              Water Monitoring Dashboard
            </h1>

            <p>
              Monitor local water issues and
              community reports
            </p>
          </div>

          <div className="profile">
            👤 Community User
          </div>

        </header>

        {/* STAT CARDS */}

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-label">
              TOTAL REPORTS
            </div>

            <div className="stat-value">
              {reports.length}
            </div>

            <div className="stat-info">
              Community reports
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              HOTSPOTS
            </div>

            <div className="stat-value">
              {hotspotCount}
            </div>

            <div className="stat-info">
              Detected areas
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              HIGH RISK AREAS
            </div>

            <div className="stat-value">
              {highRiskAreas}
            </div>

            <div className="stat-info">
              Needs attention
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              WATER STATUS
            </div>

            <div className="stat-value">
              {riskLevel}
            </div>

            <div className="stat-info">
              Current overview
            </div>
          </div>

        </section>

        {/* SMART WATER RISK SCORE */}

        <section className="risk-score-card">

          <div className="risk-score-left">

            <div className="risk-score-label">
              💧 SMART WATER RISK SCORE
            </div>

            <div className="risk-score-number">
              {riskScore}
              <span>/100</span>
            </div>

            <div
              className={`risk-score-status ${riskLevel.toLowerCase()}`}
            >
              {riskLevel} Risk
            </div>

            <p>
              {riskScoreMessage}
            </p>

          </div>

          <div className="risk-score-right">

            <div className="risk-progress">

              <div
                className={`risk-progress-fill ${riskLevel.toLowerCase()}`}
                style={{
                  width: `${riskScore}%`,
                }}
              ></div>

            </div>

            <div className="risk-scale">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>

            <small>
              Score is calculated from active
              community reports and repeated
              problem locations.
            </small>

          </div>

        </section>

        {/* CONTENT GRID */}

        <section className="content-grid">

          {/* LEFT COLUMN */}

          <div>

            {/* LOCAL WATER MAP */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2>
                    Local Water Map
                  </h2>

                  <span>
                    Community monitoring
                  </span>
                </div>

              </div>

              <div className="water-map">
                <WaterMap
                  reports={reports}
                />
              </div>

            </div>

            {/* RECENT WATER REPORTS */}

            <div className="dashboard-card">

              <div className="card-header report-header">

                <div>

                  <h2>
                    Recent Water Reports
                  </h2>

                  <span>
                    {filteredReports.length} of{" "}
                    {reports.length} report
                    {reports.length !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>

              </div>

              {/* SEARCH + FILTER */}

              <div className="report-filters">

                <div className="report-search">

                  🔎

                  <input
                    type="text"
                    placeholder="Search location or issue..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                  />

                </div>

                <select
                  value={reportFilter}
                  onChange={(e) =>
                    setReportFilter(
                      e.target.value
                    )
                  }
                  className="report-filter-select"
                >

                  <option value="all">
                    All Reports
                  </option>

                  <option value="high">
                    High Risk
                  </option>

                  <option value="medium">
                    Medium Risk
                  </option>

                  <option value="low">
                    Low Risk
                  </option>

                  <option value="solved">
                    Solved
                  </option>

                </select>

              </div>

              {/* REPORTS */}

              {reports.length === 0 ? (

                <div className="empty-reports">

                  <div className="empty-icon">
                    💧
                  </div>

                  <p>
                    No community reports yet.
                  </p>

                  <small>
                    Submit a water issue to see
                    it here.
                  </small>

                </div>

              ) : filteredReports.length === 0 ? (

                <div className="empty-reports">

                  <div className="empty-icon">
                    🔎
                  </div>

                  <p>
                    No matching reports found.
                  </p>

                  <small>
                    Try a different location or
                    filter.
                  </small>

                </div>

              ) : (

                <div className="reports-list">

                  {filteredReports
                    .slice(0, 6)
                    .map((report) => {

                      const issue =
                        getIssueDetails(
                          report.issueType
                        );

                      const isSolved =
                        report.status ===
                        "Solved";

                      return (
                        <div
                          className={`report-item ${
                            isSolved
                              ? "report-solved"
                              : ""
                          }`}
                          key={report.id}
                        >

                          <div className="report-left">

                            {report.photo ? (

                              <img
                                src={report.photo}
                                alt="Water issue"
                                className="report-photo"
                              />

                            ) : (

                              <div className="report-icon">
                                {issue.icon}
                              </div>

                            )}

                            <div>

                              <div className="report-title">
                                {issue.title}
                              </div>

                              <div className="report-location">
                                📍{" "}
                                {report.location}
                              </div>

                              <div className="report-date">
                                📅{" "}
                                {report.date}
                              </div>

                              {isSolved && (
                                <div className="solved-status">
                                  ✓ Problem Solved
                                </div>
                              )}

                            </div>

                          </div>

                          <div className="report-actions-area">

                            {!isSolved && (
                              <div
                                className={`severity ${
                                  report.severity ||
                                  "low"
                                }`}
                              >
                                {(
                                  report.severity ||
                                  "low"
                                ).toUpperCase()}
                              </div>
                            )}

                            {isSolved && (
                              <div className="solved-badge">
                                SOLVED
                              </div>
                            )}

                            {!isSolved && (
                              <button
                                type="button"
                                className="solve-btn"
                                onClick={() =>
                                  markAsSolved(
                                    report.id
                                  )
                                }
                              >
                                ✓ Mark Solved
                              </button>
                            )}

                            {isSolved && (
                              <button
                                type="button"
                                className="delete-report-btn"
                                onClick={() =>
                                  deleteReport(
                                    report.id
                                  )
                                }
                              >
                                🗑 Delete
                              </button>
                            )}

                          </div>

                        </div>
                      );
                    })}

                </div>
              )}

            </div>

          </div>

          {/* RIGHT COLUMN */}

          <div>

            {/* RISK ASSESSMENT */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2>
                    Risk Assessment
                  </h2>

                  <span>
                    Live analysis
                  </span>
                </div>

              </div>

              <div className="risk-section">

                <div>

                  <div className="risk-number">
                    {highReports}
                  </div>

                  <div className="risk-text">
                    High Risk Reports
                  </div>

                </div>

                <div className="risk-items">

                  <div className="risk-item high">
                    <strong>
                      {highReports}
                    </strong>

                    <span>
                      High
                    </span>
                  </div>

                  <div className="risk-item medium">
                    <strong>
                      {mediumReports}
                    </strong>

                    <span>
                      Medium
                    </span>
                  </div>

                  <div className="risk-item low">
                    <strong>
                      {lowReports}
                    </strong>

                    <span>
                      Low
                    </span>
                  </div>

                </div>

              </div>

              <div className="risk-message">

                <strong>
                  Current Risk:{" "}
                  {riskLevel}
                </strong>

                <p>
                  {riskMessage}
                </p>

              </div>

            </div>

            {/* RECOMMENDATIONS */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2>
                    Recommendations
                  </h2>

                  <span>
                    Data-driven guidance
                  </span>
                </div>

              </div>

              <div className="recommendation-box">

                <h3>
                  {recommendationTitle}
                </h3>

                <p className="tip-text">
                  {recommendationText}
                </p>

              </div>

            </div>

            {/* COMMUNITY ACTION */}
<button
  type="button"
  className="report-main-button"
  onClick={onEmergency}
>
  🚨 Emergency Assistance
</button>
            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h2>
                    Community Action
                  </h2>
                </div>

              </div>

              <p className="tip-text">
                Help AquaGuard by reporting
                local water leakage, low water
                availability and groundwater
                observations.
              </p>

              <button
                type="button"
                className="report-main-button"
                onClick={onReportIssue}
              >
                + Report Water Issue
              </button>

            </div>

            {/* EMERGENCY PLUMBER CONTACTS */}

            <div className="dashboard-card plumber-section">

              <div className="card-header plumber-heading">

                <div>
                  <h2>
                    🔧 Emergency Plumber Contacts
                  </h2>

                  <span>
                    Contact a plumber for urgent
                    water leakage and repair issues
                  </span>
                </div>

                <span className="plumber-status">
                  ● Available
                </span>

              </div>

              <div className="plumber-grid">

                <div className="plumber-card">

                  <div className="plumber-icon">
                    👨‍🔧
                  </div>

                  <div className="plumber-info">

                    <h3>
                      Ravi Plumbing Services
                    </h3>

                    <p>
                      📍 Community Area
                    </p>

                    <strong>
                      📞 98765 43210
                    </strong>

                  </div>

                  <a
                    href="tel:9876543210"
                    className="plumber-call"
                  >
                    Call Now
                  </a>

                </div>

                <div className="plumber-card">

                  <div className="plumber-icon">
                    👨‍🔧
                  </div>

                  <div className="plumber-info">

                    <h3>
                      Sai Water Solutions
                    </h3>

                    <p>
                      📍 Nearby Area
                    </p>

                    <strong>
                      📞 91234 56789
                    </strong>

                  </div>

                  <a
                    href="tel:9123456789"
                    className="plumber-call"
                  >
                    Call Now
                  </a>

                </div>

                <div className="plumber-card">

                  <div className="plumber-icon">
                    👨‍🔧
                  </div>

                  <div className="plumber-info">

                    <h3>
                      Aqua Repair Team
                    </h3>

                    <p>
                      📍 Local Area
                    </p>

                    <strong>
                      📞 99887 66554
                    </strong>

                  </div>

                  <a
                    href="tel:9988766554"
                    className="plumber-call"
                  >
                    Call Now
                  </a>

                </div>

              </div>

              <div className="plumber-note">
                💡 For urgent leakage problems,
                contact an available plumber
                immediately.
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}
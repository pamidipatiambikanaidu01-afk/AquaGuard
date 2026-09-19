import { useEffect, useMemo, useState } from "react";

export default function AdminPanel({
  onBack,
  onWaterMap,
}) {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [selectedReport, setSelectedReport] =
    useState(null);

  // ==========================================
  // AUTHORITY NOTIFICATIONS
  // ==========================================

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  function loadNotifications() {
    const saved =
      JSON.parse(
        localStorage.getItem(
          "aquaGuardAuthorityNotifications"
        )
      ) || [];

    setNotifications(saved);
  }

  function openNotifications() {
    setShowNotifications(true);

    const updatedNotifications =
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }));

    setNotifications(updatedNotifications);

    localStorage.setItem(
      "aquaGuardAuthorityNotifications",
      JSON.stringify(updatedNotifications)
    );
  }

  function clearNotifications() {
    const confirmed =
      window.confirm(
        "Clear all authority notifications?"
      );

    if (!confirmed) {
      return;
    }

    setNotifications([]);

    localStorage.setItem(
      "aquaGuardAuthorityNotifications",
      JSON.stringify([])
    );

    setShowNotifications(false);
  }

  // ==========================================
  // LOAD REPORTS
  // ==========================================

  function loadReports() {
    const saved =
      JSON.parse(
        localStorage.getItem(
          "aquaGuardReports"
        )
      ) || [];

    setReports(saved);
  }

  useEffect(() => {
    loadReports();
    loadNotifications();

    window.addEventListener(
      "aquaGuardReportsUpdated",
      loadReports
    );

    window.addEventListener(
      "aquaGuardAuthorityNotificationsUpdated",
      loadNotifications
    );

    window.addEventListener(
      "storage",
      loadReports
    );

    window.addEventListener(
      "storage",
      loadNotifications
    );

    return () => {
      window.removeEventListener(
        "aquaGuardReportsUpdated",
        loadReports
      );

      window.removeEventListener(
        "aquaGuardAuthorityNotificationsUpdated",
        loadNotifications
      );

      window.removeEventListener(
        "storage",
        loadReports
      );

      window.removeEventListener(
        "storage",
        loadNotifications
      );
    };
  }, []);

  // ==========================================
  // SAVE REPORTS
  // ==========================================

  function saveReports(updatedReports) {
    setReports(updatedReports);

    localStorage.setItem(
      "aquaGuardReports",
      JSON.stringify(updatedReports)
    );

    window.dispatchEvent(
      new Event(
        "aquaGuardReportsUpdated"
      )
    );
  }

  // ==========================================
  // MARK REPORT AS SOLVED
  // ==========================================

  function markAsSolved(id) {
    const updatedReports =
      reports.map((report) =>
        report.id === id
          ? {
              ...report,
              status: "Solved",
            }
          : report
      );

    saveReports(updatedReports);
    setSelectedReport(null);
  }

  // ==========================================
  // DELETE REPORT
  // ==========================================

  function deleteReport(id) {
    const report =
      reports.find(
        (item) => item.id === id
      );

    if (!report) return;

    if (report.status !== "Solved") {
      alert(
        "Only solved reports can be deleted."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this solved report?"
      );

    if (!confirmed) return;

    const updatedReports =
      reports.filter(
        (item) => item.id !== id
      );

    saveReports(updatedReports);
    setSelectedReport(null);
  }

  // ==========================================
  // FILTERED REPORTS
  // ==========================================

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const text =
        `${report.issueType} ${report.location} ${report.description}`
          .toLowerCase();

      const matchesSearch =
        text.includes(
          search.toLowerCase()
        );

      const matchesSeverity =
        severityFilter === "all" ||
        report.severity ===
          severityFilter;

      const matchesStatus =
        statusFilter === "all" ||
        report.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [
    reports,
    search,
    severityFilter,
    statusFilter,
  ]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalReports =
    reports.length;

  const activeReports =
    reports.filter(
      (report) =>
        report.status !== "Solved"
    ).length;

  const solvedReports =
    reports.filter(
      (report) =>
        report.status === "Solved"
    ).length;

  const highRiskReports =
    reports.filter(
      (report) =>
        report.severity === "high" &&
        report.status !== "Solved"
    ).length;

  // ==========================================
  // HELPERS
  // ==========================================

  function getIssueName(issueType) {
    if (issueType === "leakage")
      return "Water Leakage";

    if (issueType === "availability")
      return "Low Water Availability";

    if (issueType === "groundwater")
      return "Groundwater Observation";

    return "Other Water Issue";
  }

  function getIssueIcon(issueType) {
    if (issueType === "leakage")
      return "🚰";

    if (issueType === "availability")
      return "💧";

    if (issueType === "groundwater")
      return "🌱";

    return "⚠️";
  }

  function getSeverityClass(severity) {
    if (severity === "high")
      return "admin-high";

    if (severity === "medium")
      return "admin-medium";

    return "admin-low";
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-page">

      <div className="admin-container">

        {/* HEADER */}

        <div className="admin-header">

          <div>
            <p className="admin-label">
              AUTHORITY CONTROL PANEL
            </p>

            <h1>
              👮 AquaGuard Admin
            </h1>

            <p>
              Monitor and manage community
              water issues
            </p>
          </div>

          <div className="admin-header-actions">

            {/* NOTIFICATIONS */}

            <button
              className="admin-map-btn"
              onClick={openNotifications}
            >
              🔔 Notifications
              {notifications.filter(
                (notification) =>
                  !notification.read
              ).length > 0 && (
                <span>
                  {" "}
                  (
                  {
                    notifications.filter(
                      (notification) =>
                        !notification.read
                    ).length
                  }
                  )
                </span>
              )}
            </button>

            <button
              className="admin-map-btn"
              onClick={onWaterMap}
            >
              📍 Water Map
            </button>

            <button
              className="admin-back-btn"
              onClick={onBack}
            >
              ← Dashboard
            </button>

          </div>

        </div>

        {/* STAT CARDS */}

        <div className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              📋
            </div>

            <div>
              <span>
                Total Reports
              </span>

              <strong>
                {totalReports}
              </strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              🔵
            </div>

            <div>
              <span>
                Active Reports
              </span>

              <strong>
                {activeReports}
              </strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              🔴
            </div>

            <div>
              <span>
                High Risk
              </span>

              <strong>
                {highRiskReports}
              </strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              ✅
            </div>

            <div>
              <span>
                Solved
              </span>

              <strong>
                {solvedReports}
              </strong>
            </div>
          </div>

        </div>

        {/* HIGH PRIORITY */}

        {highRiskReports > 0 && (
          <div className="admin-priority">

            <div className="admin-priority-title">

              <span>🔴</span>

              <div>
                <h2>
                  High Priority Issues
                </h2>

                <p>
                  Reports requiring attention
                </p>
              </div>

            </div>

            <div className="priority-list">

              {reports
                .filter(
                  (report) =>
                    report.severity ===
                      "high" &&
                    report.status !==
                      "Solved"
                )
                .slice(0, 3)
                .map((report) => (
                  <div
                    className="priority-item"
                    key={report.id}
                  >

                    <div className="priority-icon">
                      {getIssueIcon(
                        report.issueType
                      )}
                    </div>

                    <div className="priority-info">

                      <strong>
                        {getIssueName(
                          report.issueType
                        )}
                      </strong>

                      <span>
                        📍 {report.location}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        setSelectedReport(
                          report
                        )
                      }
                    >
                      View
                    </button>

                  </div>
                ))}

            </div>

          </div>
        )}

        {/* FILTERS */}

        <div className="admin-controls">

          <div className="admin-search">
            🔎

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <select
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Severity
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="Reported">
              Active
            </option>

            <option value="Solved">
              Solved
            </option>
          </select>

        </div>

        {/* REPORTS */}

        <div className="admin-reports">

          <div className="admin-section-title">

            <div>
              <h2>
                Community Reports
              </h2>

              <p>
                {filteredReports.length}{" "}
                reports displayed
              </p>
            </div>

          </div>

          {filteredReports.length ===
          0 ? (
            <div className="admin-empty">

              <div>📭</div>

              <h3>
                No reports found
              </h3>

              <p>
                Try changing your search
                or filters.
              </p>

            </div>
          ) : (
            <div className="admin-report-list">

              {filteredReports.map(
                (report) => (
                  <div
                    className={`admin-report-card ${
                      report.status ===
                      "Solved"
                        ? "admin-solved"
                        : ""
                    }`}
                    key={report.id}
                  >

                    <div className="admin-report-icon">
                      {getIssueIcon(
                        report.issueType
                      )}
                    </div>

                    <div className="admin-report-main">

                      <div className="admin-report-top">

                        <h3>
                          {getIssueName(
                            report.issueType
                          )}
                        </h3>

                        <span
                          className={`admin-severity ${getSeverityClass(
                            report.severity
                          )}`}
                        >
                          {(
                            report.severity ||
                            "low"
                          ).toUpperCase()}
                        </span>

                      </div>

                      <p className="admin-location">
                        📍{" "}
                        {report.location}
                      </p>

                      <p className="admin-description">
                        {report.description}
                      </p>

                      <div className="admin-report-meta">

                        <span>
                          📅 {report.date}
                        </span>

                        <span
                          className={
                            report.status ===
                            "Solved"
                              ? "status-solved"
                              : "status-active"
                          }
                        >
                          {report.status ===
                          "Solved"
                            ? "✓ Solved"
                            : "● Active"}
                        </span>

                      </div>

                    </div>

                    <div className="admin-report-actions">

                      <button
                        className="admin-view-btn"
                        onClick={() =>
                          setSelectedReport(
                            report
                          )
                        }
                      >
                        View
                      </button>

                      {report.status !==
                        "Solved" && (
                        <button
                          className="admin-solve-btn"
                          onClick={() =>
                            markAsSolved(
                              report.id
                            )
                          }
                        >
                          ✓ Solve
                        </button>
                      )}

                      {report.status ===
                        "Solved" && (
                        <button
                          className="admin-delete-btn"
                          onClick={() =>
                            deleteReport(
                              report.id
                            )
                          }
                        >
                          🗑
                        </button>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* REPORT DETAILS MODAL */}

      {selectedReport && (
        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedReport(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="admin-modal-close"
              onClick={() =>
                setSelectedReport(null)
              }
            >
              ×
            </button>

            <div className="admin-modal-icon">
              {getIssueIcon(
                selectedReport.issueType
              )}
            </div>

            <h2>
              {getIssueName(
                selectedReport.issueType
              )}
            </h2>

            <span
              className={`admin-severity ${getSeverityClass(
                selectedReport.severity
              )}`}
            >
              {(
                selectedReport.severity ||
                "low"
              ).toUpperCase()} RISK
            </span>

            <div className="admin-detail-box">

              <div>
                <strong>
                  📍 Location
                </strong>

                <p>
                  {selectedReport.location}
                </p>
              </div>

              <div>
                <strong>
                  📅 Date
                </strong>

                <p>
                  {selectedReport.date}
                </p>
              </div>

              <div>
                <strong>
                  📊 Status
                </strong>

                <p>
                  {selectedReport.status}
                </p>
              </div>

              <div>
                <strong>
                  📝 Description
                </strong>

                <p>
                  {selectedReport.description}
                </p>
              </div>

            </div>

            {selectedReport.photo && (
              <div className="admin-photo-box">

                <strong>
                  📷 Evidence Photo
                </strong>

                <img
                  src={selectedReport.photo}
                  alt="Water issue"
                />

              </div>
            )}

            <div className="admin-modal-actions">

              {selectedReport.status !==
                "Solved" && (
                <button
                  className="admin-solve-large"
                  onClick={() =>
                    markAsSolved(
                      selectedReport.id
                    )
                  }
                >
                  ✓ Mark as Solved
                </button>
              )}

              <button
                className="admin-close-large"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          AUTHORITY NOTIFICATIONS MODAL
          ========================================== */}

      {showNotifications && (
        <div
          className="admin-modal-overlay"
          onClick={() =>
            setShowNotifications(false)
          }
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="admin-modal-close"
              onClick={() =>
                setShowNotifications(false)
              }
            >
              ×
            </button>

            <div className="admin-modal-icon">
              🔔
            </div>

            <h2>
              Authority Notifications
            </h2>

            {notifications.length === 0 ? (

              <div className="admin-detail-box">

                <div>
                  <strong>
                    📭 No Notifications
                  </strong>

                  <p>
                    New community reports and
                    emergency alerts will appear
                    here.
                  </p>
                </div>

              </div>

            ) : (

              <div className="admin-detail-box">

                {notifications.map(
                  (notification) => (

                    <div
                      key={notification.id}
                      style={{
                        marginBottom:
                          "16px",
                        paddingBottom:
                          "16px",
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >

                      <strong>
                        {notification.type ===
                        "emergency"
                          ? "🚨 "
                          : "🔔 "}

                        {notification.title}
                      </strong>

                      <p>
                        {notification.message}
                      </p>

                      <p>
                        📍{" "}
                        {notification.location}
                      </p>

                      {notification.severity && (
                        <p>
                          ⚠️ Severity:{" "}
                          {notification.severity.toUpperCase()}
                        </p>
                      )}

                      {notification.date && (
                        <p>
                          📅{" "}
                          {notification.date}
                        </p>
                      )}

                      {notification.createdAt && (
                        <small>
                          Received:{" "}
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </small>
                      )}

                    </div>

                  )
                )}

              </div>

            )}

            {notifications.length > 0 && (
              <div className="admin-modal-actions">

                <button
                  className="admin-solve-large"
                  onClick={clearNotifications}
                >
                  🗑 Clear Notifications
                </button>

                <button
                  className="admin-close-large"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                >
                  Close
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
import { useState } from "react";

export default function ReportIssue({
  onBack,
  onSubmitted,
}) {
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");

  // ==========================================
  // PHOTO UPLOAD
  // ==========================================

  function handlePhoto(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  // ==========================================
  // CURRENT LOCATION
  // ==========================================

  function handleLocation() {
    if (!navigator.geolocation) {
      alert(
        "Location is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        setLocation(
          `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        );
      },
      () => {
        alert(
          "Unable to get your location. Please enter it manually."
        );
      }
    );
  }

  // ==========================================
  // SUBMIT REPORT
  // ==========================================

  function handleSubmit(event) {
    event.preventDefault();

    if (!issueType) {
      alert("Please select an issue type.");
      return;
    }

    if (!location.trim()) {
      alert("Please enter the location.");
      return;
    }

    if (!date) {
      alert("Please select the date.");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the water issue.");
      return;
    }

    const newReport = {
      id: Date.now(),
      issueType,
      location: location.trim(),
      severity,
      date,
      description: description.trim(),
      photo,
      status: "Reported",
    };

    // ==========================================
    // SAVE REPORT
    // ==========================================

    const existingReports =
      JSON.parse(
        localStorage.getItem("aquaGuardReports")
      ) || [];

    const updatedReports = [
      newReport,
      ...existingReports,
    ];

    localStorage.setItem(
      "aquaGuardReports",
      JSON.stringify(updatedReports)
    );

    // ==========================================
    // AUTHORITY NOTIFICATION
    // ==========================================

    const issueNames = {
      leakage: "Water Leakage",
      availability: "Low Water Availability",
      groundwater: "Groundwater Observation",
      other: "Other Water Issue",
    };

    const authorityNotification = {
      id: Date.now() + 1,
      type: "report",
      title: "New Water Issue Reported",
      message: `${issueNames[issueType]} reported at ${location.trim()}.`,
      issueType,
      location: location.trim(),
      severity,
      date,
      description: description.trim(),
      photo,
      reportId: newReport.id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const existingNotifications =
      JSON.parse(
        localStorage.getItem(
          "aquaGuardAuthorityNotifications"
        )
      ) || [];

    const updatedNotifications = [
      authorityNotification,
      ...existingNotifications,
    ];

    localStorage.setItem(
      "aquaGuardAuthorityNotifications",
      JSON.stringify(updatedNotifications)
    );

    // Notify Admin Panel immediately
    window.dispatchEvent(
      new Event(
        "aquaGuardAuthorityNotificationsUpdated"
      )
    );

    // Update Dashboard and Water Map immediately
    window.dispatchEvent(
      new Event("aquaGuardReportsUpdated")
    );

    alert(
      "Water issue reported successfully!\n\nAuthority has been notified."
    );

    if (onSubmitted) {
      onSubmitted();
    }
  }

  return (
    <div className="report-page">

      <div className="report-container">

        {/* ======================================
            HEADER
            ====================================== */}

        <div className="report-header">

          <div>
            <h1>
              Report Water Issue
            </h1>

            <p>
              Help AquaGuard monitor local
              water conditions
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            ← Dashboard
          </button>

        </div>

        {/* ======================================
            FORM
            ====================================== */}

        <form
          className="report-form"
          onSubmit={handleSubmit}
        >

          {/* ISSUE TYPE */}

          <div className="form-group">

            <label>
              Issue Type
            </label>

            <div className="issue-options">

              <button
                type="button"
                className={`issue-option ${
                  issueType === "leakage"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setIssueType("leakage")
                }
              >
                🚰 Water Leakage
              </button>

              <button
                type="button"
                className={`issue-option ${
                  issueType === "availability"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setIssueType("availability")
                }
              >
                💧 Low Water Availability
              </button>

              <button
                type="button"
                className={`issue-option ${
                  issueType === "groundwater"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setIssueType("groundwater")
                }
              >
                🌱 Groundwater Observation
              </button>

              <button
                type="button"
                className={`issue-option ${
                  issueType === "other"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setIssueType("other")
                }
              >
                ⚠️ Other Issue
              </button>

            </div>

          </div>

          {/* LOCATION */}

          <div className="form-group">

            <label>
              Location
            </label>

            <div className="location-row">

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value
                  )
                }
                placeholder="Enter location"
              />

              <button
                type="button"
                className="location-btn"
                onClick={handleLocation}
              >
                📍 Use My Location
              </button>

            </div>

          </div>

          {/* SEVERITY */}

          <div className="form-group">

            <label>
              Severity
            </label>

            <div className="severity-options">

              <button
                type="button"
                className={`severity-option low ${
                  severity === "low"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSeverity("low")
                }
              >
                LOW
              </button>

              <button
                type="button"
                className={`severity-option medium ${
                  severity === "medium"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSeverity("medium")
                }
              >
                MEDIUM
              </button>

              <button
                type="button"
                className={`severity-option high ${
                  severity === "high"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSeverity("high")
                }
              >
                HIGH
              </button>

            </div>

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe the water issue..."
              rows="5"
            />

          </div>

          {/* PHOTO */}

          <div className="form-group">

            <label>
              Upload Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
            />

            {photo && (
              <div className="photo-preview">

                <img
                  src={photo}
                  alt="Water issue preview"
                />

              </div>
            )}

          </div>

          {/* ==================================
              BUTTONS
              ================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onBack}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
            >
              🚰 Submit Report
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
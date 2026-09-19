import { useState } from "react";

export default function Emergency({
  onBack,
  onSubmitted,
}) {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  function handleLocation() {
    if (!navigator.geolocation) {
      alert("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation(
          `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        );
      },
      () => {
       alert(
  "🚨 Emergency reported successfully!\n\nThe authority notification has been added to the Admin Panel."
        );
      }
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!location.trim()) {
      alert("Please enter the emergency location.");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the emergency.");
      return;
    }

    const newReport = {
      id: Date.now(),
      issueType: "emergency",
      location: location.trim(),
      severity: "high",
      date: new Date().toISOString().split("T")[0],
      description: description.trim(),
      photo: "",
      status: "Reported",
      emergency: true,
      createdAt: new Date().toISOString(),
    };

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

    const existingNotifications =
      JSON.parse(
        localStorage.getItem(
          "aquaGuardAuthorityNotifications"
        )
      ) || [];

    const notification = {
      id: `EM-${Date.now()}`,
      reportId: newReport.id,
      type: "emergency",
      title: "🚨 Emergency Water Issue",
      message: newReport.description,
      location: newReport.location,
      severity: "emergency",
      createdAt: new Date().toISOString(),
      read: false,
    };

    localStorage.setItem(
      "aquaGuardAuthorityNotifications",
      JSON.stringify([
        notification,
        ...existingNotifications,
      ])
    );

    window.dispatchEvent(
      new Event("aquaGuardReportsUpdated")
    );

    window.dispatchEvent(
      new Event(
        "aquaGuardAuthorityNotificationsUpdated"
      )
    );

    alert(
      "🚨 Emergency reported successfully! Authorities have been notified."
    );

    if (onSubmitted) {
      onSubmitted();
    }
  }

  return (
    <div className="report-page">

      <div className="report-container">

        <div className="report-header">

          <div>
            <h1>
              🚨 Emergency Assistance
            </h1>

            <p>
              Report an urgent water-related
              emergency
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

        <form
          className="report-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Emergency Location
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
                placeholder="Enter emergency location"
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

          <div className="form-group">

            <label>
              Emergency Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe the emergency..."
              rows="6"
            />

          </div>

          <div className="form-group">

            <label>
              Emergency Contact
            </label>

            <a
              href="tel:112"
              className="plumber-call"
            >
              📞 Call Emergency Services
            </a>

          </div>

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
              🚨 Notify Authorities
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
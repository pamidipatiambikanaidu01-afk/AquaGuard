import { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);

  const loadAlerts = () => {
    try {
      const data =
        JSON.parse(
          localStorage.getItem(
            "aquaGuardAuthorityNotifications"
          )
        ) || [];

      setAlerts(data);
    } catch {
      setAlerts([]);
    }
  };

  useEffect(() => {
    loadAlerts();

    const handleUpdate = () => {
      loadAlerts();
    };

    window.addEventListener(
      "aquaGuardAuthorityNotificationsUpdated",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "aquaGuardAuthorityNotificationsUpdated",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );
    };
  }, []);

  const unreadAlerts = alerts.filter(
    (alert) => !alert.read
  );

  const markAsRead = (id) => {
    const updated = alerts.map((alert) =>
      alert.id === id
        ? { ...alert, read: true }
        : alert
    );

    setAlerts(updated);

    localStorage.setItem(
      "aquaGuardAuthorityNotifications",
      JSON.stringify(updated)
    );
  };

  const markAllAsRead = () => {
    const updated = alerts.map((alert) => ({
      ...alert,
      read: true,
    }));

    setAlerts(updated);

    localStorage.setItem(
      "aquaGuardAuthorityNotifications",
      JSON.stringify(updated)
    );
  };

  const getIcon = (alert) => {
    if (alert.type === "emergency") {
      return "🚨";
    }

    if (
      alert.severity === "high" ||
      alert.severity === "High"
    ) {
      return "🔴";
    }

    return "🔔";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "25px",
        right: "30px",
        zIndex: 9999,
      }}
    >
      {/* ALERT BUTTON */}

      <button
        onClick={() =>
          setShowAlerts(!showAlerts)
        }
        style={{
          border: "none",
          background: "#ffffff",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          cursor: "pointer",
          fontSize: "22px",
          boxShadow:
            "0 5px 18px rgba(0, 100, 120, 0.18)",
          position: "relative",
        }}
        aria-label="Open alerts"
      >
        🔔

        {unreadAlerts.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-3px",
              minWidth: "20px",
              height: "20px",
              padding: "0 5px",
              borderRadius: "20px",
              background: "#ef4444",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #fff",
            }}
          >
            {unreadAlerts.length}
          </span>
        )}
      </button>

      {/* ALERT PANEL */}

      {showAlerts && (
        <div
          style={{
            position: "absolute",
            top: "58px",
            right: "0",
            width: "340px",
            maxHeight: "450px",
            overflowY: "auto",
            background: "#ffffff",
            borderRadius: "18px",
            boxShadow:
              "0 15px 40px rgba(0, 70, 90, 0.2)",
            border:
              "1px solid rgba(0, 150, 160, 0.12)",
            padding: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#075985",
                  fontSize: "18px",
                }}
              >
                🔔 Alerts
              </h3>

              <span
                style={{
                  fontSize: "12px",
                  color: "#78909c",
                }}
              >
                AquaGuard notifications
              </span>
            </div>

            {unreadAlerts.length > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#008c95",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "35px 10px",
                color: "#78909c",
              }}
            >
              <div
                style={{
                  fontSize: "35px",
                  marginBottom: "8px",
                }}
              >
                ✨
              </div>

              <div
                style={{
                  fontWeight: "700",
                }}
              >
                No alerts
              </div>

              <div
                style={{
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                Everything looks clear.
              </div>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() =>
                  markAsRead(alert.id)
                }
                style={{
                  padding: "13px",
                  marginBottom: "10px",
                  borderRadius: "12px",
                  background: alert.read
                    ? "#f7fbfb"
                    : "#eefafa",
                  borderLeft:
                    alert.type === "emergency"
                      ? "4px solid #ef4444"
                      : alert.severity === "high"
                      ? "4px solid #f59e0b"
                      : "4px solid #14b8a6",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "9px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    {getIcon(alert)}
                  </span>

                  <div>
                    <strong
                      style={{
                        color: "#164e63",
                        fontSize: "13px",
                      }}
                    >
                      {alert.title ||
                        "Water Issue Alert"}
                    </strong>

                    <p
                      style={{
                        margin:
                          "5px 0 4px",
                        color: "#526b73",
                        fontSize: "12px",
                        lineHeight: "1.5",
                      }}
                    >
                      {alert.message}
                    </p>

                    {alert.location && (
                      <div
                        style={{
                          color: "#78909c",
                          fontSize: "11px",
                        }}
                      >
                        📍 {alert.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
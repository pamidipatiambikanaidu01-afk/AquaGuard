import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

// ==========================================
// FIX DEFAULT LEAFLET MARKER
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ==========================================
// MAP AUTO UPDATE
// ==========================================

function MapUpdater({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (!reports.length) return;

    const coordinates = reports
      .map((report) =>
        getCoordinates(report.location)
      )
      .filter(Boolean);

    if (coordinates.length === 1) {
      map.setView(
        coordinates[0],
        15
      );
    }

    if (coordinates.length > 1) {
      map.fitBounds(coordinates, {
        padding: [50, 50],
      });
    }
  }, [reports, map]);

  return null;
}

// ==========================================
// GET GPS COORDINATES
// ==========================================

function getCoordinates(location) {
  if (!location) {
    return null;
  }

  const match = String(location)
    .trim()
    .match(
      /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
    );

  if (!match) {
    return null;
  }

  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lng)
  ) {
    return null;
  }

  return [lat, lng];
}

// ==========================================
// ICONS
// ==========================================

function getIssueIcon(issueType) {
  if (issueType === "leakage") {
    return "🚰";
  }

  if (issueType === "availability") {
    return "💧";
  }

  if (issueType === "groundwater") {
    return "🌱";
  }

  return "⚠️";
}

// ==========================================
// CUSTOM ICON
// ==========================================

function createIssueIcon(issueType) {
  return L.divIcon({
    className: "aquaguard-map-icon",

    html: `
      <div class="aquaguard-marker">
        ${getIssueIcon(issueType)}
      </div>
    `,

    iconSize: [42, 42],

    iconAnchor: [21, 21],

    popupAnchor: [0, -21],
  });
}

// ==========================================
// RISK COLOR
// ==========================================

function getRiskColor(severity) {
  if (severity === "high") {
    return "#e53935";
  }

  if (severity === "medium") {
    return "#f4a100";
  }

  return "#25a66a";
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function WaterMap({
  reports: reportProp,
}) {
  const [storedReports, setStoredReports] =
    useState(() => {
      return (
        JSON.parse(
          localStorage.getItem(
            "aquaGuardReports"
          )
        ) || []
      );
    });

  // ========================================
  // LOAD REPORTS
  // ========================================

  useEffect(() => {
    const loadReports = () => {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "aquaGuardReports"
          )
        ) || [];

      setStoredReports(saved);
    };

    window.addEventListener(
      "aquaGuardReportsUpdated",
      loadReports
    );

    window.addEventListener(
      "storage",
      loadReports
    );

    return () => {
      window.removeEventListener(
        "aquaGuardReportsUpdated",
        loadReports
      );

      window.removeEventListener(
        "storage",
        loadReports
      );
    };
  }, []);

  const reports = Array.isArray(reportProp)
    ? reportProp
    : storedReports;

  // ========================================
  // ACTIVE REPORTS
  // ========================================

  const activeReports = reports.filter(
    (report) =>
      report.status !== "Solved"
  );

  // ========================================
  // REPORTS WITH GPS
  // ========================================

  const mappedReports = activeReports
    .map((report) => ({
      ...report,
      coordinates: getCoordinates(
        report.location
      ),
    }))
    .filter(
      (report) =>
        report.coordinates !== null
    );

  return (
    <div className="water-map-container">

      {/* ==================================
          HEADER
          ================================== */}

      <div className="map-top-info">

        <div>
          <strong>
            Community Water Monitoring
          </strong>

          <span>
            Live water issue locations
          </span>
        </div>

        <div className="map-live">

          <span className="live-dot"></span>

          Live

        </div>

      </div>

      {/* ==================================
          REAL MAP
          ================================== */}

      <div className="real-water-map">

        <MapContainer
          center={[
            17.385,
            78.4867,
          ]}
          zoom={12}
          scrollWheelZoom={true}
          className="leaflet-map"
        >

          {/* OPEN STREET MAP */}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* AUTO MOVE MAP */}

          <MapUpdater
            reports={mappedReports.map(
              (report) =>
                report.coordinates
            )}
          />

          {/* ==================================
              REPORT MARKERS
              ================================== */}

          {mappedReports.map(
            (report) => {

              const color =
                getRiskColor(
                  report.severity
                );

              return (
                <Marker
                  key={report.id}
                  position={
                    report.coordinates
                  }
                  icon={createIssueIcon(
                    report.issueType
                  )}
                >

                  <Popup>

                    <div className="map-popup">

                      <div
                        className="popup-main-icon"
                        style={{
                          borderColor:
                            color,
                        }}
                      >
                        {getIssueIcon(
                          report.issueType
                        )}
                      </div>

                      <h3>
                        {report.issueType ===
                        "leakage"
                          ? "Water Leakage"
                          : report.issueType ===
                            "availability"
                          ? "Low Water Availability"
                          : report.issueType ===
                            "groundwater"
                          ? "Groundwater Observation"
                          : "Other Water Issue"}
                      </h3>

                      <p>
                        📍{" "}
                        <strong>
                          {report.location}
                        </strong>
                      </p>

                      <p>
                        📅{" "}
                        {report.date}
                      </p>

                      <p>
                        ⚠️ Severity:{" "}
                        <strong
                          style={{
                            color,
                          }}
                        >
                          {(
                            report.severity ||
                            "low"
                          ).toUpperCase()}
                        </strong>
                      </p>

                      <p className="popup-description">
                        {
                          report.description
                        }
                      </p>

                      {report.photo && (
                        <img
                          src={report.photo}
                          alt="Reported water issue"
                          className="map-report-photo"
                        />
                      )}

                    </div>

                  </Popup>

                </Marker>
              );
            }
          )}

        </MapContainer>

        {/* ==================================
            MAP LEGEND
            ================================== */}

        <div className="real-map-legend">

          <strong>
            Water Risk Areas
          </strong>

          <div>
            <span className="legend-high"></span>
            High Risk
          </div>

          <div>
            <span className="legend-medium"></span>
            Medium Risk
          </div>

          <div>
            <span className="legend-low"></span>
            Low Risk
          </div>

        </div>

        {/* ==================================
            NO GPS REPORT MESSAGE
            ================================== */}

        {activeReports.length > 0 &&
          mappedReports.length === 0 && (
            <div className="map-no-location">
              📍 No GPS locations available.
              <br />
              Use <strong>
                "Use My Location"
              </strong>{" "}
              while reporting an issue.
            </div>
          )}

      </div>

      {/* ==================================
          MAP FOOTER
          ================================== */}

      <div className="map-footer">

        <div>
          <strong>
            {activeReports.length}
          </strong>

          Active Reports
        </div>

        <div>

          <strong>
            {
              activeReports.filter(
                (r) =>
                  r.severity ===
                  "high"
              ).length
            }
          </strong>

          High Risk

        </div>

        <div>

          <strong>
            {
              new Set(
                activeReports
                  .map(
                    (r) =>
                      r.location
                  )
                  .filter(Boolean)
              ).size
            }
          </strong>

          Locations

        </div>

      </div>

    </div>
  );
}
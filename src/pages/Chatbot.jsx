import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! 👋 I'm Ripple, your AquaGuard water assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");

  const getReports = () => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("aquaGuardReports")
        ) || []
      );
    } catch {
      return [];
    }
  };

  const getActiveReports = () => {
    return getReports().filter(
      (report) =>
        report.status !== "Solved" &&
        report.status !== "Resolved"
    );
  };

  const getAlerts = () => {
    const reports = getActiveReports();

    const emergencyAlerts = reports.filter(
      (report) =>
        report.emergency ||
        report.issueType === "emergency"
    );

    const highAlerts = reports.filter(
      (report) =>
        report.severity === "high" ||
        report.severity === "High"
    );

    return {
      total: reports.length,
      emergency: emergencyAlerts.length,
      high: highAlerts.length,
    };
  };

  const getReply = (question) => {
    const q = question.toLowerCase().trim();

    // GREETING
    if (/^(hi|hello|hey|hii|hiii)$/.test(q)) {
      return "Hello! 👋 I'm Ripple, your AquaGuard assistant. You can ask me about water reports, leakage, water map, analytics, risk levels, groundwater, recommendations and alerts.";
    }

    // LEAKAGE RECOMMENDATION
    if (
      q.includes("leak recommendation") ||
      q.includes("leakage recommendation") ||
      q.includes("what should i do for leakage") ||
      q.includes("what to do for leakage")
    ) {
      return "💧 Leakage Recommendation:\n1. Report the exact location.\n2. Select the correct severity.\n3. If possible, avoid wasting the leaking water.\n4. For serious leakage, contact the emergency plumber service.\n5. Monitor the reported location until the issue is solved.";
    }

    // LOW WATER AVAILABILITY RECOMMENDATION
    if (
      q.includes("availability recommendation") ||
      q.includes("shortage recommendation") ||
      q.includes("what should i do for shortage") ||
      q.includes("what to do for water shortage")
    ) {
      return "🚱 Water Availability Recommendation:\n1. Report the affected location.\n2. Record when the shortage occurs.\n3. Use available water carefully.\n4. Check whether nearby areas are also affected.\n5. Repeated reports can help authorities identify supply problems.";
    }

    // GROUNDWATER RECOMMENDATION
    if (
      q.includes("groundwater recommendation") ||
      q.includes("ground water recommendation") ||
      q.includes("what should i do for groundwater")
    ) {
      return "🌱 Groundwater Recommendation:\n1. Report unusual groundwater changes.\n2. Avoid unnecessary groundwater usage.\n3. Support rainwater harvesting and recharge practices.\n4. Monitor repeated groundwater observations.\n5. Report serious changes so the affected area can be monitored.";
    }

    // EMERGENCY RECOMMENDATION
    if (
      q.includes("emergency recommendation") ||
      q.includes("what should i do in emergency") ||
      q.includes("what to do in emergency")
    ) {
      return "🚨 Emergency Recommendation:\n1. Move away from unsafe water or damaged infrastructure.\n2. Report the exact location immediately.\n3. Describe the emergency clearly.\n4. Use the Emergency Assistance option in AquaGuard.\n5. For immediate emergency help, use the emergency contact provided in the app.";
    }

    // WATER QUALITY RECOMMENDATION
    if (
      q.includes("water quality recommendation") ||
      q.includes("what should i do about water quality") ||
      q.includes("unsafe water")
    ) {
      return "💧 Water Quality Recommendation:\n1. Avoid consuming water that appears unsafe.\n2. Report the affected location.\n3. Describe unusual colour, smell or visible contamination.\n4. Monitor repeated reports from the same area.\n5. Follow official local water-safety guidance.";
    }

    // GENERAL RECOMMENDATION
    if (
      q.includes("recommendation") ||
      q.includes("recommendations") ||
      q.includes("suggestion") ||
      q.includes("suggest")
    ) {
      return "💡 AquaGuard Recommendations:\n• 🚰 Leakage → report and repair the affected area quickly.\n• 🚱 Low availability → monitor supply and conserve water.\n• 🌱 Groundwater → monitor changes and support recharge practices.\n• 💧 Water quality → report possible contamination and follow safety guidance.\n• 🚨 Emergency → use Emergency Assistance and provide the exact location.";
    }

    // ALERTS
    if (
      q.includes("alert") ||
      q.includes("alerts") ||
      q.includes("notification") ||
      q.includes("notifications") ||
      q.includes("any problem") ||
      q.includes("any issues")
    ) {
      const alerts = getAlerts();

      if (alerts.total === 0) {
        return "🔔 AquaGuard Alert:\nNo active water issues are currently recorded. Your community monitoring status looks clear.";
      }

      let reply = `🔔 AquaGuard Alerts:\n\nActive reports: ${alerts.total}\n`;

      if (alerts.emergency > 0) {
        reply += `🚨 Emergency alerts: ${alerts.emergency}\n`;
      }

      if (alerts.high > 0) {
        reply += `🔴 High-severity alerts: ${alerts.high}\n`;
      }

      reply +=
        "\nPlease check the Dashboard and Admin Panel for detailed reports and locations.";

      return reply;
    }

    // REPORT LEAKAGE
    if (
      q.includes("leak") ||
      q.includes("leakage") ||
      q.includes("pipe") ||
      q.includes("broken pipe")
    ) {
      return "🚰 If you notice a water leakage, go to the Report Issue section, select Leakage, enter the location and severity, and submit the report.";
    }

    // REPORT ISSUE
    if (
      q.includes("report") ||
      q.includes("how can i report") ||
      q.includes("how to report")
    ) {
      return "📝 To report a water problem, open the Report Issue section, select the issue type, enter the location, choose the severity and submit your report.";
    }

    // WATER MAP
    if (
      q.includes("water map") ||
      q.includes("map") ||
      q.includes("show location") ||
      q.includes("locations")
    ) {
      return "🗺️ The Water Map displays reported water problems at different locations. You can use it to identify areas with active issues and risk levels.";
    }

    // ANALYTICS
    if (
      q.includes("analytics") ||
      q.includes("analysis") ||
      q.includes("statistics") ||
      q.includes("stats")
    ) {
      return "📊 Analytics provides an overview of reported issues, issue types, severity levels and solved reports. It helps understand the overall community water situation.";
    }

    // HIGH RISK
    if (
      q.includes("high risk") ||
      q.includes("what is high") ||
      q.includes("high-risk")
    ) {
      return "🔴 High risk means the reported area needs urgent attention. Multiple serious reports or repeated problems can increase the risk level.";
    }

    // MEDIUM RISK
    if (
      q.includes("medium risk") ||
      q.includes("what is medium") ||
      q === "medium"
    ) {
      return "🟡 Medium risk means the area needs regular monitoring. The issue may become more serious if it is not addressed.";
    }

    // LOW RISK
    if (
      q.includes("low risk") ||
      q.includes("what is low") ||
      q === "low"
    ) {
      return "🟢 Low risk means the current reported problem is relatively manageable, but the area should still be monitored.";
    }

    // RISK SCORE
    if (
      q.includes("risk score") ||
      q.includes("risk level") ||
      q.includes("how is risk calculated") ||
      q.includes("calculate risk")
    ) {
      return "⚠️ AquaGuard calculates risk using factors such as issue severity and repeated reports from the same location. Higher severity and repeated problems increase the risk score.";
    }

    // WATER QUALITY
    if (
      q.includes("water quality") ||
      q.includes("quality of water") ||
      q.includes("is the water safe")
    ) {
      return "💧 Water quality can be monitored by checking reported contamination-related issues, repeated problems and community observations. AquaGuard helps track these reports by location.";
    }

    // GROUNDWATER
    if (
      q.includes("groundwater") ||
      q.includes("ground water")
    ) {
      return "🌱 Groundwater observations help identify changes in local water conditions. Repeated groundwater-related reports can help the community monitor affected areas.";
    }

    // WATER AVAILABILITY
    if (
      q.includes("availability") ||
      q.includes("water shortage") ||
      q.includes("shortage") ||
      q.includes("water supply")
    ) {
      return "💧 If water availability or supply is low, report the affected location. AquaGuard can then track the issue and help identify areas that need attention.";
    }

    // SOLVED REPORT
    if (
      q.includes("solved") ||
      q.includes("resolve") ||
      q.includes("resolved")
    ) {
      return "✅ A report can be marked as solved after the reported water problem has been addressed. Solved reports remain available for tracking.";
    }

    // DELETE REPORT
    if (
      q.includes("delete") ||
      q.includes("remove report")
    ) {
      return "🗑️ In AquaGuard, a report can be deleted after it has been marked as solved. This helps prevent active problems from being removed accidentally.";
    }

    // DASHBOARD
    if (
      q.includes("dashboard") ||
      q.includes("home page")
    ) {
      return "🏠 The Dashboard gives you a quick overview of total reports, hotspots, high-risk areas, overall risk level and recent community reports.";
    }

    // HOTSPOTS
    if (
      q.includes("hotspot") ||
      q.includes("hot spots")
    ) {
      return "📍 Hotspots are locations where water-related problems have been reported. Repeated reports from the same location can indicate an important problem area.";
    }

    // PLUMBER
    if (
      q.includes("plumber") ||
      q.includes("repair") ||
      q.includes("plumbing")
    ) {
      return "🔧 For urgent leakage or repair problems, use the Emergency Plumber Contacts section on the Dashboard to contact an available plumber.";
    }

    // COMMUNITY ACTION
    if (
      q.includes("community") ||
      q.includes("help community")
    ) {
      return "🤝 Community members can help by reporting water problems accurately, providing the correct location and severity, and monitoring existing issues.";
    }

    // THANK YOU
    if (
      q.includes("thank you") ||
      q.includes("thanks") ||
      q === "thank"
    ) {
      return "You're welcome! 💧 I'm Ripple, always here to help with AquaGuard.";
    }

    // BYE
    if (
      q === "bye" ||
      q === "goodbye"
    ) {
      return "Goodbye! 👋 Keep helping your community monitor water problems with AquaGuard. 💧";
    }

    // HELP
    if (
      q === "help" ||
      q.includes("what can you do") ||
      q.includes("what do you do")
    ) {
      return "💧 I'm Ripple! I can help you with Water Reports, Leakage, Water Map, Analytics, Risk Levels, Groundwater, Water Availability, Recommendations, Alerts, Hotspots and Emergency Assistance.";
    }

    // DEFAULT
    return "💧 I didn't completely understand that question. Try asking about Water Map, Leakage, Reports, Analytics, Risk Level, Groundwater, Water Availability, Recommendations or Alerts.";
  };

  const sendMessage = () => {
    const text = input.trim();

    if (!text) return;

    const userMessage = {
      type: "user",
      text: text,
    };

    const botMessage = {
      type: "bot",
      text: getReply(text),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage,
    ]);

    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I report a leakage?",
    "What recommendation for leakage?",
    "What is the water map?",
    "How is risk calculated?",
    "What alerts are active?",
  ];

  const askQuickQuestion = (question) => {
    const userMessage = {
      type: "user",
      text: question,
    };

    const botMessage = {
      type: "bot",
      text: getReply(question),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage,
    ]);

    setInput("");
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON */}

      {!open && (
        <button
          className="chatbot-floating-button"
          onClick={() => setOpen(true)}
          aria-label="Open Ripple Assistant"
        >
          <span className="chatbot-floating-icon">
            💬
          </span>

          <span className="chatbot-notification">
            1
          </span>
        </button>
      )}

      {/* CHAT WINDOW */}

      {open && (
        <div className="chatbot-window">

          {/* HEADER */}

          <div className="chatbot-header">

            <div className="chatbot-header-left">

              <div className="chatbot-avatar">
                💧
              </div>

              <div>
                <strong
                  style={{
                    background:
                      "linear-gradient(90deg, #0077b6, #00a6a6, #20c997)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Ripple
                </strong>

                <span>
                  <i></i>
                  Online
                </span>
              </div>

            </div>

            <button
              className="chatbot-close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

          </div>

          {/* MESSAGES */}

          <div className="chatbot-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.type === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >

                {message.type === "bot" && (
                  <div className="message-avatar">
                    💧
                  </div>
                )}

                <div className="message-bubble">
                  {message.text}
                </div>

              </div>
            ))}

          </div>

          {/* QUICK QUESTIONS */}

          {messages.length === 1 && (
            <div className="chatbot-quick">

              <span>
                Quick questions
              </span>

              {quickQuestions.map(
                (question, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      askQuickQuestion(question)
                    }
                  >
                    {question}
                  </button>
                )
              )}

            </div>
          )}

          {/* INPUT */}

          <div className="chatbot-input-area">

            <input
              type="text"
              placeholder="Ask Ripple..."
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
}
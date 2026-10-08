
import { useState } from "react";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I can help you understand diabetic retinopathy and the DIAIRIS screening system.",
    },
  ]);

  const quickQuestions = [
    "What is diabetic retinopathy?",
    "How does DIAIRIS work?",
    "What are the symptoms?",
    "How can I prevent it?",
  ];

  const getReply = (text) => {
    const question = text.toLowerCase();

    if (
      question.includes("what is") &&
      question.includes("retinopathy")
    ) {
      return "Diabetic retinopathy is an eye condition caused by diabetes that can damage the blood vessels of the retina. Early screening can help identify retinal changes.";
    }

    if (
      question.includes("diairis") ||
      question.includes("work")
    ) {
      return "DIAIRIS is an AI-assisted retinal screening platform. You can upload a retinal image in Detection, where the trained model analyzes the image and provides a screening result.";
    }

    if (
      question.includes("symptom") ||
      question.includes("sign")
    ) {
      return "Common symptoms may include blurred vision, floaters, difficulty seeing at night and changes in vision. Early diabetic retinopathy may also have no noticeable symptoms.";
    }

    if (
      question.includes("prevent") ||
      question.includes("prevention")
    ) {
      return "Managing blood sugar, blood pressure and cholesterol, having regular eye examinations and following medical advice can help reduce the risk of diabetic eye complications.";
    }

    return "I can help with basic information about diabetic retinopathy, DIAIRIS screening, symptoms and prevention. Try asking me one of these questions.";
  };

  const sendMessage = (text = message) => {
    if (!text.trim()) return;

    const userMessage = text.trim();
    const reply = getReply(userMessage);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
      {
        sender: "bot",
        text: reply,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="diairis-chatbot">

      {open && (
        <div className="chatbot-window">

          {/* HEADER */}
          <div className="chatbot-header">
            <div>
              <strong>DIAIRIS Assistant</strong>
              <span>Eye health information</span>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          {/* CHAT BODY */}
          <div className="chatbot-body">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "chat-message user-message"
                    : "chat-message bot-message"
                }
              >

                {msg.sender === "bot" && (
                  <div className="bot-avatar">D</div>
                )}

                <div className="chat-message-content">
                  {msg.text}
                </div>

              </div>
            ))}

            {/* QUICK QUESTIONS */}
            {messages.length === 1 && (
              <div className="chatbot-questions">

                <p>Quick questions</p>

                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}

              </div>
            )}

          </div>

          {/* INPUT */}
          <div className="chatbot-input-area">

            <input
              type="text"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={() => sendMessage()}>
              →
            </button>

          </div>

        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        className={`chatbot-button ${
          open ? "chatbot-button-open" : ""
        }`}
        onClick={() => setOpen(!open)}
        aria-label="Open DIAIRIS Assistant"
      >
        <span>✦</span>
      </button>

    </div>
  );
}

export default Chatbot;


import { useState } from "react";
import Modal from "./Modal";

export default function ContributeModal({ open, onClose }) {
  const [done, setDone] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    setDone(true);
    setTimeout(() => {
      setDone(false);
      onClose();
    }, 2500);
  }
  return (
    <Modal open={open} onClose={onClose} title="Contribute Study Materials">
      {done ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#dcfce7",
              border: "2px solid #16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              fontSize: 24,
            }}
          >
            ✓
          </div>
          <h3
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: 20,
              color: "var(--heading)",
              marginBottom: 8,
            }}
          >
            Thank you for contributing
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6 }}>
            We will review your materials and contact you within a week.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-3)",
              lineHeight: 1.6,
              marginBottom: 18,
            }}
          >
            Share notes, solved papers, or practical files. Our team reviews and
            publishes within a week.
          </p>
          {[
            {
              label: "Your Name",
              type: "text",
              placeholder: "Enter your name",
            },
            {
              label: "Email Address",
              type: "email",
              placeholder: "your@email.com",
            },
            {
              label: "Branch and Subject",
              type: "text",
              placeholder: "e.g. CS - Data Structures (SE Sem 3)",
            },
          ].map((f) => (
            <div className="form-group" key={f.label}>
              <label className="form-label">{f.label}</label>
              <input
                className="form-input"
                type={f.type}
                placeholder={f.placeholder}
                required
              />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Type of Material</label>
            <select className="form-select" required>
              <option value="">Select material type</option>
              <option>Unit Notes (PDF or DOC)</option>
              <option>Previous Year Question Paper</option>
              <option>Practical File or Tutorial</option>
              <option>Lecture Slides</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Google Drive Link or Message</label>
            <textarea
              className="form-textarea"
              placeholder="Paste a Google Drive link to your file, or describe what you want to contribute..."
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px",
              fontSize: 15,
            }}
          >
            Submit Contribution
          </button>
        </form>
      )}
    </Modal>
  );
}

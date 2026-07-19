import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            maxWidth: 480,
            margin: "80px auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28,
              color: "var(--heading)",
              marginBottom: 10,
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "var(--text-3)", marginBottom: 24, lineHeight: 1.6 }}>
            This page hit an unexpected error. Try reloading — if it keeps
            happening, let us know.
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

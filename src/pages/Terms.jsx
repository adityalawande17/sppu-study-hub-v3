import { useSEO } from "../hooks/useSEO";
export default function Terms() {
  useSEO({
    title: "Terms of Use | SPPUStudyHUB",
    description:
      "Terms of Use for SPPUStudyHUB — educational use, intellectual property, disclaimer and affiliate disclosure.",
  });
  return (
    <div className="page-wrap">
      <div className="subject-header" style={{ paddingTop: 28 }}>
        <h1>Terms of Use</h1>
        <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 6 }}>
          Last updated: January 2025
        </p>
      </div>
      <div className="legal-wrap">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using SPPUStudyHUB you accept and agree to be bound
          by these Terms of Use. If you do not agree please do not use this
          website.
        </p>
        <h2>Educational Purpose Only</h2>
        <p>
          All content on SPPUStudyHUB is provided strictly for educational
          purposes. Study materials, notes, and question papers are shared to
          assist students in academic preparation and should not be used for any
          commercial purpose.
        </p>
        <h2>Intellectual Property</h2>
        <p>
          SPPUStudyHUB does not claim ownership of university materials,
          official question papers, or syllabus documents that belong to
          Savitribai Phule Pune University or affiliated institutions.
          Student-contributed notes remain the intellectual property of their
          respective authors.
        </p>
        <h2>User Contributions</h2>
        <p>
          By submitting materials you confirm that you have the right to share
          them, they do not violate any copyright, and you grant SPPUStudyHUB a
          non-exclusive right to publish them on this website.
        </p>
        <h2>Disclaimer</h2>
        <p>
          Materials are provided as-is without warranty of accuracy or
          completeness. Students are advised to verify information against
          official SPPU resources. SPPUStudyHUB is not liable for any academic
          outcomes based on materials found on this website.
        </p>
      </div>
    </div>
  );
}

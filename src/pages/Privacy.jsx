import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
export default function Privacy() {
  useSEO({ title: 'Privacy Policy | sppuwalestudent', description: 'Privacy Policy for sppuwalestudent — cookies, advertising, affiliate links and data handling.' })
  return (
    <div className="page-wrap">
      <div className="subject-header" style={{ paddingTop: 28 }}><h1>Privacy Policy</h1><p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 6 }}>Last updated: January 2025</p></div>
      <div className="legal-wrap">
        <h2>Information We Collect</h2>
        <p>sppuwalestudent does not collect personal information unless you voluntarily submit it through our contribute or contact forms. When you submit a form we collect your name and email address solely to respond to your inquiry.</p>
        <p>We may automatically collect non-personal information including browser type, operating system, and pages visited to improve the website.</p>
        <h2>Cookies and Advertising</h2>
        <p>This website uses Google AdSense to display advertisements. Google AdSense may use cookies to serve personalised ads based on your prior visits. You can opt out at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
        <p>We store your theme preference, selected pattern (2019/2024), and bookmarked subjects in your browser's local storage. This data never leaves your device.</p>
        <h2>Affiliate Links</h2>
        <p>This website contains affiliate links to Amazon and Flipkart. When you click these links and make a purchase we may earn a small commission at no extra cost to you. All affiliate links are clearly labelled.</p>
        <h2>Children's Privacy</h2>
        <p>This website is intended for engineering college students who are generally 17 years of age and older. We do not knowingly collect information from children under 13.</p>
        <h2>Contact</h2>
        <p>If you have questions about this Privacy Policy please use our <Link to="/contact">contact form</Link>.</p>
      </div>
    </div>
  )
}

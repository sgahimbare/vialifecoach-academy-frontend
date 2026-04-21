export type PolicySection = {
  slug: string;
  title: string;
  summary: string;
  details: string[];
};

export type PolicyDocument = {
  key: "terms" | "privacy" | "cookies";
  title: string;
  subtitle: string;
  lastUpdated: string;
  backPath: "/terms" | "/privacy" | "/cookies";
  sections: PolicySection[];
};

export const policyDocuments: Record<PolicyDocument["key"], PolicyDocument> = {
  terms: {
    key: "terms",
    title: "Terms of Service",
    subtitle: "Clear standards for using Vialifecoach Academy safely, lawfully, and responsibly.",
    lastUpdated: "February 26, 2026",
    backPath: "/terms",
    sections: [
      {
        slug: "eligibility-account-use",
        title: "1. Eligibility and Account Use",
        summary:
          "You must provide accurate account data and keep your account secure.",
        details: [
          "Your account information should be complete and truthful because course access, support, and verification depend on it.",
          "You are responsible for all activity on your account, including actions taken by anyone who has your login details.",
          "If you believe your account has been accessed without permission, reset your password immediately and notify support.",
          "Sharing accounts may lead to access suspension where it creates security, licensing, or compliance issues.",
        ],
      },
      {
        slug: "acceptable-use",
        title: "2. Platform Access and Acceptable Use",
        summary:
          "You can use the platform for lawful learning purposes and must not abuse it.",
        details: [
          "Access is granted as a limited license for personal or authorized institutional learning.",
          "You must not attempt to disrupt systems, scrape protected resources, or bypass role-based access controls.",
          "Automated misuse, harmful scripts, harassment, and fraudulent behavior are prohibited.",
          "Violations can trigger temporary or permanent account restrictions.",
        ],
      },
      {
        slug: "intellectual-property",
        title: "3. Course Content and Intellectual Property",
        summary:
          "Course materials are protected and cannot be reused without permission.",
        details: [
          "Videos, lesson text, assignments, design assets, and branding are protected by copyright and related rights.",
          "You may view and use course content for enrolled learning only, unless explicit reuse rights are granted.",
          "Re-uploading paid or protected materials to external sites is not allowed.",
          "If you need licensing for organization-wide reuse, request written approval from the academy.",
        ],
      },
      {
        slug: "payments-enrollment",
        title: "4. Payments and Enrollment",
        summary:
          "Enrollment and paid access are governed by the pricing and billing terms shown at checkout.",
        details: [
          "Pricing, access duration, and included features are defined on the purchase page or custom agreement.",
          "Failed payment methods can pause premium access until billing is resolved.",
          "Promotions and discounts may be time-limited and subject to eligibility rules.",
          "Where applicable by law, refunds follow the policy shown at checkout or in an institutional agreement.",
        ],
      },
      {
        slug: "user-content-conduct",
        title: "5. User Content and Conduct",
        summary:
          "Community and assignment content must remain lawful, respectful, and non-infringing.",
        details: [
          "Posts, submissions, and messages must not contain unlawful, hateful, abusive, or infringing material.",
          "You retain ownership of your submissions but grant necessary rights for platform delivery and moderation.",
          "We may moderate or remove content that breaks platform rules or legal requirements.",
          "Repeat violations can result in account suspension.",
        ],
      },
      {
        slug: "service-availability",
        title: "6. Service Changes and Availability",
        summary:
          "Features may evolve over time, and uninterrupted availability cannot be guaranteed.",
        details: [
          "We continuously improve product capabilities, which may include interface, workflow, and content updates.",
          "Maintenance windows or incidents may temporarily affect access.",
          "Critical changes are rolled out to preserve security, reliability, and compatibility.",
          "Where possible, we provide notice before major user-facing changes.",
        ],
      },
      {
        slug: "disclaimers-liability",
        title: "7. Disclaimers and Limitation of Liability",
        summary:
          "The service is provided as available, with liability limits allowed by law.",
        details: [
          "Educational outcomes can vary by user effort, context, and external factors.",
          "The platform does not guarantee specific career, business, or personal results.",
          "To the extent permitted by law, indirect or consequential damages are excluded.",
          "Nothing in this section overrides mandatory legal protections in your jurisdiction.",
        ],
      },
      {
        slug: "termination",
        title: "8. Termination",
        summary:
          "Accounts can be suspended or closed for misuse, risk, or legal obligations.",
        details: [
          "Serious security, legal, or policy violations may require immediate account action.",
          "You may discontinue use at any time, and can request account closure through support.",
          "Some records may be retained where legally required or needed for dispute resolution.",
          "Termination does not cancel obligations that remain valid by nature, including IP protections.",
        ],
      },
      {
        slug: "terms-updates",
        title: "9. Updates to These Terms",
        summary:
          "Terms may change over time, with updates published and dated.",
        details: [
          "The latest version is always available on the Terms page.",
          "Material updates may be highlighted through notices or account communications.",
          "Continued use after updates means acceptance of revised terms.",
          "If you disagree with updates, you should stop using the service and contact support.",
        ],
      },
      {
        slug: "terms-contact",
        title: "10. Contact",
        summary:
          "Reach out for legal, contractual, or account-use questions.",
        details: [
          "General legal and terms inquiries: support@vialifecoach.org.",
          "When contacting support, include your account email and a clear description of your issue.",
          "For institutional contracts, include your organization name and primary account owner.",
        ],
      },
    ],
  },
  privacy: {
    key: "privacy",
    title: "Privacy Policy",
    subtitle: "How we collect, protect, and responsibly process your information.",
    lastUpdated: "February 26, 2026",
    backPath: "/privacy",
    sections: [
      {
        slug: "information-we-collect",
        title: "1. Information We Collect",
        summary:
          "We collect account, usage, and technical data needed to run the platform.",
        details: [
          "Account data may include your name, email, role, and profile information you provide.",
          "Learning data may include enrolled courses, lesson progress, and activity timestamps.",
          "Technical data may include device/browser details, IP-related logs, and security events.",
          "We collect only what is reasonably necessary for delivery, security, compliance, and improvement.",
        ],
      },
      {
        slug: "how-we-use-information",
        title: "2. How We Use Information",
        summary:
          "Data is used for access, progress tracking, support, security, and service improvement.",
        details: [
          "Authentication data is used to secure login and enforce role-based access.",
          "Course and progress data are used to provide dashboards, learning continuity, and completion insights.",
          "Support interactions help resolve issues and improve service quality.",
          "Operational analytics help us improve reliability, performance, and usability.",
        ],
      },
      {
        slug: "legal-basis-processing",
        title: "3. Legal Basis and Processing",
        summary:
          "Processing is based on service necessity, legal obligations, legitimate interests, or consent.",
        details: [
          "When you enroll or use the platform, processing is often necessary to deliver contracted services.",
          "Certain records are processed to meet legal, regulatory, and security requirements.",
          "Some processing may rely on legitimate interests, balanced against user rights.",
          "Where required, we request and respect consent preferences.",
        ],
      },
      {
        slug: "sharing-disclosure",
        title: "4. Sharing and Disclosure",
        summary:
          "We use vetted service providers and do not sell personal data.",
        details: [
          "We may share data with processors that provide hosting, infrastructure, analytics, and communication tools.",
          "Service providers are contractually required to protect data and process it only for approved purposes.",
          "We may disclose information when required by law or to protect rights, safety, and platform integrity.",
          "We do not sell personal information as a business model.",
        ],
      },
      {
        slug: "data-retention",
        title: "5. Data Retention",
        summary:
          "Data is retained only as long as needed for service, compliance, and dispute resolution.",
        details: [
          "Retention periods vary by data type, legal requirements, and business necessity.",
          "Inactive accounts may be archived or deleted according to retention policy and applicable law.",
          "Certain records may remain where legally required, such as security logs or billing compliance records.",
          "We review retention practices periodically to minimize unnecessary data storage.",
        ],
      },
      {
        slug: "privacy-security",
        title: "6. Security",
        summary:
          "We use layered security controls to protect personal information.",
        details: [
          "Controls may include secure transport, access controls, monitoring, and incident response procedures.",
          "Internal access is limited to authorized personnel with business need.",
          "Security controls are reviewed and improved as threats evolve.",
          "No platform can guarantee absolute security; users should also protect passwords and devices.",
        ],
      },
      {
        slug: "rights-choices",
        title: "7. Your Rights and Choices",
        summary:
          "Depending on location, users may request access, correction, deletion, and other privacy rights.",
        details: [
          "You may request a copy of personal data and ask for corrections where information is inaccurate.",
          "You may request deletion or restriction, subject to lawful exceptions.",
          "You can object to certain processing or request portability where applicable.",
          "We respond to valid privacy requests within legally required timeframes.",
        ],
      },
      {
        slug: "international-transfers",
        title: "8. International Transfers",
        summary:
          "Cross-border transfers are protected with safeguards required by applicable privacy laws.",
        details: [
          "Where data moves across regions, we apply transfer mechanisms and contractual protections as required.",
          "Regional legal frameworks may affect the specific safeguards used.",
          "We assess provider controls before enabling international processing flows.",
        ],
      },
      {
        slug: "privacy-updates",
        title: "9. Policy Updates",
        summary:
          "Privacy policy changes are published with updated effective dates.",
        details: [
          "The latest policy version is always available on the website.",
          "Material changes may be highlighted via notice banners or account communications.",
          "Continued use after updates indicates acceptance of revised policy terms where legally permitted.",
        ],
      },
      {
        slug: "privacy-contact",
        title: "10. Contact",
        summary:
          "Contact us for privacy questions or data-rights requests.",
        details: [
          "Email privacy and data-rights inquiries to support@vialifecoach.org.",
          "Include your account email and country/state to help us apply correct legal workflow.",
          "Do not send sensitive credentials in plain email.",
        ],
      },
    ],
  },
  cookies: {
    key: "cookies",
    title: "Cookie Policy",
    subtitle: "How cookies and similar tools support secure and personalized platform use.",
    lastUpdated: "February 26, 2026",
    backPath: "/cookies",
    sections: [
      {
        slug: "what-are-cookies",
        title: "1. What Are Cookies",
        summary:
          "Cookies are small files that help websites remember sessions and preferences.",
        details: [
          "Cookies are stored in your browser and may include session or persistent identifiers.",
          "They help recognize returning users and maintain continuity between page loads.",
          "Related technologies can include local storage and similar browser-based mechanisms.",
        ],
      },
      {
        slug: "types-of-cookies",
        title: "2. Types of Cookies We Use",
        summary:
          "We use essential, functional, and analytics cookies for core platform experience.",
        details: [
          "Essential cookies support login sessions, access controls, and security protections.",
          "Functional cookies remember preferences such as language or interface settings.",
          "Analytics cookies help evaluate platform usage patterns to improve quality.",
        ],
      },
      {
        slug: "why-we-use-cookies",
        title: "3. Why We Use Cookies",
        summary:
          "Cookies support reliability, personalization, and product improvement.",
        details: [
          "They reduce repeated login prompts and improve session continuity.",
          "They help detect suspicious activity and support fraud prevention.",
          "They provide insights into performance bottlenecks and user journey improvements.",
        ],
      },
      {
        slug: "third-party-cookies",
        title: "4. Third-Party Technologies",
        summary:
          "Trusted providers may set cookies for analytics, hosting, or embedded services.",
        details: [
          "Third-party processors are selected based on security, reliability, and contractual compliance.",
          "These providers operate under their own privacy terms in addition to our platform commitments.",
          "We review integrations periodically and remove tools that no longer meet standards.",
        ],
      },
      {
        slug: "managing-cookies",
        title: "5. Managing Cookie Preferences",
        summary:
          "You can manage cookies through browser controls, with tradeoffs for functionality.",
        details: [
          "Browser settings can block, delete, or limit cookie storage.",
          "Disabling essential cookies may prevent sign-in and session-dependent features.",
          "Preference changes may need refresh or re-login to fully apply.",
        ],
      },
      {
        slug: "cookie-updates",
        title: "6. Updates to This Policy",
        summary:
          "Cookie practices may be updated based on legal and technical changes.",
        details: [
          "The newest version is posted on this page with a revised date.",
          "Material changes may include updated categories or new third-party tooling disclosures.",
          "Continued use after updates indicates acceptance where permitted by law.",
        ],
      },
      {
        slug: "cookie-contact",
        title: "7. Contact",
        summary:
          "Contact support for cookie and tracking questions.",
        details: [
          "Send questions to support@vialifecoach.org with subject line 'Cookie Policy'.",
          "Include your browser/device context if reporting consent or preference issues.",
        ],
      },
    ],
  },
};

export function getPolicyDocument(key: string) {
  if (key === "terms" || key === "privacy" || key === "cookies") return policyDocuments[key];
  return null;
}

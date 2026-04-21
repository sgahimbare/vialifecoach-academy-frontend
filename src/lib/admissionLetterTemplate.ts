export type AdmissionLetterFields = {
  applicantName: string;
  programName: string;
  programDuration?: string;
  startDate?: string;
  locationMode?: string;
  registrationDeadline?: string;
  orientationDate?: string;
  firstDayOfClasses?: string;
  tuitionFees?: string;
  paymentDeadline?: string;
  campusAddress?: string;
  administratorName?: string;
  admissionType?: string;
  acceptanceConfirmation?: string;
  documentationNote?: string;
  letterBodyHtml?: string;
  logoDataUrl?: string;
};

const fallback = (value?: string, placeholder = "") => (value && value.trim() ? value : placeholder);

const DEFAULT_BODY = "<p>On behalf of the entire Vialifecoach Academy community, I am delighted to extend our warmest congratulations on your successful admission to the <strong>[Program Name]</strong> program for the current academic year.</p>\n<p>Your application demonstrated exceptional merit and potential, and we believe you will make significant contributions to our learning environment. This admission reflects our confidence in your ability to excel academically and thrive personally.</p>\n<p>We are excited to welcome you to the Vialifecoach Academy community and look forward to your contribution to our learning environment.</p>";

export function buildAdmissionLetterHtml(fields: AdmissionLetterFields) {
  const year = new Date().getFullYear();
  const dateLine = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const resolvedBody = (fields.letterBodyHtml || DEFAULT_BODY)
    .replace(/\[Program Name\]/g, fields.programName || "")
    .replace(/\[Applicant Name\]/g, fields.applicantName || "");

  const logoSrc = fields.logoDataUrl || "https://i.postimg.cc/dDPqTDcm/vialife.png";
  return `
<div style="font-family: 'Georgia', line-height: 1.6, color: #1a1a1a; max-width: 680px; margin: 0 auto; padding: 32px 24px; border: 2px solid #e5e7eb; border-radius: 10px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px; border-bottom: 3px solid #2563eb; padding-bottom: 16px;">
    <img src="${logoSrc}" alt="Vialifecoach Academy" style="width: 76px; height: 76px; margin-bottom: 8px;" />
    <h1 style="color: #2563eb; font-size: 26px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Vialifecoach Academy</h1>
    <p style="color: #6c757d; font-size: 13px; margin: 8px 0 0;">OFFICIAL ADMISSION COMMUNICATION</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h2 style="color: #111827; font-size: 18px; font-weight: bold; margin-bottom: 8px;">Re: Admission Offer</h2>
    <p style="color: #6b7280; font-size: 14px; margin: 0;">Academic Year: ${year}</p>
    <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0;">Date: ${dateLine}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="color: #2563eb; font-size: 17px; font-weight: bold; margin-bottom: 10px;">Dear ${fields.applicantName || "Applicant"},</h3>
    <div style="color: #374151; font-size: 15px;">${resolvedBody || ""}</div>
  </div>

  <div style="margin-bottom: 20px;">
    <h4 style="color: #2563eb; font-size: 15px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Program Details</h4>
    <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; width: 180px; background: #f9fafb;">Program</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #1f2937;">${fallback(fields.programName)}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Duration</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #1f2937;">${fallback(fields.programDuration)}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Start Date</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #1f2937;">${fallback(fields.startDate)}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Location/Mode</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #1f2937;">${fallback(fields.locationMode)}</td>
      </tr>
    </table>
  </div>

  <div style="margin-bottom: 20px;">
    <h4 style="color: #2563eb; font-size: 15px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Admission Status</h4>
    <div style="background: #ecfdf5; border: 1px solid #d1fae5; border-left: 4px solid #10b981; padding: 14px; margin-bottom: 12px;">
      <p style="margin: 0; color: #065f46; font-weight: bold;">APPLICATION STATUS: ACCEPTED</p>
      <p style="margin: 6px 0 0; color: #374151;"><strong>Admission Type:</strong> ${fallback(fields.admissionType)}</p>
    </div>
  </div>

  <div style="margin-bottom: 20px;">
    <h4 style="color: #2563eb; font-size: 15px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Next Steps</h4>
    <ol style="color: #374151; font-size: 15px; line-height: 1.6; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 8px;"><strong style="color: #2563eb;">Acceptance Confirmation:</strong> ${fallback(fields.acceptanceConfirmation)}</li>
      <li style="margin-bottom: 8px;"><strong style="color: #2563eb;">Registration:</strong> Complete registration by ${fallback(fields.registrationDeadline)}</li>
      <li style="margin-bottom: 8px;"><strong style="color: #2563eb;">Orientation:</strong> Attend the orientation session on ${fallback(fields.orientationDate)}</li>
      <li style="margin-bottom: 8px;"><strong style="color: #2563eb;">Documentation:</strong> ${fallback(fields.documentationNote)}</li>
    </ol>
  </div>

  <div style="margin-bottom: 20px;">
    <h4 style="color: #2563eb; font-size: 15px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Financial Information</h4>
    <table style="width: 100%; border-collapse: collapse; background: #ffffff;">
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; width: 180px; background: #f9fafb;">Tuition Fees</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #1f2937;">${fallback(fields.tuitionFees)}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Payment Deadline</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #1f2937;">${fallback(fields.paymentDeadline)}</td>
      </tr>
    </table>
  </div>

  <div style="margin-bottom: 20px;">
    <h4 style="color: #2563eb; font-size: 15px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Contact Information</h4>
    <p style="margin: 0; color: #374151;">academy@vialifecoach.org | Phone: +254792965970</p>
    <p style="margin: 6px 0 0; color: #374151;">${fallback(fields.campusAddress)}</p>
  </div>

  <div style="margin-top: 28px; border-top: 2px solid #e5e7eb; padding-top: 14px; text-align: center;">
    <p style="margin: 0; color: #6b7280; font-size: 13px;"><strong>Sincerely,</strong></p>
    <p style="margin: 6px 0 0; color: #111827; font-weight: bold;">${fallback(fields.administratorName)}</p>
    <p style="margin: 2px 0 0; color: #6b7280; font-size: 12px;">Admissions Director • Vialifecoach Academy</p>
    <p style="margin: 10px 0 0; color: #6b7280; font-size: 11px;">This letter is generated electronically and is valid without signature.</p>
  </div>
</div>
  `;
}

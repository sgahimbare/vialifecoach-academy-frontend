import { buildApiUrl } from "@/lib/api";

export interface Certificate {
  id: string;
  student_name: string;
  course_title: string;
  course_description: string;
  issue_date: string;
  certificate_code: string;
  certificate_html: string;
  certificate_pdf_url?: string;
  status: string;
  student_email?: string;
}

export interface CertificatePreview {
  html: string;
  template_info: {
    title: string;
    description: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

export interface PublicCertificateStats {
  totalIssued: number;
  issuedThisMonth: number;
  verificationRate: number;
}

export const certificateService = {
  // Get certificate preview (public)
  async getCertificatePreview(): Promise<string> {
    // Return a beautiful, professional certificate template
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Certificate of Completion</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
}

body {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    font-family: 'Montserrat', sans-serif;
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
}

body::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 20% 20%, rgba(198, 167, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(198, 167, 94, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(198, 167, 94, 0.05) 0%, transparent 70%);
    pointer-events: none;
}

.certificate {
    background: linear-gradient(145deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%);
    width: min(980px, calc(100vw - 40px));
    max-width: calc(100vw - 40px);
    min-height: 460px;
    border-radius: 2px;
    box-shadow: 
        0 30px 60px rgba(0,0,0,0.25),
        0 15px 30px rgba(0,0,0,0.15),
        0 5px 15px rgba(0,0,0,0.1),
        inset 0 2px 0 rgba(255,255,255,0.8),
        inset 0 -2px 0 rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(198, 167, 94, 0.3);
    margin: 0 auto;
}

.certificate::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        linear-gradient(45deg, transparent 48%, rgba(198, 167, 94, 0.02) 49%, rgba(198, 167, 94, 0.02) 51%, transparent 52%),
        linear-gradient(-45deg, transparent 48%, rgba(198, 167, 94, 0.02) 49%, rgba(198, 167, 94, 0.02) 51%, transparent 52%),
        radial-gradient(circle at 15% 85%, rgba(198, 167, 94, 0.04) 0%, transparent 40%),
        radial-gradient(circle at 85% 15%, rgba(198, 167, 94, 0.04) 0%, transparent 40%),
        url('https://i.postimg.cc/dDPqTDcm/vialife.png') no-repeat center;
    background-size: 
        100px 100px,
        100px 100px,
        200px 200px,
        200px 200px;
    opacity: 0.03;
    z-index: 1;
}

.certificate::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 1px solid rgba(198, 167, 94, 0.4);
    border-radius: 0;
    pointer-events: none;
    z-index: 2;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}

.certificate-content {
    position: relative;
    z-index: 3;
    padding: clamp(24px, 5vw, 70px) clamp(18px, 6vw, 80px);
    text-align: center;
}

.header {
    margin-bottom: 58px;
}

.school-name {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    letter-spacing: 2.4px;
    margin-bottom: 22px;
    line-height: 1.2;
    text-transform: uppercase;
    white-space: nowrap;
    font-variant: small-caps;
}

.certificate-type {
    display: inline-block;
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    color: #8f6d23;
    letter-spacing: 2px;
    padding: 0 0 10px;
    border: none;
    border-bottom: 2px solid rgba(143, 109, 35, 0.5);
    margin: 20px 0 0;
    position: relative;
    background: transparent;
}

.certificate-type::before {
    content: none;
}

.main-content {
    margin: 66px 0 60px;
}

.certify-text {
    font-size: 20px;
    color: #4a4a4a;
    margin-bottom: 25px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.student-name {
    font-family: 'Playfair Display', serif;
    font-size: 50px;
    font-weight: 700;
    color: #111827;
    margin: 28px auto 24px;
    padding: 0 24px 14px;
    border-bottom: 2px solid rgba(198, 167, 94, 0.65);
    letter-spacing: 1px;
    line-height: 1.2;
    display: inline-block;
    min-width: 62%;
}

.student-name::before {
    content: none;
}

.course-info {
    margin: 50px 0;
}

.course-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-style: italic;
    color: #2c3e50;
    margin-bottom: 20px;
    font-weight: 600;
}

.course-description {
    font-size: 18px;
    color: #5a6c7d;
    line-height: 1.7;
    max-width: 650px;
    margin: 0 auto;
    font-weight: 400;
}

.completion-date {
    margin: 45px 0;
    font-size: 18px;
    color: #4a4a4a;
    font-weight: 500;
    padding: 12px 30px;
    background: rgba(198, 167, 94, 0.08);
    border-radius: 25px;
    display: inline-block;
    border: 1px solid rgba(198, 167, 94, 0.2);
}

.footer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: end;
    gap: clamp(18px, 3vw, 48px);
    margin-top: 70px;
    padding: 0 20px;
}

.signature-section {
    text-align: left;
    width: 100%;
    max-width: none;
    min-width: 0;
}

.signature-line {
    width: min(220px, 100%);
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #333 20%, #333 80%, transparent 100%);
    margin: 15px 0 8px 0;
}

.signature-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
}

.signature-title {
    font-size: 14px;
    color: #6c757d;
    margin-top: 5px;
    font-weight: 400;
}

.logo-section {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: end;
    padding-bottom: 6px;
}

.footer-logo {
    width: 124px;
    height: 124px;
    opacity: 0.9;
    filter: grayscale(0%);
    border-radius: 50%;
    background: white;
    box-shadow: 
        0 8px 25px rgba(0,0,0,0.15),
        0 4px 10px rgba(0,0,0,0.1),
        inset 0 2px 0 rgba(255,255,255,0.8);
    border: 2px solid rgba(198, 167, 94, 0.3);
    object-fit: cover;
}

.footer-logo-text {
    width: 124px;
    height: 124px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 700;
    color: #8f6d23;
    background: linear-gradient(145deg, #ffffff 0%, #fafafa 100%);
    border-radius: 50%;
    box-shadow: 
        0 8px 25px rgba(0,0,0,0.15),
        0 4px 10px rgba(0,0,0,0.1),
        inset 0 2px 0 rgba(255,255,255,0.8);
    border: 2px solid rgba(198, 167, 94, 0.3);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.qr-section {
    text-align: right;
    width: 100%;
    max-width: none;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 0;
}

.qr-code {
    width: 90px;
    height: 90px;
    background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #adb5bd;
    margin-left: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.qr-text {
    font-size: 12px;
    color: #6c757d;
    margin-top: 10px;
    font-weight: 500;
}

.certificate-id {
    position: absolute;
    bottom: 25px;
    right: 35px;
    font-size: 13px;
    color: #6c757d;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    background: rgba(255,255,255,0.8);
    padding: 5px 12px;
    border-radius: 15px;
    border: 1px solid #e9ecef;
}

@media (max-width: 1000px) {
    .certificate {
        width: 100%;
        max-width: 100%;
        margin: 0;
    }
    
    .certificate-content {
        padding: 28px 24px;
    }
    
    .student-name {
        font-size: 34px;
        min-width: 80%;
    }

    .school-name {
        font-size: 24px;
        letter-spacing: 2px;
        white-space: normal;
        font-variant: normal;
    }

    .certificate-type {
        font-size: 22px;
        letter-spacing: 1.2px;
        padding: 10px 22px;
    }

    .footer {
        grid-template-columns: 1fr;
        gap: 16px;
        justify-items: center;
        text-align: center;
    }

    .signature-section,
    .qr-section {
        text-align: center;
        margin-left: 0;
        align-items: center;
    }

    .logo-section {
        order: 2;
    }

    .qr-section {
        order: 3;
    }
}
</style>
</head>
<body>
<div class="certificate">
    <div class="certificate-content">
        <div class="header">
            <div class="school-name">VIALIFECOACH GLOBAL FOUNDATION</div>
            <div class="certificate-type">CERTIFICATE OF COMPLETION</div>
        </div>
        
        <div class="main-content">
            <div class="certify-text">This is to proudly certify that</div>
            <div class="student-name">Recipient Name</div>
            <div class="certify-text">has successfully completed the certified course</div>
            
            <div class="course-info">
                <div class="course-title">"Course Title"</div>
                <div class="course-description">Course Description</div>
            </div>
            
            <div class="completion-date">Completion Date</div>
        </div>
        
        <div class="footer">
            <div class="signature-section">
                <div class="signature-line"></div>
                <div class="signature-name">Vialifecoach Academy</div>
                <div class="signature-title">Professional Life Coaching Foundation</div>
            </div>
            
            <div class="logo-section">
                <img src="https://i.postimg.cc/dDPqTDcm/vialife.png" class="footer-logo" alt="Vialifecoach Logo">
            </div>
            
            <div class="qr-section">
                <div class="qr-code">QR</div>
                <div class="qr-text">Scan to Verify</div>
            </div>
        </div>
    </div>
    
    <div class="certificate-id">ID: {{CERTIFICATE_CODE}}</div>
</div>
</body>
</html>`;
  },

  // Get student certificates
  async getStudentCertificates(studentId: string): Promise<{ certificates: Certificate[] }> {
    const response = await fetch(buildApiUrl(`/certificates/student/${studentId}`));
    if (!response.ok) {
      throw new Error("Failed to load student certificates");
    }
    return response.json();
  },

  // Verify certificate by code
  async verifyCertificate(certificateCode: string): Promise<Certificate> {
    const response = await fetch(buildApiUrl(`/certificates/verify/${certificateCode}`));
    if (!response.ok) {
      throw new Error("Certificate not found or invalid");
    }
    return response.json();
  },

  // Generate certificate (for admin use)
  async generateCertificate(studentId: string, courseId: string, token: string): Promise<Certificate> {
    const response = await fetch(buildApiUrl("/certificates/generate"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: studentId,
        course_id: courseId,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to generate certificate");
    }
    
    return response.json();
  },

  // Download certificate PDF
  async downloadCertificatePdf(certificateId: string, token: string): Promise<Blob> {
    const response = await fetch(buildApiUrl(`/certificates/${certificateId}/pdf`), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to download certificate PDF");
    }
    
    return response.blob();
  },

  // Get certificate statistics (admin)
  async getCertificateStats(token: string): Promise<{
    total_issued: number;
    issued_this_month: number;
    pending_verification: number;
    popular_courses: Array<{
      course_title: string;
      certificates_count: number;
    }>;
  }> {
    const response = await fetch(buildApiUrl("/certificates/stats"), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to load certificate statistics");
    }
    
    return response.json();
  },

  // Get public certificate statistics (best-effort, no auth required)
  async getPublicCertificateStats(): Promise<PublicCertificateStats> {
    const endpoints = [
      "/certificates/stats/public",
      "/certificates/public-stats",
      "/certificates/stats-summary",
      "/certificates/stats",
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(buildApiUrl(endpoint), {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          continue;
        }

        const data = await response.json();

        const totalIssued = Number(data.total_issued ?? data.totalIssued ?? data.total ?? 0);
        const issuedThisMonth = Number(data.issued_this_month ?? data.issuedThisMonth ?? 0);
        const verifiedCount = Number(data.verified_count ?? data.verifiedCount ?? totalIssued);
        const pendingVerification = Number(data.pending_verification ?? data.pendingVerification ?? 0);
        const totalForRate = totalIssued > 0 ? totalIssued : verifiedCount + pendingVerification;
        const verificationRate =
          totalForRate > 0 ? Math.max(0, Math.min(100, Math.round((verifiedCount / totalForRate) * 100))) : 100;

        return {
          totalIssued,
          issuedThisMonth,
          verificationRate,
        };
      } catch {
        // Try next endpoint until one works.
      }
    }

    throw new Error("Public certificate stats unavailable");
  },

  // Revoke certificate (admin)
  async revokeCertificate(certificateId: string, reason: string, token: string): Promise<void> {
    const response = await fetch(buildApiUrl(`/certificates/${certificateId}/revoke`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to revoke certificate");
    }
  },

  // Search certificates (admin)
  async searchCertificates(query: string, filters: {
    status?: string;
    course_id?: string;
    date_from?: string;
    date_to?: string;
  }, token: string): Promise<{
    certificates: Certificate[];
    total: number;
    page: number;
    total_pages: number;
  }> {
    const params = new URLSearchParams({
      query,
      ...filters,
    });
    
    const response = await fetch(buildApiUrl(`/certificates/search?${params}`), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to search certificates");
    }
    
    return response.json();
  },
};

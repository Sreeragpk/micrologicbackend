import { Resend } from "resend";

export const sendContactMail = async (req, res) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, phone, subject, message, company } = req.body;

    // Honeypot spam protection
    if (company) {
      return res.status(400).json({ success: false });
    }

    // EMAIL 1 → To Micrologic team
    await resend.emails.send({
      from: "Micrologic Website <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      reply_to: email,
      subject: `New Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <table style="width: 100%; background-color: #f8f9fa; border-radius: 6px; padding: 20px;">
                              <tr>
                                <td style="padding: 8px 0;">
                                  <strong style="color: #667eea; font-size: 14px;">👤 Name:</strong>
                                  <p style="margin: 5px 0 0 0; color: #333; font-size: 15px;">${name}</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                                  <strong style="color: #667eea; font-size: 14px;">📧 Email:</strong>
                                  <p style="margin: 5px 0 0 0; color: #333; font-size: 15px;">
                                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                                  <strong style="color: #667eea; font-size: 14px;">📱 Phone:</strong>
                                  <p style="margin: 5px 0 0 0; color: #333; font-size: 15px;">${phone || "Not provided"}</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; border-top: 1px solid #e9ecef;">
                                  <strong style="color: #667eea; font-size: 14px;">📋 Subject:</strong>
                                  <p style="margin: 5px 0 0 0; color: #333; font-size: 15px;">${subject}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="padding-top: 10px;">
                            <strong style="color: #667eea; font-size: 14px;">💬 Message:</strong>
                            <div style="margin-top: 10px; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                              <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0; color: #6c757d; font-size: 12px;">
                        This email was sent from the Micrologic website contact form
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // EMAIL 2 → Auto reply to user
    await resend.emails.send({
      from: "Micrologic Integrated Systems <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting Micrologic Integrated Systems",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Logo Space -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Micrologic Integrated Systems</h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">(P) Ltd.</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #333; font-size: 22px; font-weight: 600;">Thank You for Contacting Us!</h2>
                      
                      <p style="margin: 0 0 15px 0; color: #555; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
                      
                      <p style="margin: 0 0 15px 0; color: #555; font-size: 15px; line-height: 1.6;">
                        We have received your message regarding <strong style="color: #667eea;">${subject}</strong>.
                        Our team will review your request and get back to you shortly.
                      </p>
                      
                      <!-- Message Summary -->
                      <div style="margin: 25px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                        <p style="margin: 0 0 10px 0; color: #667eea; font-weight: 600; font-size: 14px;">YOUR MESSAGE:</p>
                        <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                      </div>
                      
                      <p style="margin: 25px 0 5px 0; color: #555; font-size: 15px;">Best Regards,</p>
                      <p style="margin: 0; color: #333; font-weight: 600; font-size: 15px;">Micrologic Integrated Systems Team</p>
                    </td>
                  </tr>
                  
                  <!-- Contact Information -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px 40px;">
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">📍 Visit Our Office</h3>
                            <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">
                              #22-D1, Micrologic Drive, KIADB,<br>
                              Kumbalgodu Industrial Area, NH 275<br>
                              1st Phase, Bengaluru, Karnataka 560074
                            </p>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: 600;">📞 Call Us Directly</h3>
                            <p style="margin: 0 0 5px 0; color: #555; font-size: 14px;">
                              <a href="tel:+919663521132" style="color: #667eea; text-decoration: none; font-weight: 600;">+91 96635 21132</a>
                            </p>
                            <p style="margin: 0; color: #6c757d; font-size: 13px;">Mon - Sat, 9:00 AM - 6:00 PM IST</p>
                          </td>
                        </tr>
                        
                        <tr>
                          <td>
                            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: 600;">📧 Email Us</h3>
                            <p style="margin: 0; color: #555; font-size: 14px;">
                              <a href="mailto:info@micrologicglobal.com" style="color: #667eea; text-decoration: none; font-weight: 600;">info@micrologicglobal.com</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #2d3748; padding: 20px 40px; text-align: center;">
                      <p style="margin: 0 0 5px 0; color: #ffffff; font-size: 14px; font-weight: 600;">Micrologic Integrated Systems (P) Ltd.</p>
                      <p style="margin: 0; color: #a0aec0; font-size: 12px;">© ${new Date().getFullYear()} All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false });
  }
};
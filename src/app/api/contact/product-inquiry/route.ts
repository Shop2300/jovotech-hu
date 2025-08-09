// src/app/api/contact/product-inquiry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { name, email, phone, subject, message, productName, productUrl } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to support
    const result = await resend.emails.send({
      from: 'Jovotech.hu <support@jovotech.hu>',
      to: 'support@jovotech.hu',
      replyTo: email,
      subject: `Termékmegkeresés: ${subject}`,
      html: `
        <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background-color: #f5f5f5; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
            <!-- Header -->
            <div style="background-color: #fafafa; border-bottom: 1px solid #e0e0e0; padding: 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <img src="https://jovotech.hu/images/jovotechlogovevor.png" alt="Jovotech.hu" height="32" style="display: block;">
                  </td>
                  <td align="right">
                    <p style="color: #333333; font-size: 14px; font-weight: 600; margin: 0; line-height: 32px; letter-spacing: 0.5px;">
                      ÚJ MEGKERESÉS
                    </p>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Content -->
            <div style="padding: 24px;">
              <!-- Alert Banner -->
              <div style="background-color: #fff9e6; border: 1px solid #ffd666; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <h2 style="color: #000000; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                  📧 Új termékmegkeresés
                </h2>
                <p style="color: #020b1d; font-size: 14px; line-height: 20px; margin: 0;">
                  Egy vásárló megkeresést küldött a termékoldal kapcsolatfelvételi űrlapján keresztül.
                </p>
              </div>
              
              <!-- Customer Details -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  VÁSÁRLÓ ADATAI
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Név:</strong> ${name}
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>E-mail:</strong> <a href="mailto:${email}" style="color: #073635; text-decoration: none;">${email}</a>
                </p>
                ${phone ? `<p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0;"><strong>Telefon:</strong> ${phone}</p>` : ''}
              </div>
              
              <!-- Product Info -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  TERMÉK
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>${productName}</strong>
                </p>
                ${productUrl ? `<p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0;"><a href="${productUrl}" style="color: #073635; text-decoration: underline;">Termék megtekintése →</a></p>` : ''}
              </div>
              
              <!-- Message -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  ÜZENET
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Tárgy:</strong> ${subject}
                </p>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                  <p style="color: #000000; font-size: 13px; line-height: 20px; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <!-- Reply Instructions -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 16px;">
                <p style="color: #059669; font-size: 13px; line-height: 20px; margin: 0;">
                  <strong>💡 Tipp:</strong> Közvetlenül válaszolhat erre az e-mailre - a válasz a vásárlóhoz érkezik a ${email} címre
                </p>
              </div>
              
              <!-- Footer -->
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0 16px 0;">
              
              <p style="color: #94a3b8; font-size: 11px; line-height: 16px; text-align: center; margin: 0;">
                Ez az üzenet automatikusan került elküldésre a termékoldal kapcsolatfelvételi űrlapjáról.<br>
                Jovotech.hu - Értesítési rendszer
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log('Product inquiry email sent:', result);

    // Also send a confirmation email to the customer
    await resend.emails.send({
      from: 'Jovotech.hu <support@jovotech.hu>',
      to: email,
      subject: `Megkeresés visszaigazolása - ${productName}`,
      html: `
        <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background-color: #f5f5f5; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
            <!-- Header -->
            <div style="background-color: #fafafa; border-bottom: 1px solid #e0e0e0; padding: 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <img src="https://jovotech.hu/images/jovotechlogovevor.png" alt="Jovotech.hu" height="32" style="display: block;">
                  </td>
                  <td align="right">
                    <p style="color: #333333; font-size: 14px; font-weight: 600; margin: 0; line-height: 32px; letter-spacing: 0.5px;">
                      TERMÉKMEGKERESÉS
                    </p>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Content -->
            <div style="padding: 24px;">
              <!-- Title with checkmark -->
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #000000; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; margin: 0;">
                  <span style="color: #4caf50; font-size: 20px; margin-right: 8px;">✓</span>
                  MEGKERESÉSE ELKÜLDVE
                </h1>
              </div>
              
              <p style="color: #333333; font-size: 15px; line-height: 22px; margin-bottom: 24px;">
                Tisztelt ${name}!
              </p>
              
              <p style="color: #333333; font-size: 15px; line-height: 22px; margin-bottom: 24px;">
                Köszönjük érdeklődését a <strong>${productName}</strong> termék iránt. Megkaptuk megkeresését, és a lehető leghamarabb válaszolunk Önnek.
              </p>
              
              <!-- Inquiry Details Box -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  MEGKERESÉSÉNEK RÉSZLETEI
                </p>
                
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Termék:</strong> ${productName}
                </p>
                
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Tárgy:</strong> ${subject}
                </p>
                
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                  <p style="color: #000000; font-size: 13px; line-height: 20px; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <!-- Response Time Notice -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #059669; font-size: 13px; line-height: 20px; margin: 0;">
                  <strong>Válaszidő:</strong> Csapatunk 24 munkanapon belül válaszol megkeresésére.
                </p>
              </div>
              
              <!-- Order Number Notice -->
              <div style="background-color: #fafafa; border-left: 3px solid #6da306; padding: 16px; margin-bottom: 24px;">
                <p style="color: #333333; font-size: 13px; line-height: 20px; margin: 0;">
                  <strong>Fontos:</strong> Ha kérdése egy már leadott rendelésre vonatkozik, kérjük, adja meg a rendelési számot, amikor válaszol erre az e-mailre.
                </p>
              </div>
              
              <!-- Contact -->
              <p style="color: #666666; font-size: 12px; line-height: 18px; text-align: center; margin-bottom: 24px;">
                Kérdése van? Vegye fel velünk a kapcsolatot:<br>
                <a href="mailto:support@jovotech.hu" style="color: #333333; text-decoration: underline;">support@jovotech.hu</a>
              </p>
              
              <!-- Footer -->
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0 16px 0;">
              
              <!-- Company Info -->
              <div style="padding-top: 16px; margin-bottom: 24px;">
                <p style="color: #94a3b8; font-size: 12px; line-height: 18px; text-align: center; margin: 0;">
                  Köszönjük bizalmát!<br>
                  Üdvözlettel,<br>
                  <strong>A Jovotech.hu csapata</strong>
                  <br><br>
                  <strong>Jovotech.hu</strong><br>
                  <a href="https://jovotech.hu" style="color: #073635; text-decoration: none; font-weight: 500;">
                    www.jovotech.hu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Failed to send product inquiry email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
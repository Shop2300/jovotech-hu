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
      from: 'Galaxysklep.pl <support@galaxysklep.pl>',
      to: 'support@galaxysklep.pl',
      replyTo: email,
      subject: `Zapytanie o produkt: ${subject}`,
      html: `
        <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background-color: #f5f5f5; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
            <!-- Header -->
            <div style="background-color: #fafafa; border-bottom: 1px solid #e0e0e0; padding: 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <img src="https://galaxysklep.pl/images/galaxyskleplogo.png" alt="Galaxysklep.pl" height="32" style="display: block;">
                  </td>
                  <td align="right">
                    <p style="color: #333333; font-size: 14px; font-weight: 600; margin: 0; line-height: 32px; letter-spacing: 0.5px;">
                      NOWE ZAPYTANIE
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
                  📧 Nowe zapytanie o produkt
                </h2>
                <p style="color: #020b1d; font-size: 14px; line-height: 20px; margin: 0;">
                  Klient przesłał zapytanie przez formularz kontaktowy na stronie produktu.
                </p>
              </div>
              
              <!-- Customer Details -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  DANE KLIENTA
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Imię i nazwisko:</strong> ${name}
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Email:</strong> <a href="mailto:${email}" style="color: #073635; text-decoration: none;">${email}</a>
                </p>
                ${phone ? `<p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0;"><strong>Telefon:</strong> ${phone}</p>` : ''}
              </div>
              
              <!-- Product Info -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  PRODUKT
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>${productName}</strong>
                </p>
                ${productUrl ? `<p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0;"><a href="${productUrl}" style="color: #073635; text-decoration: underline;">Zobacz produkt →</a></p>` : ''}
              </div>
              
              <!-- Message -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  WIADOMOŚĆ
                </p>
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Temat:</strong> ${subject}
                </p>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                  <p style="color: #000000; font-size: 13px; line-height: 20px; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <!-- Reply Instructions -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 16px;">
                <p style="color: #059669; font-size: 13px; line-height: 20px; margin: 0;">
                  <strong>💡 Wskazówka:</strong> Możesz odpowiedzieć bezpośrednio na ten email - odpowiedź trafi do klienta na adres ${email}
                </p>
              </div>
              
              <!-- Footer -->
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0 16px 0;">
              
              <p style="color: #94a3b8; font-size: 11px; line-height: 16px; text-align: center; margin: 0;">
                This message was automatically generated from the contact form on the product page.<br>
                Galaxysklep.pl - System powiadomień
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log('Product inquiry email sent:', result);

    // Also send a confirmation email to the customer
    await resend.emails.send({
      from: 'Galaxysklep.pl <support@galaxysklep.pl>',
      to: email,
      subject: `Potwierdzenie otrzymania zapytania - ${productName}`,
      html: `
        <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background-color: #f5f5f5; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
            <!-- Header -->
            <div style="background-color: #fafafa; border-bottom: 1px solid #e0e0e0; padding: 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <img src="https://galaxysklep.pl/images/galaxyskleplogo.png" alt="Galaxysklep.pl" height="32" style="display: block;">
                  </td>
                  <td align="right">
                    <p style="color: #333333; font-size: 14px; font-weight: 600; margin: 0; line-height: 32px; letter-spacing: 0.5px;">
                      ZAPYTANIE O PRODUKT
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
                  TWOJE ZAPYTANIE ZOSTAŁO WYSŁANE
                </h1>
              </div>
              
              <p style="color: #333333; font-size: 15px; line-height: 22px; margin-bottom: 24px;">
                Szanowny/a ${name},
              </p>
              
              <p style="color: #333333; font-size: 15px; line-height: 22px; margin-bottom: 24px;">
                Dziękujemy za zainteresowanie produktem <strong>${productName}</strong>. Otrzymaliśmy Twoje zapytanie i odpowiemy najszybciej jak to możliwe.
              </p>
              
              <!-- Inquiry Details Box -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #666666; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 12px 0;">
                  SZCZEGÓŁY TWOJEGO ZAPYTANIA
                </p>
                
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Produkt:</strong> ${productName}
                </p>
                
                <p style="color: #000000; font-size: 13px; line-height: 18px; margin: 0 0 8px 0;">
                  <strong>Temat:</strong> ${subject}
                </p>
                
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                  <p style="color: #000000; font-size: 13px; line-height: 20px; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <!-- Response Time Notice -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #059669; font-size: 13px; line-height: 20px; margin: 0;">
                  <strong>Czas odpowiedzi:</strong> Nasz zespół odpowie na Twoje pytanie w ciągu 24 godzin roboczych.
                </p>
              </div>
              
              <!-- Order Number Notice -->
              <div style="background-color: #fafafa; border-left: 3px solid #6da306; padding: 16px; margin-bottom: 24px;">
                <p style="color: #333333; font-size: 13px; line-height: 20px; margin: 0;">
                  <strong>Ważne:</strong> Jeśli Twoje pytanie dotyczy złożonego zamówienia, prosimy o podanie numeru zamówienia w odpowiedzi na ten email.
                </p>
              </div>
              
              <!-- Contact -->
              <p style="color: #666666; font-size: 12px; line-height: 18px; text-align: center; margin-bottom: 24px;">
                Pytania? Skontaktuj się z nami:<br>
                <a href="mailto:support@galaxysklep.pl" style="color: #333333; text-decoration: underline;">support@galaxysklep.pl</a>
              </p>
              
              <!-- Footer -->
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0 16px 0;">
              
              <!-- Company Info -->
              <div style="padding-top: 16px; margin-bottom: 24px;">
                <p style="color: #94a3b8; font-size: 12px; line-height: 18px; text-align: center; margin: 0;">
                  Dziękujemy za zaufanie!<br>
                  Z pozdrowieniami,<br>
                  <strong>Zespół Galaxysklep.pl</strong>
                  <br><br>
                  <strong>Galaxysklep.pl</strong><br>
                  <a href="https://galaxysklep.pl" style="color: #073635; text-decoration: none; font-weight: 500;">
                    www.galaxysklep.pl
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
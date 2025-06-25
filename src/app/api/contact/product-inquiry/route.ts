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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #6da306; padding: 20px;">
            <h1 style="color: white; margin: 0;">Nowe zapytanie o produkt</h1>
          </div>
          <div style="padding: 30px; background-color: #f5f5f5;">
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #1e293b; margin-top: 0;">Szczegóły zapytania</h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Od:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p style="margin: 5px 0;"><strong>Telefon:</strong> ${phone}</p>` : ''}
              </div>

              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Produkt:</strong> ${productName}</p>
                ${productUrl ? `<p style="margin: 5px 0;"><strong>Link do produktu:</strong> <a href="${productUrl}">${productUrl}</a></p>` : ''}
                <p style="margin: 5px 0;"><strong>Temat:</strong> ${subject}</p>
              </div>

              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #1e293b;">Wiadomość:</h3>
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #2e7d32;">
                <strong>Wskazówka:</strong> Możesz odpowiedzieć bezpośrednio na ten email, aby skontaktować się z klientem.
              </p>
            </div>
          </div>
          <div style="background-color: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Ta wiadomość została wysłana z formularza kontaktowego na stronie Galaxysklep.pl</p>
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #6da306; padding: 20px;">
            <h1 style="color: white; margin: 0;">Dziękujemy za Twoje zapytanie!</h1>
          </div>
          <div style="padding: 30px;">
            <p>Szanowny/a ${name},</p>
            
            <p>Otrzymaliśmy Twoje zapytanie dotyczące produktu <strong>${productName}</strong>.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Twoje zapytanie:</h3>
              <p><strong>Temat:</strong> ${subject}</p>
              <p><strong>Wiadomość:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <p>Nasz zespół odpowie na Twoje pytanie jak najszybciej, zazwyczaj w ciągu 24 godzin roboczych.</p>
            
            <p>Jeśli masz dodatkowe pytania, możesz odpowiedzieć bezpośrednio na ten email.</p>
            
            <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #64748b; font-size: 14px;">
              Z poważaniem,<br>
              Zespół Galaxysklep.pl<br>
              <a href="https://galaxysklep.pl" style="color: #6da306;">www.galaxysklep.pl</a>
            </p>
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
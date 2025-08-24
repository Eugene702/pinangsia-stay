import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendActivationEmail = async (email: string, name: string, activationToken: string) => {
  const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/activate?token=${activationToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aktivasi Akun Pinangsia Stay</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border: 1px solid #f3f4f6;
            }
            
            .header {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            
            .logo {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
                letter-spacing: 1px;
            }
            
            .subtitle {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 20px;
                color: #dc2626;
                margin-bottom: 20px;
                font-weight: 600;
            }
            
            .message {
                font-size: 16px;
                color: #555;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .activation-button {
                display: inline-block;
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                padding: 15px 35px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
            }
            
            .activation-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(220, 38, 38, 0.6);
            }
            
            .button-container {
                text-align: center;
                margin: 30px 0;
            }
            
            .alternative-link {
                background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
            }
            
            .alternative-link p {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
            }
            
            .link-url {
                word-break: break-all;
                color: #dc2626;
                font-family: monospace;
                font-size: 12px;
                background-color: #fff;
                padding: 10px;
                border-radius: 4px;
                border: 1px solid #ddd;
            }
            
            .warning {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #92400e;
            }
            
            .warning-icon {
                display: inline-block;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .footer {
                background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            
            .footer p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .social-links {
                margin-top: 20px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #dc2626;
                text-decoration: none;
                font-size: 14px;
            }
            
            .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #dc2626, transparent);
                margin: 30px 0;
                opacity: 0.3;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                }
                
                .header, .content, .footer {
                    padding: 20px;
                }
                
                .logo {
                    font-size: 24px;
                }
                
                .greeting {
                    font-size: 18px;
                }
                
                .activation-button {
                    padding: 12px 25px;
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">🏨 Pinangsia Stay</div>
                <div class="subtitle">Hotel Premium di Jantung Jakarta</div>
            </div>
            
            <!-- Content -->
            <div class="content">
                <div class="greeting">Halo, ${name}! 👋</div>
                
                <div class="message">
                    Terima kasih telah mendaftar di <strong style="color: #dc2626;">Pinangsia Stay</strong>. Kami sangat senang Anda bergabung dengan keluarga besar kami!
                </div>
                
                <div class="message">
                    Untuk melengkapi proses pendaftaran dan mengaktifkan akun Anda, silakan klik tombol aktivasi di bawah ini:
                </div>
                
                <div class="button-container">
                    <a href="${activationUrl}" class="activation-button">
                        ✨ Aktivasi Akun Saya
                    </a>
                </div>
                
                <div class="warning">
                    <span class="warning-icon">⚠️</span>
                    <strong>Penting:</strong> Link aktivasi ini hanya berlaku selama 24 jam. Pastikan Anda mengaktifkan akun dalam waktu tersebut.
                </div>
                
                <div class="alternative-link">
                    <p><strong>Jika tombol di atas tidak berfungsi, salin dan tempel link berikut ke browser Anda:</strong></p>
                    <div class="link-url">${activationUrl}</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="message">
                    Setelah akun Anda aktif, Anda dapat menikmati berbagai fasilitas eksklusif kami:
                </div>
                
                <ul style="margin: 20px 0; padding-left: 20px; color: #555;">
                    <li style="margin-bottom: 8px;">🛏️ Reservasi kamar online yang mudah dan cepat</li>
                    <li style="margin-bottom: 8px;">💳 Sistem pembayaran yang aman dan terpercaya</li>
                    <li style="margin-bottom: 8px;">📱 Akses ke aplikasi mobile eksklusif</li>
                    <li style="margin-bottom: 8px;">🎁 Penawaran khusus dan diskon member</li>
                    <li style="margin-bottom: 8px;">🏆 Program loyalitas dengan benefit menarik</li>
                </ul>
                
                <div class="message">
                    Jika Anda tidak merasa mendaftar akun ini, silakan abaikan email ini atau hubungi tim customer service kami.
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p><strong>Pinangsia Stay</strong></p>
                <p>Jl. Pinangsia Raya No. 123, Jakarta Barat 11110</p>
                <p>📞 (021) 1234-5678 | 📧 info@pinangsia-stay.com</p>
                
                <div class="social-links">
                    <a href="#">Facebook</a> |
                    <a href="#">Instagram</a> |
                    <a href="#">Twitter</a> |
                    <a href="#">WhatsApp</a>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 12px; color: #999;">
                    Email ini dikirim otomatis dari sistem kami. Mohon jangan membalas email ini.
                    <br>
                    © ${new Date().getFullYear()} Pinangsia Stay. Hak cipta dilindungi undang-undang.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Pinangsia Stay" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '🏨 Aktivasi Akun Pinangsia Stay - Selamat Datang!',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email server is ready to take our messages');
    return true;
  } catch (error) {
    console.error('Email server error:', error);
    return false;
  }
};

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  async sendMail({ to, subject, text, html, bcc }) {
    try {
      const mailOptions = {
        from: '"Your Jewelry Store" <gaurshiva457@gmail.com>',
        to,
        bcc,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Mailer Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendNewItemNotification(emails, itemDetails) {
    const { itemName, metalType, weight, itemPurity, image } = itemDetails;
    
    const html = `
      <h1>Exciting New Arrival!</h1>
      <p>We're thrilled to announce our latest addition:</p>
      
      <div style="border: 1px solid #e0e0e0; padding: 20px; margin: 20px 0;">
        <h2>${itemName}</h2>
        ${metalType ? `<p><strong>Metal Type:</strong> ${metalType}</p>` : ''}
        <p><strong>Weight:</strong> ${weight}g</p>
        <p><strong>Purity:</strong> ${itemPurity}</p>
        ${image ? `<img src="${image}" alt="${itemName}" style="max-width: 300px; margin-top: 15px;">` : ''}
      </div>
      
      <p>Visit our store to see this beautiful piece in person!</p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #777;">
        You're receiving this email because you subscribed to our newsletter.
      </p>
    `;

    return this.sendMail({
      bcc: emails,
      subject: `New Arrival: ${itemName}`,
      html
    });
  }
}

module.exports = new Mailer();
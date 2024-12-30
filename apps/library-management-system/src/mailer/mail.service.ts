import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';


@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
      },
      logger: true,
      debug: true,
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to, 
      subject, 
      text, 
      html, 
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw error;
    }
  }
}

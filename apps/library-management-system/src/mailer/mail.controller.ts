import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('html') html?: string,
  ) {
    try {
      const result = await this.mailService.sendMail(to, subject, text, html);
      return { message: 'Email sent successfully', result };
    } catch (error) {
      return { message: 'Failed to send email', error };
    }
  }
}

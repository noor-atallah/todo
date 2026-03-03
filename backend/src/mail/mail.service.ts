import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Todo } from '../todo/todo.entity';

@Injectable()
export class MailService {

  private getTransporter() {
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port:  2525,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendTaskCompleted(email: string, name: string, todo: Todo) {
    await this.getTransporter().sendMail({
      from: `"MyTasks App" <nooratallah1234@gmail.com>`,
      to: email,
      subject: `✅ Task Completed: ${todo.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
          <h2 style="color: #0e0e12;">Hey ${name}! 🎉</h2>
          <p style="color: #555;">You just completed a task:</p>
          <div style="background: #fff; border-left: 4px solid #c8f135; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <strong style="font-size: 1.1rem;">${todo.title}</strong>
            ${todo.description ? `<p style="color: #888; margin-top: 8px;">${todo.description}</p>` : ''}
          </div>
          <p style="color: #aaa; font-size: 0.85rem;">Keep up the great work! 💪</p>
        </div>
      `,
    });
  }

  async sendDailySummary(email: string, name: string, todos: Todo[]) {
    const completed = todos.filter(t => t.completed);
    const pending = todos.filter(t => !t.completed);

    const todoRow = (t: Todo) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${t.title}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: ${t.completed ? 'green' : '#ff9900'};">
          ${t.completed ? '✅ Done' : '⏳ Pending'}
        </td>
      </tr>
    `;

    await this.getTransporter().sendMail({
      from: `"MyTasks App" <nooratallah1234@gmail.com>`,
      to: email,
      subject: `📋 Your Daily Task Summary`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
          <h2 style="color: #0e0e12;">Daily Summary 📋</h2>
          <p style="color: #555;">Hey ${name}, here's your task update:</p>
          <div style="display: flex; gap: 16px; margin: 20px 0;">
            <div style="flex:1; background:#fff; border-radius:8px; padding:16px; text-align:center; border-top: 3px solid #c8f135;">
              <div style="font-size:2rem; font-weight:bold;">${completed.length}</div>
              <div style="color:#888; font-size:0.85rem;">Completed</div>
            </div>
            <div style="flex:1; background:#fff; border-radius:8px; padding:16px; text-align:center; border-top: 3px solid #ff9900;">
              <div style="font-size:2rem; font-weight:bold;">${pending.length}</div>
              <div style="color:#888; font-size:0.85rem;">Pending</div>
            </div>
          </div>
          <table style="width:100%; background:#fff; border-radius:8px; border-collapse:collapse;">
            <thead>
              <tr style="background:#0e0e12; color:#fff;">
                <th style="padding:10px 12px; text-align:left;">Task</th>
                <th style="padding:10px 12px; text-align:left;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${todos.map(todoRow).join('')}
            </tbody>
          </table>
          <p style="color:#aaa; font-size:0.8rem; margin-top:24px;">Sent every minute for testing · MyTasks App</p>
        </div>
      `,
    });
  }
}
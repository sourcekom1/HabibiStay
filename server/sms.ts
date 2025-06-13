// SMS service using Twilio
export interface SmsService {
  sendSms(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

class TwilioSmsService implements SmsService {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.warn('Twilio credentials not configured. SMS functionality will be disabled.');
    }
  }

  async sendSms(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      return {
        success: false,
        error: 'Twilio credentials not configured'
      };
    }

    try {
      // Using fetch to call Twilio API directly to avoid additional dependencies
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: this.fromNumber,
          Body: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          messageId: data.sid
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          error: `Twilio API error: ${error}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `SMS sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const smsService = new TwilioSmsService();

// SMS templates for different notification types
export const smsTemplates = {
  bookingConfirmation: (guestName: string, propertyName: string, checkIn: string) =>
    `Hi ${guestName}! Your booking at ${propertyName} is confirmed for ${checkIn}. Welcome to HabibiStay! 🏠`,

  bookingReminder: (guestName: string, propertyName: string, checkIn: string) =>
    `Hi ${guestName}! Reminder: Your stay at ${propertyName} starts tomorrow (${checkIn}). Looking forward to hosting you!`,

  checkInInstructions: (guestName: string, propertyName: string, address: string) =>
    `Hi ${guestName}! Welcome to ${propertyName}. Address: ${address}. Check-in instructions have been sent to your email. Enjoy your stay!`,

  hostNewBooking: (hostName: string, guestName: string, propertyName: string, dates: string) =>
    `Hi ${hostName}! New booking: ${guestName} booked ${propertyName} for ${dates}. Check your dashboard for details.`,

  paymentConfirmation: (amount: string, currency: string) =>
    `Payment confirmed! ${amount} ${currency} received. Thank you for choosing HabibiStay.`,

  paymentFailed: (guestName: string) =>
    `Hi ${guestName}, there was an issue processing your payment. Please update your payment method to complete your booking.`,

  bookingStatusUpdate: (propertyName: string, status: string, checkIn: string) =>
    `Your booking at ${propertyName} for ${checkIn} has been ${status}. Check your account for details.`
};
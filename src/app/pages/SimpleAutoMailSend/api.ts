// src/app/pages/SimpleAutoMailSend/api.ts
export interface EmailData {
  [key: string]: any; // Replace with the actual shape of your data
}

export const sendEmails = async (data: EmailData): Promise<any> => {
  const API_URL = "https://simple-auto-mail-send-backend.onrender.com/send-emails";
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || 'Failed to send emails');
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const pingServer = async (): Promise<any> => {
  const API_URL = "https://simple-auto-mail-send-backend.onrender.com/";
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || 'Failed to ping server');
    }

    return result;
  } catch (err) {
    throw err;
  }
};
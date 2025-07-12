export const p1Prompt = "Please guide me, a non-technical user, step-by-step through the process of obtaining a Gmail app password. Explain each step clearly and simply, as if I'm new to using Google accounts. Include instructions on where to find the settings, what to click, and how to avoid common mistakes. If two-factor authentication is required, explain how to set it up in an easy-to-follow way. Provide troubleshooting tips for common issues, like if I can't find the app password option.";
export const p2Prompt = `Merge the data into the Json, Json template must not be changed.
JSON:
{
  "gmail": "YOUR EMAIL",
  "app_password": "YOUR GMAIL APP PASSWORD",
  "subject": "Your 2025 Semester Exam Results",
  "template": "Dear {student_name},\\n\\nYour exam results are as follows:\\n{marks_table}\\n\\nBest regards,\\n{sender_name}",
  "template_vars": {
    "sender_name": "YOUR SENDER NAME"
  },
  "scores": [
    {
      "student_name": "John Doe",
      "email": "a@gmail.com",
      "marks": {
        "Math": 85,
        "Science": 90,
        "English": 78
      }
    }
  ]
}
DATA:`;
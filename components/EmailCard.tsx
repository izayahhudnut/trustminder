// components/EmailCard.tsx
import React from "react";

interface EmailCardProps {
  subject: string;
  body: string;
  showSubject?: boolean;
}

const EmailCard: React.FC<EmailCardProps> = ({ subject, body, showSubject = true }) => {
  return (
    <div className="border border-gray-300 p-5 rounded-lg bg-white mb-5">
      {showSubject && subject && (
        <div className="font-bold mb-2 text-gray-800">Subject: {subject}</div>
      )}
      <div
        className="leading-relaxed text-gray-800"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
};

export default EmailCard;

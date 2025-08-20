// SendRecipeButton.tsx
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { customToast } from "@/app/utils/showToast";
import { RiMailSendLine } from "react-icons/ri";

interface SendRecipeButtonProps {
  recipeTitle: string | undefined;
  recipeDescription: string | undefined;
  recipeLink: string | undefined;
}

const SendRecipeButton: React.FC<SendRecipeButtonProps> = ({
  recipeTitle,
  recipeDescription,
  recipeLink,
}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [showAddEmail, setShowAddEmail] = useState<boolean>(false);

  const handleSend = async () => {
    setShowAddEmail(false);

    if (!recipientEmail) {
      setShowAddEmail(true);
      return;
    }

    setStatus("sending");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: recipientEmail,
          recipe_title: recipeTitle,
          recipe_description: recipeDescription,
          recipe_link: recipeLink,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setStatus("success");
      customToast("Recipe sent successfully!", "success");
      setRecipientEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      customToast("Failed to send recipe. Try again.", "error");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {showAddEmail ? (
        <div className="main flex items-center justify-center mb-5 gap-2">
          <input
            type="email"
            placeholder="Enter recipient email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            style={{ padding: "8px", width: "250px", marginRight: "10px" }}
          />
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => setShowAddEmail(false)}
          >
            X
          </button>
          <button
            className="p-2 bg-[#6366F1] text-white scale-105 transition-colors hover:bg-[#6366F1]/90 rounded cursor-pointer"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddEmail(true)}
          disabled={status === "sending"}
          style={{
            padding: "8px 16px",
            cursor: status === "sending" ? "not-allowed" : "pointer",
          }}
          className="bg-[#6366F1] text-white scale-105 transition-colors mb-5 hover:bg-[#6366F1]/90 rounded"
          title="Click to add recipient email"
        >
          {status === "sending" ? "Sending..." : <RiMailSendLine />}
        </button>
      )}
    </div>
  );
};

export default SendRecipeButton;

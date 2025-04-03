import { toast } from "nextjs-toast-notify";

export function showToast(
  message: string,
  type: "success" | "error" | "warning" | "info" = "info",
  duration = 4000
) {
  toast[type](message, {
    duration,
    progress: true,
    position: "bottom-right",
    transition: "bounceIn",
    icon: "",
    sound: true,
  });
}

import { showToast } from "nextjs-toast-notify";

export function customToast(
  message: string,
  type: "success" | "error" | "warning" | "info" = "info",
  duration = 4000
) {
  showToast[type](message, {
    duration,
    progress: true,
    position: "bottom-right",
    transition: "bounceIn",
    icon: "",
    sound: true,
  });
}

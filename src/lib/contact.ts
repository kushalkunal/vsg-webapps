// Centralized contact constants for Visionary Salva Group

export const BRAND = {
  name: "Visionary Salva Group",
  tagline: "A Unit Of Vishwashi Advisory Service",
};

// WhatsApp number — configurable via VITE_WHATSAPP_NUMBER env variable
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919521412485";

export const PHONE_NUMBERS = ["+91 95214 12485", "+91 92347 83713"];
export const PHONE_TEL = ["+919521412485", "+919234783713"];

export const EMAIL = "visionarysalvagroup@gmail.com";
export const WEBSITE = "visionarysalvagroup.com";

export const ADDRESSES = [
  {
    label: "Main Branch",
    line: "New Tarachak, Near Omega Mission School, Patna - 801503",
  },
  {
    label: "New Branch",
    line: "Opposite Bus Stand, Above Raja Hotel, Arwal - 804401",
  },
];

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

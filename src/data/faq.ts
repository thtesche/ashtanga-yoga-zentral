export interface FaqItem {
  question: string;
  answer: string[];
}

export const faqs: Record<"en" | "de", FaqItem[]> = {
  en: [
    {
      question: "What is Mysore Style?",
      answer: [
        "Mysore Style is the traditional way Ashtanga Yoga is taught and practiced.",
        "In this approach, students move through the sequence at their own pace, receiving individual guidance through verbal cues and hands-on support from the teacher.",
        "Postures are introduced gradually, based on each practitioner's ability and readiness—taking into account not only physical capacity but also mental and emotional preparedness.",
        "New students, whether to Ashtanga or Mysore-style practice, are welcome and encouraged to join.",
      ],
    },
    {
      question: "I am completely new to yoga — can I join?",
      answer: [
        "Absolutely. Beginners are always welcome. You will start with the foundational postures and build from there at your own pace.",
        "Please allow around 30 minutes for your first class so we can go through the basics together.",
      ],
    },
    {
      question: "Where do you teach?",
      answer: [
        "We practice at Three Boons Studio, Brunnen Str. 29/3 (backyard), 10119 Berlin.",
      ],
    },
    {
      question: "Do I need to bring my own mat?",
      answer: [
        "If you have your own mat, feel free to bring it. Mats are also available at the studio.",
      ],
    },
    {
      question: "What should I wear?",
      answer: [
        "Wear comfortable, breathable clothing that allows you to move freely. Avoid loose or baggy tops that may fall over your face during inversions.",
      ],
    },
    {
      question: "How can I get in touch?",
      answer: [
        "Use the contact form on our website to send us a message. You can also sign up for the newsletter to stay updated on classes and retreats.",
      ],
    },
  ],
  de: [
    {
      question: "Was ist Mysore Style?",
      answer: [
        "Mysore Style ist die traditionelle Form, Ashtanga Yoga zu unterrichten und zu praktizieren.",
        "Bei diesem Ansatz übst du die Reihe in deinem ganz eigenen Tempo. Du erhältst dabei individuelle Unterstützung durch mündliche Hinweise und direkte Hilfestellungen (Hands-on).",
        "Neue Haltungen werden schrittweise eingeführt – genau angepasst an deine Fähigkeiten und deine Bereitschaft. Dabei wird nicht nur deine körperliche Kraft berücksichtigt, sondern auch deine mentale und emotionale Verfassung.",
        "Egal, ob du ganz neu beim Ashtanga Yoga bist oder bisher noch keine Mysore-Praxis kennst: Du bist herzlich willkommen und ausdrücklich eingeladen mitzumachen!",
      ],
    },
    {
      question: "Ich bin komplett neu im Yoga — kann ich mitmachen?",
      answer: [
        "Natürlich. Anfänger sind immer willkommen. Du beginnst mit den grundlegenden Haltungen und baust von dort aus in deinem eigenen Tempo weiter auf.",
        "Plane bitte etwa 30 Minuten für deine erste Klasse ein, damit wir gemeinsam die Grundlagen durchgehen können.",
      ],
    },
    {
      question: "Wo unterrichtest du?",
      answer: [
        "Wir üben im Three Boons Studio, Brunnenstr. 29/3 (Hinterhof), 10119 Berlin.",
      ],
    },
    {
      question: "Muss ich meine eigene Matte mitbringen?",
      answer: [
        "Wenn du eine eigene Matte hast, kannst du sie gerne mitbringen. Matten sind auch im Studio verfügbar.",
      ],
    },
    {
      question: "Was soll ich anziehen?",
      answer: [
        "Trage bequeme, atmungsaktive Kleidung, in der du dich frei bewegen kannst. Vermeide lockere oder weite Oberteile, die bei Umkehrhaltungen ins Gesicht fallen könnten.",
      ],
    },
    {
      question: "Wie kann ich Kontakt aufnehmen?",
      answer: [
        "Nutze das Kontaktformular auf unserer Website, um uns eine Nachricht zu senden. Du kannst dich auch für den Newsletter anmelden, um über Klassen und Retreats auf dem Laufenden zu bleiben.",
      ],
    },
  ],
};

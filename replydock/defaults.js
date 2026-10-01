const FREE_LIMIT = 10;

const DEFAULT_TEMPLATES = [
  {
    id: "intro-1",
    title: "First reply",
    category: "Support",
    body: "Hi {{name}}, thanks for writing in. I am looking at this now and will follow up with a clear next step shortly.\n\n— {{me}}"
  },
  {
    id: "intro-2",
    title: "Need more detail",
    category: "Support",
    body: "Hi {{name}}, I can help with this. Can you send the account email, a screenshot, and the time it happened?\n\n— {{me}}"
  },
  {
    id: "bug-1",
    title: "Bug acknowledged",
    category: "Support",
    body: "Hi {{name}}, this looks like a bug on our side. I have logged it and will update you when a fix is out. Sorry for the friction.\n\n— {{me}}"
  },
  {
    id: "refund-1",
    title: "Refund issued",
    category: "Billing",
    body: "Hi {{name}}, I have issued the refund for {{amount}}. It usually returns to the original payment method in 5–10 business days.\n\n— {{me}}"
  },
  {
    id: "sales-1",
    title: "Demo follow-up",
    category: "Sales",
    body: "Hi {{name}}, good speaking with you about {{company}}. The short version: we can start with {{plan}} and review results in 14 days. Want me to send the checkout link?\n\n— {{me}}"
  },
  {
    id: "sales-2",
    title: "Polite no",
    category: "Sales",
    body: "Hi {{name}}, thanks for the note. This is not a fit for us right now, so I will pass. Happy to revisit if the scope changes.\n\n— {{me}}"
  },
  {
    id: "founder-1",
    title: "Investor update line",
    category: "Founder",
    body: "Quick update for {{date}}: revenue {{amount}}, main bottleneck is {{topic}}, and the next milestone is {{plan}}."
  },
  {
    id: "meet-1",
    title: "Meeting confirm",
    category: "Ops",
    body: "Confirmed for {{date}}. I will send a short agenda beforehand. Reply if the time needs to move.\n\n— {{me}}"
  }
];

const DEFAULT_VARS = { name: "", company: "", me: "", amount: "", plan: "", topic: "", date: "" };

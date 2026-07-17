const GITHUB_LINK = import.meta.env.PUBLIC_GITHUB_LINK;
const DISCORD_LINK = import.meta.env.PUBLIC_DISCORD_LINK;
const X_LINK = import.meta.env.PUBLIC_X_LINK;
const NOTE_LINK = import.meta.env.PUBLIC_NOTE_LINK;

type LinkObj = {
  title: string;
  name: string;
  url: string;
};

export const SNS_LINKS: LinkObj[] = [
  { title: "GitHub", name: "273Do", url: GITHUB_LINK },
  { title: "Discord", name: "273", url: DISCORD_LINK },
  { title: "X(Twitter)", name: "273Do", url: X_LINK },
  { title: "Note", name: "273*", url: NOTE_LINK },
] as const;

export const MAIL_ADDRESS = import.meta.env.MAIL_ADDRESS;

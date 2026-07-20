import { ImapFlow } from "imapflow";
import { simpleParser, ParsedMail } from "mailparser";

export interface MailMessage {
  uid: number;
  seq: number;
  subject: string;
  from: string;
  to: string;
  date: string;
  text: string;
  html: string;
  snippet: string;
}

/**
 * Helper function to safely extract readable text from mailparser address fields
 */
function getAddressText(addr: unknown): string {
  if (!addr) return "";
  if (Array.isArray(addr)) {
    return addr
      .map((item) => {
        if (item && typeof item === "object" && "text" in item) {
          return String((item as { text: unknown }).text);
        }
        return String(item);
      })
      .join(", ");
  }
  if (typeof addr === "object" && "text" in addr) {
    return String((addr as { text: unknown }).text);
  }
  return String(addr);
}

/**
 * Fetches the last 10 emails from the inbox of a given user account using OAuth2 access token.
 * 
 * @param provider The OAuth provider ('google' or 'microsoft')
 * @param email The user's email address
 * @param accessToken A valid OAuth2 access token
 * @returns A promise resolving to an array of MailMessage objects (newest first)
 */
export async function fetchInboxMails(
  provider: "google" | "microsoft" | string,
  email: string,
  accessToken: string
): Promise<MailMessage[]> {
  const host =
    provider === "google"
      ? "imap.gmail.com"
      : provider === "microsoft"
      ? "outlook.office365.com"
      : null;

  if (!host) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  const client = new ImapFlow({
    host,
    port: 993,
    secure: true,
    auth: {
      user: email,
      accessToken: accessToken,
    },
    logger: false,
  });

  await client.connect();

  const emails: MailMessage[] = [];
  const lock = await client.getMailboxLock("INBOX");

  try {
    const mailbox = client.mailbox as { exists?: number } | null;
    const totalExists = mailbox?.exists || 0;

    if (totalExists > 0) {
      // Fetch last 10 messages (e.g. 10 oldest/newest).
      // Messages are numbered 1 to totalExists.
      // E.g. if totalExists is 100, we want 91 to 100.
      const start = Math.max(1, totalExists - 9);
      const end = totalExists;
      const range = `${start}:${end}`;

      // Fetch envelope (for structure) and source (for body/content parsing)
      for await (const message of client.fetch(range, { envelope: true, source: true })) {
        try {
          if (!message.source) {
            continue;
          }
          const parsed = (await simpleParser(message.source)) as ParsedMail;
          
          const subject = message.envelope?.subject || parsed.subject || "(No Subject)";
          const from = message.envelope?.from
            ?.map((f) => f.name || f.address)
            .filter(Boolean)
            .join(", ") || getAddressText(parsed.from) || "Unknown Sender";
          const to = message.envelope?.to
            ?.map((t) => t.name || t.address)
            .filter(Boolean)
            .join(", ") || getAddressText(parsed.to) || "";
          
          const dateStr = (message.envelope?.date || parsed.date || new Date()).toISOString();
          
          const text = typeof parsed.text === "string" ? parsed.text : "";
          const html = typeof parsed.html === "string" ? parsed.html : parsed.textAsHtml || "";
          
          // Generate a clean snippet from plaintext body (first 150 chars)
          const snippet = text
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 150);

          emails.push({
            uid: message.uid,
            seq: message.seq,
            subject,
            from,
            to,
            date: dateStr,
            text,
            html,
            snippet,
          });
        } catch (parseError) {
          console.error(`Error parsing message seq ${message.seq}:`, parseError);
          // Return at least envelope information if parsing fails
          emails.push({
            uid: message.uid,
            seq: message.seq,
            subject: message.envelope?.subject || "(No Subject)",
            from: message.envelope?.from?.map((f) => f.name || f.address).filter(Boolean).join(", ") || "Unknown Sender",
            to: message.envelope?.to?.map((t) => t.name || t.address).filter(Boolean).join(", ") || "",
            date: (message.envelope?.date || new Date()).toISOString(),
            text: "Failed to parse body content.",
            html: "<p>Failed to parse body content.</p>",
            snippet: "Failed to parse body content.",
          });
        }
      }
    }
  } finally {
    lock.release();
  }

  try {
    await client.logout();
  } catch (logoutError) {
    console.error("Error during IMAP logout:", logoutError);
  }

  // Reverse so the newest emails appear first
  return emails.reverse();
}

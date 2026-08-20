import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string().min(1),
  keyPoints: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const NotesInput = z.object({
  notes: z.string().min(1),
});

const PlannerInput = z.object({
  tasks: z.string().min(1),
  priorities: z.string(),
  availableTime: z.string().min(1),
  horizon: z.enum(["Daily", "Weekly"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { getGatewayModel, toFriendlyAiError } = await import("./ai-gateway.server");
    try {
      const result = streamText({
        model: getGatewayModel(),
        system:
          "You are a professional workplace writing assistant. Write complete, ready-to-send emails. Output plain text only: subject line on the first line prefixed with 'Subject: ', then a blank line, then the email body with a greeting and sign-off. No markdown, no commentary.",
        prompt: `Tone: ${data.tone}\nRecipient: ${data.recipient}\nPurpose: ${data.purpose}\nKey points:\n${data.keyPoints}`,
      });
      return { email: await result.text };
    } catch (error) {
      throw toFriendlyAiError(error);
    }
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const { streamText, Output, NoObjectGeneratedError } = await import("ai");
    const { getGatewayModel, toFriendlyAiError } = await import("./ai-gateway.server");

    const schema = z.object({
      summary: z.string(),
      actionItems: z.array(z.string()),
      decisions: z.array(z.string()),
      deadlines: z.array(z.string()),
    });

    try {
      const result = streamText({
        model: getGatewayModel({ structuredOutputs: true }),
        system:
          "You summarize meeting notes for busy professionals. Be concise and factual. Only include items that are actually supported by the notes; use empty arrays when nothing applies. Keep the summary under 120 words. Each list item should be one short line; include the owner and date when the notes mention them.",
        prompt: `Meeting notes:\n\n${data.notes}`,
        output: Output.object({ schema }),
      });
      return await result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("The summary couldn't be structured. Please try again.");
      }
      throw toFriendlyAiError(error);
    }
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const { streamText, Output, NoObjectGeneratedError } = await import("ai");
    const { getGatewayModel, toFriendlyAiError } = await import("./ai-gateway.server");

    const schema = z.object({
      overview: z.string(),
      blocks: z.array(
        z.object({
          period: z.string(),
          time: z.string(),
          task: z.string(),
          priority: z.enum(["High", "Medium", "Low"]),
          note: z.string(),
        }),
      ),
      tips: z.array(z.string()),
    });

    try {
      const result = streamText({
        model: getGatewayModel({ structuredOutputs: true }),
        system:
          "You are a realistic productivity planner. Build an achievable schedule that fits strictly within the available time, includes short breaks, and orders work by priority and energy. 'period' is the day label (e.g. 'Today' or 'Monday'), 'time' is a clock range (e.g. '09:00 - 10:30'). Do not overload the schedule.",
        prompt: `Plan horizon: ${data.horizon}\nAvailable time: ${data.availableTime}\nPriorities: ${data.priorities || "not specified"}\nTasks:\n${data.tasks}`,
        output: Output.object({ schema }),
      });
      return await result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("The schedule couldn't be structured. Please try again.");
      }
      throw toFriendlyAiError(error);
    }
  });

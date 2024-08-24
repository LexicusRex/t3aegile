import { z } from "zod";

// explicit schemas and types
export const courseEnrollableSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional().default(null),
  email: z.string().email(),
  image: z.string().nullable().optional().default(null),
});
export const courseParticipantSchema = courseEnrollableSchema.extend({
  role: z.string(),
});

export type CourseEnrollable = z.infer<typeof courseEnrollableSchema>;
export type CourseParticipant = z.infer<typeof courseParticipantSchema>;

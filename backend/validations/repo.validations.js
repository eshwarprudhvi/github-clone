import { z } from "zod";

const repoValidation = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
  content: z.array(z.string()).optional(),
  visibility: z.boolean().optional(),
  owner: z.string().min(1, "OwnerId is required"),
  issues: z.array(z.string()).optional(),
});

export default repoValidation;

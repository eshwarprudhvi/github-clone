import {z} from "zod";

const repoValidation = z.object({
    name:z.string().required("name is required"),
    description:z.string().optional(),
    content:z.array(z.string()).optional(),
    visibility:z.boolean().optional(),
    owner:z.string().required("owner id is required"),
    issues:z.array(z.string()).optional(),
    
})

export default repoValidation;
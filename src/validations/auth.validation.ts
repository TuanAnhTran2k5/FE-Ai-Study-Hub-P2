import { ERROR_CODE } from "@/constants/errorCode";
import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty(ERROR_CODE.FIELD_REQUIRED)
    .email(ERROR_CODE.INVALID_EMAIL),

  password: z.string().nonempty(ERROR_CODE.FIELD_REQUIRED),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty(ERROR_CODE.FIELD_REQUIRED)
      .email(ERROR_CODE.INVALID_EMAIL),

    fullName: z
      .string()
      .nonempty(ERROR_CODE.FIELD_REQUIRED)
      .max(50, "Full name must be less than 50 characters"),

    password: z
      .string()
      .nonempty(ERROR_CODE.FIELD_REQUIRED)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=]).{8,}$/,
        ERROR_CODE.INVALID_PASSWORD,
      ),

    confirmPassword: z.string().nonempty(ERROR_CODE.FIELD_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_CODE.PASSWORD_NOT_MATCH,
    path: ["confirmPassword"],
  });

//do code bằng typescript nên phải có kiểu dữ liệu
export type RegisterFormValues = z.infer<typeof registerSchema>;

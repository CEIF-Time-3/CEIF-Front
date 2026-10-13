import { ZodError } from "zod";
import { HttpError } from "./http";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return "Estrutura de dados inválida retornada pelo servidor.";
  }
  if (error instanceof HttpError || error instanceof Error) {
    return error.message;
  }
  return String(error);
}

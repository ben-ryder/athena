import { Request } from "express";

export interface RequestUser {
  id: string;
  isVerified: boolean
}

export interface RequestWithContext extends Request {
  context: {
    user: RequestUser;
  }
}
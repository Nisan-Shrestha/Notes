import * as AuthService from "../services/Auth.Services";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";

export async function signup(req: Request, res: Response, next: NextFunction) {
  const data = req.body;

  let serviceResponse = await AuthService.signup(data);

  if (serviceResponse) {
    let message = serviceResponse.redirected
      ? "Logged in Successfully"
      : "Signup Successfull";
    
    res.status(StatusCodes.CREATED).json({
      message: "Logged in succesfully.",
      payload: {
        accessToken: serviceResponse.accessToken,
        refreshToken: serviceResponse.refreshToken,
      },
    });

    return;
  }

  logger.error("signup Failed:");
  throw new Unauthorized("signup Failed");
}

import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getAllDoctor();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctors Fetched Successfully",
    data: result,
  });
});

export const doctorController = {
  getAllDoctors,
};

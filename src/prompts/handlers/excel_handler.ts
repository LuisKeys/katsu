import { createExcel } from "../../exports/excel/create_excel";
import { UserResult } from "../../result/result_object";

const excelExportHandler = async (userResult: UserResult) => {
  createExcel(userResult);
};

export {
  excelExportHandler
};

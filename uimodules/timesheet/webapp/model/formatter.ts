import BaseController from "../controller/BaseController";

export default class Formatter extends BaseController{

	enableRejectBtn(code: number) {
		return code === 1 || code === 4 ? true : false;
	}
	enableAcceptBtn(code: number) {
		return code === 1 || code === 3 ? true : false
	}
	registrationStatusTxt(code: number) {
		return this.getResourceBundle().getText(`reg_status_${code}`);
	}
	showApproveRejectBtns(code: number) {
		return code === 2 ? false : true;
	}
};

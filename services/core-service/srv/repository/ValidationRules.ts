import { ValidationRule } from "../utils/entities/trix/core/trix/admin";
import { Logger, LoggerFactory } from "@gavdi/caplog";
import cds from "@sap/cds";

const { ValidationRules } = cds.entities;

export default class ValidationRulesRepo {
  private logger: Logger;

  constructor() {
    this.logger = LoggerFactory.createLogger("validation-rules-repo");
  }

  public async loadValidationRules(): Promise<ValidationRule[]> {
    try {
      const res = await cds.run(SELECT.from(ValidationRules).limit(100, 0));
      return res ? res : [];
    } catch (e) {
      this.logger.error("Failed to load validation rules from database", e);
      throw new Error("Database error, failed to find rules");
    }
  }
}

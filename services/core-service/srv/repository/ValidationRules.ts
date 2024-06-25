import { ValidationRule } from "#cds-models/trix/core/trix/admin";
import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import { Logger, LoggerFactory } from "@gavdi/caplog";

export default class ValidationRulesRepo extends BaseRepository<ValidationRule> {
  private logger: Logger;

  constructor() {
    super(ValidationRule);

    this.logger = LoggerFactory.createLogger("validation-rules-repo");
  }

  public async loadValidationRules(): Promise<ValidationRule[]> {
    try {
      const res = await this.getAllAndLimit({ limit: 100 });
      return res ? res : [];
    } catch (e) {
      this.logger.error("Failed to load validation rules from database", e);
      throw new Error("Database error, failed to find rules");
    }
  }
}

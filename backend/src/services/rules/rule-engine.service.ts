import {
  ConditionOperator,
  NotificationCondition,
} from "../../types/notification";

export class RuleEngine {
  evaluateCondition(
    condition: NotificationCondition,
    eventData: Record<string, unknown>
  ): boolean {
    const actualValue = eventData[condition.field];
    const expectedValue = condition.value;

    if (actualValue === undefined || actualValue === null) {
      return false;
    }

    switch (condition.operator) {
      case "EQUALS":
        return actualValue === expectedValue;

      case "NOT_EQUALS":
        return actualValue !== expectedValue;

      case "GREATER_THAN":
        return (
          typeof actualValue === "number" &&
          typeof expectedValue === "number" &&
          actualValue > expectedValue
        );

      case "GREATER_THAN_OR_EQUAL":
        return (
          typeof actualValue === "number" &&
          typeof expectedValue === "number" &&
          actualValue >= expectedValue
        );

      case "LESS_THAN":
        return (
          typeof actualValue === "number" &&
          typeof expectedValue === "number" &&
          actualValue < expectedValue
        );

      case "LESS_THAN_OR_EQUAL":
        return (
          typeof actualValue === "number" &&
          typeof expectedValue === "number" &&
          actualValue <= expectedValue
        );

      case "CONTAINS":
        return (
          typeof actualValue === "string" &&
          typeof expectedValue === "string" &&
          actualValue
            .toLowerCase()
            .includes(expectedValue.toLowerCase())
        );

      default:
        return false;
    }
  }

  evaluateRule(
    conditions: NotificationCondition[],
    eventData: Record<string, unknown>
  ): boolean {
    return conditions.every((condition) =>
      this.evaluateCondition(condition, eventData)
    );
  }
}

export const ruleEngine = new RuleEngine();
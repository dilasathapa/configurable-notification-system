import { RuleEngine } from '../rule-engine.service';
import { NotificationCondition } from '../../../types/notification';

describe('RuleEngine', () => {
  const ruleEngine = new RuleEngine();

  describe('evaluateCondition', () => {
    it('returns true for EQUALS when values match', () => {
      const condition: NotificationCondition = {
        field: 'orderValue',
        operator: 'EQUALS',
        value: 10000,
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 10000,
        }),
      ).toBe(true);
    });

    it('returns false for EQUALS when values do not match', () => {
      const condition: NotificationCondition = {
        field: 'orderValue',
        operator: 'EQUALS',
        value: 10000,
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 9000,
        }),
      ).toBe(false);
    });

    it('evaluates GREATER_THAN correctly', () => {
      const condition: NotificationCondition = {
        field: 'orderValue',
        operator: 'GREATER_THAN',
        value: 10000,
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 14000,
        }),
      ).toBe(true);

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 8000,
        }),
      ).toBe(false);
    });

    it('evaluates GREATER_THAN_OR_EQUAL correctly', () => {
      const condition: NotificationCondition = {
        field: 'orderValue',
        operator: 'GREATER_THAN_OR_EQUAL',
        value: 10000,
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 10000,
        }),
      ).toBe(true);

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 9000,
        }),
      ).toBe(false);
    });

    it('evaluates LESS_THAN correctly', () => {
      const condition: NotificationCondition = {
        field: 'orderValue',
        operator: 'LESS_THAN',
        value: 10000,
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 9000,
        }),
      ).toBe(true);

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 12000,
        }),
      ).toBe(false);
    });

    it('evaluates LESS_THAN_OR_EQUAL correctly', () => {
      const condition: NotificationCondition = {
        field: 'orderValue',
        operator: 'LESS_THAN_OR_EQUAL',
        value: 10000,
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 10000,
        }),
      ).toBe(true);

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 12000,
        }),
      ).toBe(false);
    });

    it('evaluates NOT_EQUALS correctly', () => {
      const condition: NotificationCondition = {
        field: 'status',
        operator: 'NOT_EQUALS',
        value: 'CANCELLED',
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          status: 'COMPLETED',
        }),
      ).toBe(true);

      expect(
        ruleEngine.evaluateCondition(condition, {
          status: 'CANCELLED',
        }),
      ).toBe(false);
    });

    it('evaluates CONTAINS case-insensitively', () => {
      const condition: NotificationCondition = {
        field: 'customerName',
        operator: 'CONTAINS',
        value: 'john',
      };

      expect(
        ruleEngine.evaluateCondition(condition, {
          customerName: 'John Smith',
        }),
      ).toBe(true);

      expect(
        ruleEngine.evaluateCondition(condition, {
          customerName: 'Alice Smith',
        }),
      ).toBe(false);
    });

    it('returns false when the event field does not exist', () => {
      const condition: NotificationCondition = {
        field: 'orderValue',
        operator: 'GREATER_THAN',
        value: 10000,
      };

      expect(
        ruleEngine.evaluateCondition(condition, {}),
      ).toBe(false);
    });

    it('returns false for an unsupported operator', () => {
      const condition = {
        field: 'orderValue',
        operator: 'UNKNOWN_OPERATOR',
        value: 10000,
      } as unknown as NotificationCondition;

      expect(
        ruleEngine.evaluateCondition(condition, {
          orderValue: 14000,
        }),
      ).toBe(false);
    });
  });

  describe('evaluateRule', () => {
    it('returns true when all conditions match', () => {
      const conditions: NotificationCondition[] = [
        {
          field: 'orderValue',
          operator: 'GREATER_THAN',
          value: 10000,
        },
        {
          field: 'status',
          operator: 'EQUALS',
          value: 'COMPLETED',
        },
      ];

      expect(
        ruleEngine.evaluateRule(conditions, {
          orderValue: 14000,
          status: 'COMPLETED',
        }),
      ).toBe(true);
    });

    it('returns false when any condition does not match', () => {
      const conditions: NotificationCondition[] = [
        {
          field: 'orderValue',
          operator: 'GREATER_THAN',
          value: 10000,
        },
        {
          field: 'status',
          operator: 'EQUALS',
          value: 'COMPLETED',
        },
      ];

      expect(
        ruleEngine.evaluateRule(conditions, {
          orderValue: 14000,
          status: 'CANCELLED',
        }),
      ).toBe(false);
    });

    it('returns true when a rule has no conditions', () => {
      expect(
        ruleEngine.evaluateRule([], {
          orderValue: 14000,
        }),
      ).toBe(true);
    });
  });
});

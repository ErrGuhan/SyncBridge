/**
 * SyncBridge Payment Service — Revenue Split Unit Tests
 *
 * Run with: node src/tests/revenueSplit.test.js
 * Or via:   npm test  (from services/payment-service/)
 *
 * Uses Node.js built-in `assert` — no external test runner required.
 */

'use strict';

const assert = require('assert');
const path = require('path');

// Load the canonical split constant
const { REVENUE_SPLIT, SPLIT_LABEL } = require(
  path.join(__dirname, '../config/revenueSplit')
);

// Load the split calculation function
const { calculateCooperativeSplit } = require(
  path.join(__dirname, '../controllers/paymentController')
);

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`         ${err.message}`);
    failed++;
  }
}

// ─── Suite 1: REVENUE_SPLIT constant integrity ───────────────────────────────
console.log('\n📋 Suite 1: REVENUE_SPLIT constant integrity');

test('worker ratio is 0.90', () => {
  assert.strictEqual(REVENUE_SPLIT.worker, 0.90);
});

test('coopAdmin ratio is 0.05', () => {
  assert.strictEqual(REVENUE_SPLIT.coopAdmin, 0.05);
});

test('welfare ratio is 0.03', () => {
  assert.strictEqual(REVENUE_SPLIT.welfare, 0.03);
});

test('techFund ratio is 0.02', () => {
  assert.strictEqual(REVENUE_SPLIT.techFund, 0.02);
});

test('all four ratios sum to exactly 1.0', () => {
  const sum =
    REVENUE_SPLIT.worker +
    REVENUE_SPLIT.coopAdmin +
    REVENUE_SPLIT.welfare +
    REVENUE_SPLIT.techFund;
  assert.ok(
    Math.abs(sum - 1.0) <= Number.EPSILON,
    `Expected sum 1.0, got ${sum}`
  );
});

test('SPLIT_LABEL equals "90/5/3/2"', () => {
  assert.strictEqual(SPLIT_LABEL, '90/5/3/2');
});

test('REVENUE_SPLIT is frozen (immutable)', () => {
  const before = REVENUE_SPLIT.worker;
  try { REVENUE_SPLIT.worker = 0.5; } catch (_) { /* strict mode throws */ }
  assert.strictEqual(REVENUE_SPLIT.worker, before,
    'REVENUE_SPLIT should be immutable (Object.freeze)');
});

// ─── Suite 2: calculateCooperativeSplit arithmetic ───────────────────────────
console.log('\n📋 Suite 2: calculateCooperativeSplit arithmetic — ₹500 booking');

const split500 = calculateCooperativeSplit(500);

test('₹500 → workerAmount = ₹450', () => {
  assert.strictEqual(split500.workerAmount, 450,
    `Expected ₹450, got ₹${split500.workerAmount}`);
});

test('₹500 → coopAmount = ₹25', () => {
  assert.strictEqual(split500.coopAmount, 25,
    `Expected ₹25, got ₹${split500.coopAmount}`);
});

test('₹500 → welfareAmount = ₹15', () => {
  assert.strictEqual(split500.welfareAmount, 15,
    `Expected ₹15, got ₹${split500.welfareAmount}`);
});

test('₹500 → techFundAmount = ₹10', () => {
  assert.strictEqual(split500.techFundAmount, 10,
    `Expected ₹10, got ₹${split500.techFundAmount}`);
});

test('₹500 → four amounts sum to gross ₹500', () => {
  const total =
    split500.workerAmount +
    split500.coopAmount +
    split500.welfareAmount +
    split500.techFundAmount;
  assert.strictEqual(total, 500,
    `Expected sum ₹500, got ₹${total}`);
});

// ─── Suite 3: Edge cases ─────────────────────────────────────────────────────
console.log('\n📋 Suite 3: Edge cases');

test('₹0 booking produces all-zero split', () => {
  const s = calculateCooperativeSplit(0);
  assert.strictEqual(s.workerAmount, 0);
  assert.strictEqual(s.coopAmount, 0);
  assert.strictEqual(s.welfareAmount, 0);
  assert.strictEqual(s.techFundAmount, 0);
});

test('₹100 → workerAmount = ₹90, coopAmount = ₹5, welfareAmount = ₹3, techFundAmount = ₹2', () => {
  const s = calculateCooperativeSplit(100);
  assert.strictEqual(s.workerAmount, 90);
  assert.strictEqual(s.coopAmount, 5);
  assert.strictEqual(s.welfareAmount, 3);
  assert.strictEqual(s.techFundAmount, 2);
});

test('₹1000 → all four amounts sum to ₹1000', () => {
  const s = calculateCooperativeSplit(1000);
  const total = s.workerAmount + s.coopAmount + s.welfareAmount + s.techFundAmount;
  assert.strictEqual(total, 1000);
});

test('Emergency booking: surge passes 100% to worker', () => {
  const s = calculateCooperativeSplit(600, true, 100); // ₹500 base + ₹100 surge
  // Worker gets: floor(500*0.90) + 100 = 450 + 100 = 550
  assert.strictEqual(s.workerAmount, 550);
  // Coop gets: floor(500*0.05) = 25
  assert.strictEqual(s.coopAmount, 25);
  // Welfare: floor(500*0.03) = 15
  assert.strictEqual(s.welfareAmount, 15);
  // Tech: floor(500*0.02) = 10
  assert.strictEqual(s.techFundAmount, 10);
  // Total: 550 + 25 + 15 + 10 = 600
  const total = s.workerAmount + s.coopAmount + s.welfareAmount + s.techFundAmount;
  assert.strictEqual(total, 600);
});

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(55)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('❌ Test suite FAILED');
  process.exit(1);
} else {
  console.log('✅ All tests passed');
  process.exit(0);
}

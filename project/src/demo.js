import { evaluateRisk, generateSupportPlan, summarizeVisit } from './engine.js';

const sampleCheckin = {
  mode: 'depression',
  mood: 2,
  anxiety: 6,
  energy: 2,
  sleepHours: 4,
  appetite: 3,
  selfHarmThoughts: 'passive',
  impulsivity: 1,
  elevatedMood: 0,
  medicationMisses7d: 2,
  notes: '今天很难起床，觉得没有希望，但还没有具体计划。'
};

const risk = evaluateRisk(sampleCheckin);
const plan = generateSupportPlan(sampleCheckin, risk);
const summary = summarizeVisit([sampleCheckin]);

console.log('=== Risk ===');
console.log(risk);
console.log('\n=== Support Plan ===');
console.log(plan);
console.log('\n=== Visit Summary ===');
console.log(summary);

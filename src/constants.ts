/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cow, Feed, MilkRecord, FeedSchedule } from './types';

// Initial Mock Data
export const INITIAL_COWS: Cow[] = [
  { 
    id: '1', 
    tagNumber: 'C-001', 
    name: 'Bessie', 
    breed: 'Holstein', 
    status: 'Active', 
    birthDate: '2020-05-15',
    vaccinations: [
      { date: '2026-01-10', type: 'FMD', notes: 'Annually required' },
      { date: '2025-06-20', type: 'Anthrax' }
    ],
    healthConditions: ['Slightly lame last month'],
    behaviors: ['Social', 'Calm'],
    dietaryNotes: 'Prefers Alfalfa over Silage.' 
  },
  { 
    id: '2', 
    tagNumber: 'C-002', 
    name: 'Daisy', 
    breed: 'Jersey', 
    status: 'Active', 
    birthDate: '2021-02-10',
    vaccinations: [],
    healthConditions: [],
    behaviors: ['Aggressive feeder', 'Nervous'],
    dietaryNotes: 'Requires high protein concentrate.'
  },
  { 
    id: '3', 
    tagNumber: 'C-003', 
    name: 'Bella', 
    breed: 'Guernsey', 
    status: 'Dry', 
    birthDate: '2019-11-20',
    vaccinations: [{ date: '2025-11-05', type: 'Brucellosis' }],
    healthConditions: ['Recovered from Mastitis'],
    behaviors: ['Gentle'],
    dietaryNotes: 'Restricted diet during dry period.'
  },
];

export const INITIAL_FEEDS: Feed[] = [
  { id: 'f1', name: 'Premium Corn Grain', type: 'Grain' as any, quantity: 500, unit: 'kg', reorderPoint: 100 },
  { id: 'f2', name: 'Alfalfa Hay', type: 'Hay' as any, quantity: 1200, unit: 'kg', reorderPoint: 200 },
  { id: 'f3', name: 'Corn Silage', type: 'Silage' as any, quantity: 2000, unit: 'kg', reorderPoint: 500 },
];

export const INITIAL_MILK_RECORDS: MilkRecord[] = [
  { id: 'm1', cowId: '1', date: '2026-05-09', morningYield: 15.5, afternoonYield: 12.2, totalYield: 27.7 },
  { id: 'm2', cowId: '2', date: '2026-05-09', morningYield: 12.0, afternoonYield: 10.5, totalYield: 22.5 },
];

export const INITIAL_SCHEDULES: FeedSchedule[] = [
  { id: 's1', date: '2026-05-10', targetType: 'Individual', targetId: '1', feedId: 'f1', quantity: 5, unit: 'kg', status: 'Scheduled' },
];

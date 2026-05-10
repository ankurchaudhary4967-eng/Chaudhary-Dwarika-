/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum FeedType {
  GRAIN = 'Grain',
  SILAGE = 'Silage',
  HAY = 'Hay',
  CONCENTRATE = 'Concentrate',
  SUPPLEMENT = 'Supplement',
}

export interface Feed {
  id: string;
  name: string;
  type: FeedType;
  quantity: number; // in kg
  unit: string;
  reorderPoint: number;
}

export interface Vaccination {
  date: string;
  type: string;
  notes?: string;
}

export interface Cow {
  id: string;
  tagNumber: string;
  name: string;
  breed: string;
  status: 'Active' | 'Dry' | 'Sick' | 'Sold';
  birthDate: string;
  vaccinations: Vaccination[];
  healthConditions: string[];
  behaviors: string[];
  dietaryNotes: string;
}

export interface MilkRecord {
  id: string;
  cowId: string;
  date: string; // ISO string (YYYY-MM-DD)
  morningYield: number; // in Liters
  afternoonYield: number; // in Liters
  totalYield: number;
}

export interface FeedSchedule {
  id: string;
  date: string;
  targetType: 'Individual' | 'Group';
  targetId: string; // Cow ID or Group Name
  feedId: string;
  quantity: number;
  unit: string;
  status: 'Scheduled' | 'Completed' | 'Skipped';
}

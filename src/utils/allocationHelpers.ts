/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Researcher } from '../types.ts';

/**
 * Split a string containing multiple items by commas (Arabic/English), semicolons, or plus
 */
export function splitItems(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((s) => s.trim()).filter(Boolean);
  }
  // Split on Arabic comma '،', English comma ',', newline, or semicolon
  return value
    .split(/[,،;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Get normalized list of assigned regions for a researcher
 */
export function getResearcherRegions(r: Researcher): string[] {
  if (r.assignedRegions && r.assignedRegions.length > 0) {
    return r.assignedRegions.map((s) => s.trim()).filter(Boolean);
  }
  return splitItems(r.assignedRegion);
}

/**
 * Get normalized list of assigned blocks for a researcher
 */
export function getResearcherBlocks(r: Researcher): string[] {
  if (r.assignedBlocks && r.assignedBlocks.length > 0) {
    return r.assignedBlocks.map((s) => s.trim()).filter(Boolean);
  }
  return splitItems(r.assignedBlock);
}

/**
 * Format an array of strings as a unified Arabic display string
 */
export function joinItemsArabic(items: string[]): string {
  return items.filter(Boolean).join('، ');
}

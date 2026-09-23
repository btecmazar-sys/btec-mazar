/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AllocationConflict, Researcher, RegionConfig } from '../types.ts';
import { getResearcherRegions, getResearcherBlocks } from './allocationHelpers.ts';

/**
 * Detects conflicts in researchers' block allocations with full support for multiple regions and multiple blocks.
 */
export function detectConflicts(
  researchers: Researcher[],
  regions: RegionConfig[]
): AllocationConflict[] {
  const conflicts: AllocationConflict[] = [];
  const regionMap = new Map<string, RegionConfig>();
  regions.forEach((r) => {
    regionMap.set(r.name, r);
    regionMap.set(r.id, r);
  });

  // Track (region + '::' + normalizedBlock) -> list of researchers
  const assignmentMap = new Map<string, Researcher[]>();

  researchers.forEach((r) => {
    const researcherRegions = getResearcherRegions(r);
    const researcherBlocks = getResearcherBlocks(r);

    if (researcherBlocks.length === 0) return;

    // For each assigned block
    researcherBlocks.forEach((block) => {
      const normalizedBlock = block.replace(/\s+/g, '');

      // Check across all assigned regions or default
      const effectiveRegions = researcherRegions.length > 0 ? researcherRegions : ['عام'];

      effectiveRegions.forEach((reg) => {
        const key = `${reg}::${normalizedBlock}`;
        const existing = assignmentMap.get(key) || [];
        if (!existing.some((item) => item.id === r.id)) {
          existing.push(r);
        }
        assignmentMap.set(key, existing);

        // Check if block is allowed in that region if region has defined blocks
        const matchedRegion = regionMap.get(reg);
        if (matchedRegion && matchedRegion.allowedBlocks && matchedRegion.allowedBlocks.length > 0) {
          const isAllowed = matchedRegion.allowedBlocks.some(
            (b) => b.trim() === block || b.replace(/\s+/g, '') === normalizedBlock
          );
          if (!isAllowed) {
            // Only add unlisted warning if not already reported
            const alreadyReported = conflicts.some(
              (c) => c.type === 'unlisted' && c.region === reg && c.block === block && c.researcherIds.includes(r.id)
            );
            if (!alreadyReported) {
              conflicts.push({
                type: 'unlisted',
                region: reg,
                block: block,
                researcherIds: [r.id],
                researcherNames: [r.name],
                message: `البلوك (${block}) غير مدرج ضمن البلوكات المعتمدة لمنطقة ${reg} المسندة للباحث ${r.name}`,
              });
            }
          }
        }
      });
    });
  });

  // Check for duplicates
  assignmentMap.forEach((list, key) => {
    if (list.length > 1) {
      const [reg, block] = key.split('::');
      conflicts.push({
        type: 'duplicate',
        region: reg,
        block: block,
        researcherIds: list.map((item) => item.id),
        researcherNames: list.map((item) => item.name),
        message: `تعارض: تم تخصيص البلوك (${block}) في منطقة (${reg}) لأكثر من باحث (${list
          .map((item) => item.name)
          .join('، ')})`,
      });
    }
  });

  return conflicts;
}

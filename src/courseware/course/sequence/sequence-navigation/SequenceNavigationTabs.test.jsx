import React from 'react';
import { Factory } from 'rosie';
import { initializeTestStore, render, screen } from '../../../../setupTest';
import SequenceNavigationTabs from './SequenceNavigationTabs';
import useIndexOfLastVisibleChild from '../../../../generic/tabs/useIndexOfLastVisibleChild';

// Mock the hook to avoid relying on its implementation and mocking `getBoundingClientRect`.
jest.mock('../../../../generic/tabs/useIndexOfLastVisibleChild');

describe('Sequence Navigation Tabs', () => {
  let mockData;

  const courseMetadata = Factory.build('courseMetadata');
  const unitBlocks = [Factory.build(
    'block',
    { type: 'problem' },
    { courseId: courseMetadata.id },
  ), Factory.build(
    'block',
    { type: 'video', complete: true },
    { courseId: courseMetadata.id },
  ), Factory.build(
    'block',
    { type: 'other', complete: true, bookmarked: true },
    { courseId: courseMetadata.id },
  )];
  const activeBlockNumber = 2;

  beforeAll(async () => {
    await initializeTestStore({ courseMetadata, unitBlocks });
    mockData = {
      // Blocks are numbered from 1 in the UI, so we're decreasing this by 1 to have correct block's ID in the array.
      unitId: unitBlocks[activeBlockNumber - 1].id,
      onNavigate: () => {},
      showCompletion: false,
      unitIds: unitBlocks.map(unit => unit.id),
    };
  });

  it('renders unit buttons', () => {
    useIndexOfLastVisibleChild.mockReturnValue([0, null, null]);
    render(<SequenceNavigationTabs {...mockData} />);

    expect(screen.getAllByRole('button')).toHaveLength(unitBlocks.length);
  });

  it('renders unit buttons and dropdown button', () => {
    useIndexOfLastVisibleChild.mockReturnValue([-1, null, null]);
    render(<SequenceNavigationTabs {...mockData} />);

    expect(screen.getAllByRole('button')).toHaveLength(unitBlocks.length + 1);
    expect(screen.getByRole('button', { name: `${activeBlockNumber} of ${unitBlocks.length}` }))
      .toHaveClass('dropdown-button');
  });
});
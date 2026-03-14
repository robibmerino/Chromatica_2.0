import type { Meta, StoryObj } from '@storybook/react';
import { BaseColorPicker } from './BaseColorPicker';

const meta: Meta<typeof BaseColorPicker> = {
  component: BaseColorPicker,
  title: 'Paleta/BaseColorPicker',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BaseColorPicker>;

export const Default: Story = {
  args: {
    value: '#6366f1',
    label: 'Color base',
    onChange: () => {},
  },
};

export const TamañoMedio: Story = {
  args: {
    value: '#ec4899',
    label: 'Acento',
    size: 'md',
    onChange: () => {},
  },
};

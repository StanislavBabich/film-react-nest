import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FilmPreview } from './FilmPreview';
import {CDN_URL} from "../../utils/constants.ts";

const meta = {
  title: 'UI/FilmPreview',
  component: FilmPreview,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof FilmPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id:"821802ac-332d-4e65-acd4-5f6ef14f5880",
    rating: '2.9',
    director: 'Ethan Wright',
    tags: ['Documentary'],
    title: 'Architects of Society',
    description: "Ethan Wright's documentary examines how technology is reshaping modern society, with a focus on the role of artificial intelligence in our future. The film looks at the ethical, philosophical, and social consequences of the AI race and asks what kind of world we are building for the next generations.",
    cover: `${CDN_URL}/bg1c.jpg`
  },
};

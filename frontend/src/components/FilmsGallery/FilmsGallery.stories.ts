import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FilmsGallery } from './FilmsGallery';
import {CDN_URL} from "../../utils/constants.ts";

const meta = {
  title: 'UI/FilmsGallery',
  component: FilmsGallery,
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn()
  },
} satisfies Meta<typeof FilmsGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        "id": "1",
        "title": "Architects of Society",
        "image": `${CDN_URL}/bg1s.jpg`
      },
      {
        "id": "2",
        "title": "Unreachable Utopia",
        "image": `${CDN_URL}/bg3s.jpg`
      },
      {
        "id": "3",
        "title": "Star Voyage",
        "image": `${CDN_URL}/bg5s.jpg`
      },
      {
        "id": "4",
        "title": "Guardians of the Grimoire",
        "image": `${CDN_URL}/bg2s.jpg`
      },
      {
        "id": "5",
        "title": "Nexus Paradox",
        "image": `${CDN_URL}/bg4s.jpg`
      },
      {
        "id": "6",
        "title": "A Midsummer Day's Dream",
        "image": `${CDN_URL}/bg6s.jpg`
      }
    ],
    selected: "2"
  },
};
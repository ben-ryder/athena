import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TagSelector } from './tag-selector';
import {useArgs} from "@storybook/client-api";

export default {
  title: 'Elements/TagSelector',
  component: TagSelector
} as ComponentMeta<typeof TagSelector>;

const Template: ComponentStory<typeof TagSelector> = (args) => {
  const [{ currentOptions, onOptionsChange }, updateArgs] = useArgs();

  return (
    <TagSelector
      {...args}
      currentOptions={currentOptions}
      onOptionsChange={(options) => {
        updateArgs({currentOptions: options});
        onOptionsChange(options);
      }}
    />
  )
};

const options = [
  {name: "Option 1", value: "1"},
  {name: "Option 2", value: "2"},
  {name: "Option 3", value: "3"},
  {name: "Option 4", value: "4"},
  {name: "Option 5", value: "5"},
  {name: "Option 6", value: "6"},
]

export const Default = Template.bind({});
Default.args = {
  id: "default",
  label: "Select Note Tags",
  placeholder: "select tags...",
  options: options,
  currentOptions: [options[0], options[3]]
};

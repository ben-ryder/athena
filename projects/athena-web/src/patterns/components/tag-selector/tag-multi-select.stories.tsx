import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TagMultiSelect } from './tag-multi-select';
import {useArgs} from "@storybook/client-api";

export default {
  title: 'Elements/TagSelector',
  component: TagMultiSelect
} as ComponentMeta<typeof TagMultiSelect>;

const Template: ComponentStory<typeof TagMultiSelect> = (args) => {
  const [{ currentOptions, onOptionsChange }, updateArgs] = useArgs();

  return (
    <TagMultiSelect
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
  currentOptions: [options[0].value, options[3].value]
};

import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {SavedStatus, SavedStatusIndicator} from "./saved-status-indicator";

export default {
    title: 'Elements/SavedStatusIndicator',
    component: SavedStatusIndicator
} as ComponentMeta<typeof SavedStatusIndicator>;

const Template: ComponentStory<typeof SavedStatusIndicator> = (args) => {
    return (
        <SavedStatusIndicator
            {...args}
        />
    )
};

export const Default = Template.bind({});
Default.args = {
    status: SavedStatus.SAVED
};

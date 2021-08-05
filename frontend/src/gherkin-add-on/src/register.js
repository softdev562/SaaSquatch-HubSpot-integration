import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';

/**
 * Custom addon in Storybook to load gherkin/cucumber feature files in a new panel for each story.
 * This loads the raw file contents.
 */

const ADDON_ID = 'cucumber';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = 'cucumber';

const MyPanel = () => {
  const panelParam = useParameter(PARAM_KEY, null);
  let feature;
  if(panelParam){
    const featureGherkin = require(`../../features/${encodeURIComponent(panelParam.data)}`);
    feature = String(featureGherkin.default).split('\n');
    const FeatureLines = feature.map((item, index) => <p key={index}>{item}</p> );
    return <div key="feature-file">{FeatureLines} </div>;
  }
  else{
    feature = 'No Cucumber feature defined';
    return <div>{feature}</div>;
  }
};

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Cucumber Feature',
    render: ({ active, key }) => (
      <AddonPanel active={active} key='gherkin-panel'>
        <MyPanel />
      </AddonPanel>
    ),
  });
});

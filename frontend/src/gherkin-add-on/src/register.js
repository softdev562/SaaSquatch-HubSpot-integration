import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';

const ADDON_ID = 'gherkin';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = 'gherkin';

const MyPanel = () => {
  const panelParam = useParameter(PARAM_KEY, null);
  let feature;
  if(panelParam){
    //item = getFeature(panelParam.data);
    const featureGherkin = require(`../../features/${encodeURIComponent(panelParam.data)}`);
    feature = String(featureGherkin.default).split('\n');
    //item = feature;
    //console.log(feature);
    const FeatureLines = feature.map((item, index) => <p key={index}>{item}</p> );
    return <div key="feature-file">{FeatureLines} </div>;
  }
  else{
    feature = 'No Gherkin feature defined';
    return <div>{feature}</div>;
  }
  
};


addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Gherkin',
    render: ({ active, key }) => (
      <AddonPanel active={active} key='gherkin-panel'>
        <MyPanel />
      </AddonPanel>
    ),
  });
});

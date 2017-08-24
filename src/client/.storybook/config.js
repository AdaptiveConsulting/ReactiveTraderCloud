import { configure } from '@kadira/storybook';

const loadStories = () => require('../workbench/');

configure(loadStories, module);

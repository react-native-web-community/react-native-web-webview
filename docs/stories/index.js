import React from 'react';
import * as html from './html';
import * as uri from './uri';

import { storiesOf } from '@storybook/react';

storiesOf('HTML source', module).add('basic', html.basic);

storiesOf('URI source', module).add('basic', uri.basic);

import { IconButton } from '@material-ui/core';
import ReplayIcon from '@material-ui/icons/Replay';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as effect from '../effect';
import * as select from '../select';

export function Restart(props: { style?: any }) {
  const dispatch = useDispatch();
  const rangeCursor = useSelector(select.rangeCursor);

  return (
    <IconButton style={props.style} onClick={() => dispatch(effect.restart(rangeCursor))} data-testid="restart">
      <ReplayIcon />
    </IconButton>
  );
}

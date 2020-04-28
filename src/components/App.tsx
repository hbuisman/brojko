import { Container, Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swipeable } from 'react-swipeable';

import * as app from '../app';
import * as effect from '../effect';
import { Answer } from './Answer';
import { Duck } from './Duck/Duck';
import { FullScreen } from './FullScreen';
import { NextQuestion } from './NextQuestion';
import { Preferences } from './Preferences';
import { PreferencesButton } from './PreferencesButton';
import { PreviousQuestion } from './PreviousQuestion';
import { Restart } from './Restart';
import { Speaker } from './Speaker';
import { Visualization } from './Visualization';

function Desktop(props: { hasVoice: boolean }) {
  return (
    <Container>
      <Paper elevation={3} style={{ marginTop: '2em', padding: '2em' }}>
        <Grid container>
          <Grid item xs={1}>
            <PreviousQuestion />
          </Grid>

          <Grid item xs={6}>
            <Answer />

            <Visualization style={{ marginTop: '1em', height: '20em' }} />
          </Grid>

          <Grid item xs={2}>
            {props.hasVoice ? <Speaker large /> : null}
          </Grid>

          <Grid item xs={2}>
            <Duck />
          </Grid>

          <Grid item xs={1}>
            <NextQuestion />
          </Grid>
        </Grid>

        <div style={{ marginTop: '8em' }}>
          <PreferencesButton />

          <FullScreen />

          <Restart style={{ float: 'right' }} />
        </div>
      </Paper>
      <div style={{ fontSize: 'xx-small', marginTop: '5em' }}>
        Copyright © 2020 Marko Ristin. MIT License. Github repository:{' '}
        <a href="https://github.com/mristin/brojko">https://github.com/mristin/brojko</a>
      </div>

      <Preferences />
    </Container>
  );
}

function Mobile(props: { hasVoice: boolean }) {
  return (
    <Container>
      <Paper elevation={3} style={{ marginTop: '1em', padding: '1em' }}>
        <Grid container>
          <Grid item xs={2}>
            <PreviousQuestion />
          </Grid>

          <Grid item xs={8}>
            <Answer />
          </Grid>

          <Grid item xs={2}>
            <NextQuestion />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={4}>
            {props.hasVoice ? <Speaker large /> : null}
          </Grid>

          <Grid item xs={8}>
            <Duck />
          </Grid>
        </Grid>

        <div style={{ marginTop: '3em' }}>
          <PreferencesButton />

          <FullScreen />

          <Restart style={{ float: 'right' }} />
        </div>
      </Paper>
      <div style={{ fontSize: 'xx-small', marginTop: '5em' }}>
        Copyright © 2020 Marko Ristin. MIT License. Github repository:{' '}
        <a href="https://github.com/mristin/brojko">https://github.com/mristin/brojko</a>
      </div>

      <Preferences />
    </Container>
  );
}

function useWindowSize() {
  // From https://usehooks.com/useWindowSize/
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount.

  return windowSize;
}

export function App() {
  const hasVoice = useSelector((s: app.State) => s.voiceByLanguage.get(s.language) !== undefined);

  const dispatch = useDispatch();

  const { width } = useWindowSize();
  let mobileOrDesktop: any = undefined;
  if (width === undefined || width < 500) {
    mobileOrDesktop = <Mobile hasVoice={hasVoice} />;
  } else {
    mobileOrDesktop = <Desktop hasVoice={hasVoice} />;
  }

  return (
    <Swipeable
      onSwipedRight={() => dispatch(effect.previousQuestion())}
      onSwipedLeft={() => dispatch(effect.nextQuestion())}
    >
      {mobileOrDesktop}
    </Swipeable>
  );
}
// TODO: add urlware and autosave

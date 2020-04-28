import * as React from 'react';
import { useSelector } from 'react-redux';

import * as select from '../select';

const srcs = [
  'media/apple.png',
  'media/lemon.png',
  'media/maize.png',
  'media/peach.png',
  'media/pear.png',
  'media/pine-apple.png',
  'media/strawberry.png',
  'media/tangerine.png',
  'media/watermelon.png',
];

function Symbol(props: { style?: any }) {
  const questionCursor = useSelector(select.questionCursor);

  const src = srcs[questionCursor];
  return <img alt="X" src={src} style={props.style} />;
}

function Row(props: { count: number }) {
  if (props.count < 0) {
    throw Error(`Unexpected count of symbols: ${props.count}`);
  }

  const size = '2em';

  const symbols = [<Symbol key={0} style={{ height: size, width: size }} />];
  for (let i = 1; i < props.count; i++) {
    symbols.push(<Symbol key={i} style={{ marginLeft: '1em', height: size, width: size }} />);
  }
  return <div>{symbols}</div>;
}

export function Visualization(props: { style?: any }) {
  const question: number = useSelector(select.question);

  const tens = Math.floor(question / 10);
  const remainder = question - tens * 10;

  const rows = [];
  let i = 0;
  for (; i < tens; i++) {
    rows.push(<Row count={10} key={i} />);
  }
  if (remainder > 0) {
    rows.push(<Row count={remainder} key={i} />);
  }

  return <div style={props.style}>{rows}</div>;
}

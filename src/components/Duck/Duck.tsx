import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import * as select from '../../select';
import * as path from './path';

function usePrevious(hit: boolean): boolean | undefined {
  const ref = useRef<boolean>();
  useEffect(() => {
    ref.current = hit;
  });
  return ref.current;
}

function Part(props: { path: any; fill: string; cursored: boolean; hit: boolean }) {
  const strokeAttributes = props.cursored ? { stroke: 'red', strokeWidth: '40' } : {};

  const prevHit = usePrevious(props.hit);

  const transitionAttributes =
    (prevHit === undefined || !prevHit) && props.hit ? { style: { transition: 'all 1s linear' } } : {};

  return (
    <path fill={props.hit ? props.fill : 'white'} d={props.path} {...strokeAttributes} {...transitionAttributes} />
  );
}

const fillsPaths: Array<[string, string]> = [
  ['#B4202E', path.D1],
  ['#999651', path.D2],
  ['#318781', path.D5],
  ['#999651', path.D6],
  ['#B4202E', path.D7],
  ['#DE832C', path.D8],
  ['#DE832C', path.D10],
  ['#DE832C', path.D11],
  ['#374552', path.D12],
];

export function Duck(props: { style?: any }) {
  const hits = useSelector(select.hits);
  const questionCursor = useSelector(select.questionCursor);

  if (hits.length !== 9) {
    throw Error(`Expected 9 hit states to draw the duck, but got: ${hits.length}`);
  }
  if (questionCursor < 0 || questionCursor >= 9) {
    throw Error(`Expected the question cursor to be within the range [0, 8), but got: ${questionCursor}`);
  }

  const parts = hits.map((hit, i) => {
    const [fill, path] = fillsPaths[i];
    return <Part key={i} path={path} fill={fill} cursored={questionCursor === i} hit={hit} />;
  });

  return (
    <div style={{ display: 'inline-block' }}>
      <svg
        style={props.style}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 3000 3000"
        enableBackground="new 0 0 3000 3000"
        xmlSpace="preserve"
        width="12em"
        height="12em"
      >
        {parts}
        <path d={path.D9} />
        <path d={path.D13} />

        <ellipse cx="2012" cy="709.4" rx="43.5" ry="41" />
      </svg>
    </div>
  );
}

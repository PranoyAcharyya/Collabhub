'use client';

import dynamic from 'next/dynamic';

const BlockEditor = dynamic(
  () => import('./BlockEditorInternal'),
  { ssr: false }
);

export default BlockEditor;

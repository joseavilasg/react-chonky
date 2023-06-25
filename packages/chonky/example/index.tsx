import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { FullFileBrowser } from '../dist/chonky.esm';

const files=Array(1000).fill(0).map((item,index)=>({ id: index.toString(), name: 'My File.txt' }))
const App = () => {
  const pathEntries = ['test', 'folder'];
  return (
    <div style={{ height: 400 }}>
      <FullFileBrowser
        folderChain={pathEntries.map((name, idx) => ({
          id: `${idx}`,
          name,
        }))}
        files={files}
      />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

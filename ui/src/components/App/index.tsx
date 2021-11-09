import React, { ReactElement, useState } from 'react';

import './app.component.css';

const App = (
  {
    children
  }: {
    children: ReactElement,
  },
) => {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      { children }
      <p>
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          __('countIs'): {count}
        </button>
      </p>
    </div>
  );
};

export default App;

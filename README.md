# EVA-libre

## Installation

To install the system, follow these steps:

1. Install deps:
```bash
yarn install
```

2. Start server:
```bash
yarn start
```



## Using the System

### Animation Manager

The Animation Manager is responsible for controlling the visual animations of characters. To use the Animation Manager, import it into your project and create an instance of it.

Example:
```javascript
import AnimationManager from './src/VISOS/effectors/visualizers/AnimationManager';

const animationManager = new AnimationManager();
// Use animationManager to control animations
```

### App.js Example Usage Patterns

In `app.js`, you can set up the initial environment and include the main components of the system, such as the Animation Manager and the newly added UI sensor components.

Example:
```javascript
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import SmileControl from './src/VISOS/sensors/UI/SmileControl';
import AnimationManager from './src/VISOS/effectors/visualizers/AnimationManager';

function App() {
  const animationManager = new AnimationManager();
  // Setup and use animationManager as needed

  return (
    <ChakraProvider>
      <div className="App">
        <h1>EVA-libre System</h1>
        <SmileControl />
        {/* Include other UI components as needed */}
      </div>
    </ChakraProvider>
  );
}

export default App;
```

This setup includes the ChakraProvider for using Chakra UI components, integrates the SmileControl component for demonstrating UI interaction, and prepares the application for further expansion with additional sensors and effectors.

For more detailed documentation on using other components of the system, refer to the respective component documentation.

# EVA-libre
# EVA-libre

## Installation

To install the system, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/meekmachine/EVA-libre.git
```

2. Switch to the `react` branch:
```bash
git checkout react
```

3. Install dependencies:
```bash
npm install
```

## Using the System

### Animation Manager

The Animation Manager is responsible for controlling the visual animations of characters. To use the Animation Manager, import it into your project and create an instance of it.

Example:
```javascript
import AnimationManager from './src/VISOS/effectors/visualizers/AnimationManager';

const animationManager = new AnimationManager();
// Use animationManager to control animations
```

### App.js Example Usage Patterns

In `app.js`, you can set up the initial environment and include the main components of the system, such as the Animation Manager and the newly added UI sensor components.

Example:
```javascript
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import SmileControl from './src/VISOS/sensors/UI/SmileControl';
import AnimationManager from './src/VISOS/effectors/visualizers/AnimationManager';

function App() {
  const animationManager = new AnimationManager();
  // Setup and use animationManager as needed

  return (
    <ChakraProvider>
      <div className="App">
        <h1>EVA-libre System</h1>
        <SmileControl />
        {/* Include other UI components as needed */}
      </div>
    </ChakraProvider>
  );
}

export default App;
```

This setup includes the ChakraProvider for using Chakra UI components, integrates the SmileControl component for demonstrating UI interaction, and prepares the application for further expansion with additional sensors and effectors.

For more detailed documentation on using other components of the system, refer to the respective component documentation.


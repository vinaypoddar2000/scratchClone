# Mini Scratch Clone

A simplified visual programming environment inspired by MIT's Scratch, built with React. This interactive application allows users to create animations and control multiple sprites using drag-and-drop programming blocks.

## 🎯 Features

### Sprite Management
- **Add Sprites**: Add up to 4 different sprites (Cat, Dog, Fox, Panda)
- **Remove Sprites**: Hover over any sprite and click the delete button to remove it
- **Multiple Sprites**: Control multiple sprites simultaneously, each with independent scripts
- **Sprite Selection**: Switch between sprites to edit their individual scripts

### Programming Blocks

#### Motion Blocks (Blue)
- **Move X steps**: Move the sprite forward by a specified number of steps
- **Turn X degrees**: Rotate the sprite by a specified angle
- **Go to x:X y:Y**: Translocate the sprite to specific coordinates
- **Repeat X times**: Repeat an action 

#### Looks Blocks (Purple)
- **Say "text" for X secs**: Display a speech bubble with custom text
- **Think "text" for X secs**: Display a thought bubble with custom text

### Interactive Features
- **Drag & Drop**: Drag blocks from the block section to the script area
- **Editable Parameters**: Click on any parameter in the script area to customize values
- **Remove Blocks**: Delete individual blocks from scripts using the delete icon
- **Reset Positions**: Return all sprites to their initial positions
- **Play**: Execute all scripts simultaneously for all sprites

### Hero Features
- **Collision Detection**: Sprites automatically detect when they collide with each other
- **Script Swapping**: When two sprites collide, they swap their animation scripts
- **Parallel Execution**: All sprite scripts run simultaneously when you press Play
- **Visual Feedback**: Sprites display "Swapped!" messages when collision occurs

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scratch-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Basic Workflow

1. **Select a Sprite**
   - Use the dropdown menu in the Scripts section to choose which sprite you want to program

2. **Add Programming Blocks**
   - Drag blocks from the blocks section to the script area in the middle
   - Blocks will be added to the currently selected sprite

3. **Customize Block Parameters**
   - Click on any number or text field within a block to edit its value
   - For example, change "Move 10 steps" to "Turn 45 degrees"

4. **Build Your Animation**
   - Add multiple blocks to create complex sequences
   - Each sprite can have its own unique script

5. **Run Your Program**
   - Click the green "Play" button to execute all scripts
   - Watch your sprites animate on the stage!

6. **Reset and Try Again**
   - Use the "Reset" button to return sprites to starting positions
   - Modify scripts and run again

## 🛠️ Technologies Used

- **React**: UI framework
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling and layout
- **JavaScript ES6+**: Core programming logic


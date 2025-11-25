import React, { useState } from 'react';
import { Play, RotateCw, Trash2 } from 'lucide-react';

const SPRITE_IMAGES = [
  { id: 1, emoji: '🐱', name: 'Cat' },
  { id: 2, emoji: '🐶', name: 'Dog' },
  { id: 3, emoji: '🦊', name: 'Fox' },
  { id: 4, emoji: '🐼', name: 'Panda' }
];

const MOTION_BLOCKS = [
  { id: 'move', label: 'Move {} steps', type: 'motion', params: [10] },
  { id: 'turn', label: 'Turn {} degrees', type: 'motion', params: [15] },
  { id: 'goto', label: 'Go to x:{} y:{}', type: 'motion', params: [0, 0] },
  { id: 'repeat', label: 'Repeat {} times', type: 'motion', params: [2] }
];

const LOOKS_BLOCKS = [
  { id: 'say', label: 'Say {} for {} secs', type: 'looks', params: ['Hello!', 2] },
  { id: 'think', label: 'Think {} for {} secs', type: 'looks', params: ['Hmm...', 2] }
];

export default function ScratchClone() {
  const [sprites, setSprites] = useState([
    { id: 1, emoji: '🐱', name: 'Cat', x: 100, y: 150, rotation: 0, blocks: [], message: '', messageType: '' },
    { id: 2, emoji: '🐶', name: 'Dog', x: 250, y: 150, rotation: 0, blocks: [], message: '', messageType: '' },
    { id: 3, emoji: '🦊', name: 'Fox', x: 100, y: 280, rotation: 0, blocks: [], message: '', messageType: '' }
  ]);
  const [selectedSprite, setSelectedSprite] = useState(1);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSprite = sprites.find(s => s.id === selectedSprite);

  const handleDragStart = (block) => {
    setDraggedBlock({ 
      ...block, 
      instanceId: Date.now(),
      params: [...block.params]
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedBlock) {
      setSprites(prev => prev.map(sprite => 
        sprite.id === selectedSprite 
          ? { ...sprite, blocks: [...sprite.blocks, draggedBlock] }
          : sprite
      ));
      setDraggedBlock(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const updateBlockParam = (blockIndex, paramIndex, value) => {
    setSprites(prev => prev.map(sprite => {
      if (sprite.id === selectedSprite) {
        const newBlocks = [...sprite.blocks];
        newBlocks[blockIndex].params[paramIndex] = value;
        return { ...sprite, blocks: newBlocks };
      }
      return sprite;
    }));
  };

  const removeBlock = (blockIndex) => {
    setSprites(prev => prev.map(sprite => {
      if (sprite.id === selectedSprite) {
        return { ...sprite, blocks: sprite.blocks.filter((_, i) => i !== blockIndex) };
      }
      return sprite;
    }));
  };

  const checkCollision = (sprite1, sprite2) => {
    const distance = Math.sqrt(
      Math.pow(sprite1.x - sprite2.x, 2) + Math.pow(sprite1.y - sprite2.y, 2)
    );
    return distance < 60;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const executeBlocksForSprite = async (sprite) => {
    const state = {
      x: sprite.x,
      y: sprite.y,
      rotation: sprite.rotation
    };

    for (const block of sprite.blocks) {
      if (block.id === 'move') {
        const steps = Number(block.params[0]) || 0;
        const rad = (state.rotation * Math.PI) / 180;
        state.x += steps * Math.cos(rad);
        state.y += steps * Math.sin(rad);
        state.x = Math.max(30, Math.min(470, state.x));
        state.y = Math.max(30, Math.min(370, state.y));
        
        setSprites(prev => prev.map(s => 
          s.id === sprite.id ? { ...s, x: state.x, y: state.y } : s
        ));
        await sleep(300);
      }
      
      if (block.id === 'turn') {
        const degrees = Number(block.params[0]) || 0;
        state.rotation += degrees;
        setSprites(prev => prev.map(s => 
          s.id === sprite.id ? { ...s, rotation: state.rotation } : s
        ));
        await sleep(300);
      }
      
      if (block.id === 'goto') {
        state.x = Number(block.params[0]) || 0;
        state.y = Number(block.params[1]) || 0;
        state.x = Math.max(30, Math.min(470, state.x));
        state.y = Math.max(30, Math.min(370, state.y));
        setSprites(prev => prev.map(s => 
          s.id === sprite.id ? { ...s, x: state.x, y: state.y } : s
        ));
        await sleep(300);
      }
      
      if (block.id === 'repeat') {
        const times = Number(block.params[0]) || 1;
        for (let i = 0; i < times; i++) {
          state.rotation += 90;
          setSprites(prev => prev.map(s => 
            s.id === sprite.id ? { ...s, rotation: state.rotation } : s
          ));
          await sleep(300);
        }
      }
      
      if (block.id === 'say') {
        const message = block.params[0] || '';
        const duration = (Number(block.params[1]) || 2) * 1000;
        setSprites(prev => prev.map(s => 
          s.id === sprite.id ? { ...s, message, messageType: 'say' } : s
        ));
        await sleep(duration);
        setSprites(prev => prev.map(s => 
          s.id === sprite.id ? { ...s, message: '', messageType: '' } : s
        ));
      }
      
      if (block.id === 'think') {
        const message = block.params[0] || '';
        const duration = (Number(block.params[1]) || 2) * 1000;
        setSprites(prev => prev.map(s => 
          s.id === sprite.id ? { ...s, message, messageType: 'think' } : s
        ));
        await sleep(duration);
        setSprites(prev => prev.map(s => 
          s.id === sprite.id ? { ...s, message: '', messageType: '' } : s
        ));
      }
    }

    return { id: sprite.id, x: state.x, y: state.y, rotation: state.rotation };
  };

  const executeBlocks = async () => {
    setIsPlaying(true);
    
    const spritePromises = sprites.map(sprite => executeBlocksForSprite(sprite));
    const results = await Promise.all(spritePromises);
    
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const sprite1 = sprites.find(s => s.id === results[i].id);
        const sprite2 = sprites.find(s => s.id === results[j].id);
        
        if (sprite1 && sprite2 && checkCollision(results[i], results[j])) {

          const oppositeDirectionBlocks1 = sprite1.blocks.map(block => {
            const newBlock = { ...block, params: [...block.params] };
            if (block.id === 'move' || block.id === 'turn') {
              newBlock.params[0] = -Number(block.params[0]);
            } else if (block.id === 'goto') {
              newBlock.params[0] = -Number(block.params[0]);
              newBlock.params[1] = -Number(block.params[1]);
            } else if (block.id === 'repeat') {
              // As repeat count stays same so no reverse needed
            }
            return newBlock;
          });
          
          const oppositeDirectionBlocks2 = sprite2.blocks.map(block => {
            const newBlock = { ...block, params: [...block.params] };
            if (block.id === 'move' || block.id === 'turn') {
              newBlock.params[0] = -Number(block.params[0]);
            } else if (block.id === 'goto') {
              newBlock.params[0] = -Number(block.params[0]);
              newBlock.params[1] = -Number(block.params[1]);
            } else if (block.id === 'repeat') {
              // As repeat count stays same so no reverse needed
            }
            return newBlock;
          });
          
          setSprites(prev => prev.map(s => {
            if (s.id === sprite1.id) {
              return { ...s, blocks: oppositeDirectionBlocks1 };
            }
            if (s.id === sprite2.id) {
              return { ...s, blocks: oppositeDirectionBlocks2 };
            }
            return s;
          }));
          
          setSprites(prev => prev.map(s => {
            if (s.id === sprite1.id || s.id === sprite2.id) {
              return { ...s, message: 'Direction Reversed!', messageType: 'say' };
            }
            return s;
          }));
          
          await sleep(1500);
          
          setSprites(prev => prev.map(s => {
            if (s.id === sprite1.id || s.id === sprite2.id) {
              return { ...s, message: '', messageType: '' };
            }
            return s;
          }));
          
          const sprite1WithReverseDirection = { ...sprite1, blocks: oppositeDirectionBlocks1, x: results[i].x, y: results[i].y, rotation: results[i].rotation };
          const sprite2WithReverseDirection = { ...sprite2, blocks: oppositeDirectionBlocks2, x: results[j].x, y: results[j].y, rotation: results[j].rotation };
          
          await Promise.all([
            executeBlocksForSprite(sprite1WithReverseDirection),
            executeBlocksForSprite(sprite2WithReverseDirection)
          ]);
        }
      }
    }

    setIsPlaying(false);
  };

  const resetPositions = () => {
    setSprites(prev => prev.map((sprite, idx) => ({
      ...sprite,
      x: 100 + (idx % 2) * 150,
      y: 150 + Math.floor(idx / 2) * 130,
      rotation: 0,
      message: '',
      messageType: ''
    })));
  };

  const addSprite = () => {
    if (sprites.length < 4) {
      const availableSprite = SPRITE_IMAGES.find(img => !sprites.some(s => s.id === img.id));
      if (availableSprite) {
        setSprites([...sprites, {
          id: availableSprite.id,
          emoji: availableSprite.emoji,
          name: availableSprite.name,
          x: 200,
          y: 200,
          rotation: 0,
          blocks: [],
          message: '',
          messageType: ''
        }]);
      }
    }
  };

  const removeSprite = (spriteId) => {
    if (sprites.length > 1) {
      setSprites(prev => prev.filter(s => s.id !== spriteId));
      if (selectedSprite === spriteId) {
        const remainingSprites = sprites.filter(s => s.id !== spriteId);
        if (remainingSprites.length > 0) {
          setSelectedSprite(remainingSprites[0].id);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Mini Scratch Clone</h1>
        
        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-3 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-purple-700">Blocks</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-blue-600 mb-2">Motion</h3>
              <div className="space-y-2">
                {MOTION_BLOCKS.map(block => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(block)}
                    className="bg-blue-500 text-white p-2 rounded cursor-move hover:bg-blue-600 text-sm"
                  >
                    {block.label.split('{}').map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < block.params.length && (
                          <input
                            type="text"
                            className="w-12 mx-1 px-1 text-black rounded text-center"
                            value={block.params[i]}
                            readOnly
                          />
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-purple-600 mb-2">Looks</h3>
              <div className="space-y-2">
                {LOOKS_BLOCKS.map(block => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(block)}
                    className="bg-purple-500 text-white p-2 rounded cursor-move hover:bg-purple-600 text-sm"
                  >
                    {block.label.split('{}').map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < block.params.length && (
                          <input
                            type="text"
                            className="w-16 mx-1 px-1 text-black rounded text-center"
                            value={block.params[i]}
                            readOnly
                          />
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-700">Scripts</h2>
              <select
                value={selectedSprite}
                onChange={(e) => setSelectedSprite(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {sprites.map(sprite => (
                  <option key={sprite.id} value={sprite.id}>
                    {sprite.emoji} {sprite.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="min-h-96 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              {currentSprite?.blocks.length === 0 ? (
                <p className="text-gray-400 text-center mt-20">Drag blocks here</p>
              ) : (
                <div className="space-y-2">
                  {currentSprite?.blocks.map((block, idx) => (
                    <div
                      key={block.instanceId}
                      className={`${
                        block.type === 'motion' ? 'bg-blue-500' : 'bg-purple-500'
                      } text-white p-2 rounded flex items-center justify-between`}
                    >
                      <div className="flex-1">
                        {block.label.split('{}').map((part, i) => (
                          <span key={i}>
                            {part}
                            {i < block.params.length && (
                              <input
                                type="text"
                                className="w-16 mx-1 px-1 text-black rounded text-center"
                                value={block.params[i]}
                                onChange={(e) => updateBlockParam(idx, i, e.target.value)}
                              />
                            )}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => removeBlock(idx)}
                        className="ml-2 hover:bg-red-600 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

         
          <div className="col-span-5 bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-700">Stage</h2>
              <div className="flex gap-2">
                <button
                  onClick={resetPositions}
                  disabled={isPlaying}
                  className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-1"
                >
                  <RotateCw size={16} />
                  Reset
                </button>
                <button
                  onClick={executeBlocks}
                  disabled={isPlaying}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                >
                  <Play size={16} />
                  Play
                </button>
              </div>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg" style={{ width: '500px', height: '400px' }}>
              {sprites.map(sprite => (
                <div
                  key={sprite.id}
                  className="absolute transition-all duration-300 group"
                  style={{
                    left: `${sprite.x}px`,
                    top: `${sprite.y}px`,
                    transform: `translate(-50%, -50%) rotate(${sprite.rotation}deg)`
                  }}
                >
                  <div className="text-6xl cursor-pointer hover:scale-110 transition-transform">
                    {sprite.emoji}
                  </div>
                  {sprites.length > 1 && (
                    <button
                      onClick={() => removeSprite(sprite.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove sprite"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {sprite.message && (
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
                      sprite.messageType === 'think' ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white border-2 border-gray-400'
                    }`}>
                      {sprite.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                onClick={addSprite}
                disabled={sprites.length >= 4}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 w-full"
              >
                Add Sprite ({sprites.length}/4)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Text, Line } from '@react-three/drei';

const Axis: React.FC<{ 
  start: [number, number, number]; 
  end: [number, number, number]; 
  color: string; 
  label: string;
  labelPos: [number, number, number];
}> = ({ start, end, color, label, labelPos }) => (
  <group>
    <Line points={[start, end]} color={color} lineWidth={2} />
    <Text
      position={labelPos}
      fontSize={0.4}
      color={color}
      // Removed direct Google Fonts URL to prevent CORS errors. 
      // Drei falls back to a safe default font.
    >
      {label}
    </Text>
    {/* Cone/Arrow tip */}
    <mesh position={end} rotation={getRotation(start, end)}>
      <coneGeometry args={[0.08, 0.3, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  </group>
);

const getRotation = (start: number[], end: number[]): [number, number, number] => {
  if (end[0] > start[0]) return [0, 0, -Math.PI / 2]; // X axis
  if (end[1] > start[1]) return [0, 0, 0]; // Y axis (Physics Z)
  if (end[2] > start[2]) return [Math.PI / 2, 0, 0]; // Z axis (Physics Y)
  return [0, 0, 0];
};

const ScientificAxes: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  const length = 5.5;

  return (
    <group>
      {/* Physics X Axis (Mapped to Three X) - RED */}
      <Axis 
        start={[0, 0, 0]} 
        end={[length, 0, 0]} 
        color="#ff5555" 
        label="+X" 
        labelPos={[length + 0.4, 0, 0]} 
      />

      {/* Physics Y Axis (Mapped to Three Z) - BLUE */}
      {/* Note: In standard physics (r, theta, phi), Z is up. 
          We mapped Physics Z -> Three Y. 
          We mapped Physics Y -> Three Z. */}
      <Axis 
        start={[0, 0, 0]} 
        end={[0, 0, length]} 
        color="#5555ff" 
        label="+Y" 
        labelPos={[0, 0, length + 0.4]} 
      />

      {/* Physics Z Axis (Mapped to Three Y) - GREEN */}
      <Axis 
        start={[0, 0, 0]} 
        end={[0, length, 0]} 
        color="#55ff55" 
        label="+Z" 
        labelPos={[0, length + 0.4, 0]} 
      />
      
      {/* Origin Dot */}
      <mesh>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
};

export default ScientificAxes;
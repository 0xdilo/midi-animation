import React, { useMemo } from 'react';
import { Merged } from '@react-three/drei';
import Car1 from './Cars/Car1';
import Car2 from './Cars/Car2';
import Car3 from './Cars/Car3';
import Car4 from './Cars/Car4';

const carComponents = { Car1, Car2, Car3, Car4 };

export default function Cars({ models, ...props }) {
  const meshes = useMemo(() => {
    return {
      Car1: <Car1 />, 
      Car2: <Car2 />, 
      Car3: <Car3 />, 
      Car4: <Car4 />
    };
  }, []);

  return (
    <Merged meshes={meshes}>
      {(Car1, Car2, Car3, Car4) => (
        <>
          {models.map((model) => {
            const CarComponent = { Car1, Car2, Car3, Car4 }[model.model];
            return <CarComponent key={model.id} {...model} />;
          })}
        </>
      )}
    </Merged>
  );
}

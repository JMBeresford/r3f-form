import * as React from 'react';
import { Text } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { TroikaTextProps } from './Input';

export type LabelProps = {
  label?: string;
  position?: Vector3;
} & TroikaTextProps;

const Label = (props: LabelProps) => {
  const { label, position, ...restProps } = props;
  return (
    <group position={position}>
      <Text anchorX='left' anchorY='bottom' {...restProps}>
        {label}
      </Text>
    </group>
  );
};

export default Label;

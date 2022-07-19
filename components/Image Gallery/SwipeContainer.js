import React from 'react';
import PanContainer from './PanContainer';

const SwipeContainer = ({ children, setIsDragging }) => {
	return (
		<PanContainer setIsDragging={setIsDragging}>{children}</PanContainer>
	);
};

export default SwipeContainer;

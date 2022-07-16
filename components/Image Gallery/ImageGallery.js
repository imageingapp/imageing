import React, { useEffect, useState, useCallback } from 'react';
import {
	Button,
	Dimensions,
	FlatList,
	Image,
	Modal,
	StyleSheet,
	TouchableOpacity,
	View
} from 'react-native';
import ImagePreview from './ImagePreview';
import SwipeContainer from './SwipeContainer';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const defaultProps = {
	hideThumbs: false,
	resizeMode: 'contain',
	thumbColor: '#d9b44a',
	thumbResizeMode: 'cover',
	thumbSize: 48
};

const ImageGallery = (props) => {
	const {
		hideThumbs,
		images,
		initialIndex,
		isOpen,
		renderCustomImage,
		renderCustomThumb,
		renderFooterComponent,
		renderHeaderComponent,
		thumbColor,
		thumbSize
	} = props;

	const [activeIndex, setActiveIndex] = useState(0);
	const [topRef, setTopRef] = useState(0);
	const [bottomRef, setBottomRef] = useState(0);
	const [isDragging, setIsDragging] = useState(false);

	const keyExtractorThumb = (item, index) =>
		item && item.id ? item.id.toString() : index.toString();
	const keyExtractorImage = (item, index) =>
		item && item.id ? item.id.toString() : index.toString();

	const scrollToIndex = (i) => {
		setActiveIndex(i);

		if (topRef) {
			topRef.scrollToIndex({
				animated: true,
				index: i
			});
		}
		if (bottomRef) {
			if (i * (thumbSize + 10) - thumbSize / 2 > deviceWidth / 2) {
				bottomRef.scrollToIndex({
					animated: true,
					index: i
				});
			} else {
				bottomRef.scrollToIndex({
					animated: true,
					index: 0
				});
			}
		}
	};

	const renderItem = ({ item, index }) => {
		return (
			<ImagePreview
				index={index}
				isSelected={activeIndex === index}
				item={item}
				resizeMode={'center'}
				renderCustomImage={renderCustomImage}
			/>
		);
	};

	const renderThumb = ({ item, index }) => {
		return (
			<TouchableOpacity
				onPress={() => scrollToIndex(index)}
				activeOpacity={0.8}>
				{renderCustomThumb ? (
					renderCustomThumb(item, index, activeIndex === index)
				) : (
					<Image
						resizeMode={'center'}
						style={
							activeIndex === index
								? [
										styles.thumb,
										styles.activeThumb,
										{ borderColor: thumbColor },
										{ width: thumbSize, height: thumbSize }
								  ]
								: [
										styles.thumb,
										{ width: thumbSize, height: thumbSize }
								  ]
						}
						source={{
							uri: item.thumbUrl
								? item.thumbUrl
								: item.localUrl
								? item.localUrl
								: item.url
						}}
					/>
				)}
			</TouchableOpacity>
		);
	};

	const onMomentumEnd = (e) => {
		const { x } = e.nativeEvent.contentOffset;
		scrollToIndex(Math.round(x / deviceWidth));
	};

	useEffect(() => {
		if (isOpen && initialIndex) {
			setActiveIndex(initialIndex);
		} else if (!isOpen) {
			setActiveIndex(0);
		}
	}, [isOpen, initialIndex]);

	const getImageLayout = useCallback((_, index) => {
		return {
			index,
			length: deviceWidth,
			offset: deviceWidth * index
		};
	}, []);

	const getThumbLayout = useCallback(
		(_, index) => {
			return {
				index,
				length: thumbSize,
				offset: thumbSize * index
			};
		},
		[thumbSize]
	);

	return (
		<View style={styles.container}>
			<SwipeContainer setIsDragging={setIsDragging}>
				<FlatList
					initialScrollIndex={initialIndex}
					getItemLayout={getImageLayout}
					data={images}
					horizontal
					keyExtractor={keyExtractorImage}
					onMomentumScrollEnd={onMomentumEnd}
					pagingEnabled
					ref={setTopRef}
					renderItem={renderItem}
					scrollEnabled={!isDragging}
					showsHorizontalScrollIndicator={false}
				/>
			</SwipeContainer>
			{hideThumbs ? null : (
				<FlatList
					initialScrollIndex={initialIndex}
					getItemLayout={getThumbLayout}
					contentContainerStyle={styles.thumbnailListContainer}
					data={props.images}
					horizontal
					keyExtractor={keyExtractorThumb}
					pagingEnabled
					ref={setBottomRef}
					renderItem={renderThumb}
					showsHorizontalScrollIndicator={false}
					style={[styles.bottomFlatlist, { bottom: thumbSize }]}
				/>
			)}
			{renderHeaderComponent ? (
				<View style={styles.header}>
					{renderHeaderComponent(images[activeIndex], activeIndex)}
				</View>
			) : null}
			{renderFooterComponent ? (
				<View style={styles.footer}>
					{renderFooterComponent(images[activeIndex], activeIndex)}
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#f2f2f2',
		flex: 1,
		height: deviceHeight,
		justifyContent: 'center',
		width: deviceWidth
	},

	header: {
		position: 'absolute',
		top: 0,
		width: '100%'
	},
	footer: {
		bottom: 0,
		position: 'absolute',
		width: '100%'
	},
	activeThumb: {
		borderWidth: 3
	},
	thumb: {
		borderRadius: 12,
		marginRight: 10
	},
	thumbnailListContainer: {
		paddingHorizontal: 10
	},
	bottomFlatlist: {
		position: 'absolute'
	}
});

ImageGallery.defaultProps = defaultProps;

export default ImageGallery;

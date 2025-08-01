import React, { useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  UIEvent, } from 'react';
import {
  Animated,
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  Text,
  ViewToken,
} from 'react-native';
import "./AnimatedList.css";
import { motion, useInView } from "framer-motion";

interface AnimatedListProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
}

export default function AnimatedList<T>({
  data,
  renderItem,
  keyExtractor,
}: AnimatedListProps<T>) {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.topGradient]} pointerEvents="none" />
      <Animated.FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      />
      <Animated.View style={[styles.bottomGradient]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    //backgroundColor: '#060010',
    borderRadius: 8,
    overflow: 'hidden',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    height: 50,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
   // backgroundImage: 'linear-gradient(rgba(6,0,16,1), rgba(6,0,16,0))',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    height: 100,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
   // backgroundImage: 'linear-gradient(rgba(6,0,16,1), rgba(6,0,16,0))',
  },
});

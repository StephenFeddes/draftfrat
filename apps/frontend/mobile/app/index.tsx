import { View, Text, ImageBackground } from 'react-native';
import React from 'react';
import confettiImage from '@/assets/images/confetti.png';

const App = () => {
    return (
        <View className="flex-1 justify-center items-center bg-primary">
            <ImageBackground source={confettiImage} resizeMode="center" className="flex-1 justify-center items-center w-full bg-primary">
                <Text className="text-white text-5xl font-bold">DraftBash</Text>
            </ImageBackground>
        </View>
    );
};

export default App;
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { getAppIcon, setAppIconAsync, supportsAlternateIcons, getAvailableAppIcons } from 'expo-dynamic-app-icon';

// the app icon 
interface AppIcon {
  name: string;
  image: string;
  prerendered: boolean;
}

const appIcons: AppIcon[] = [
  {
    name: "default",
    image: "./assets/icon.png",
    prerendered: true,
  },
  { 
    name: "red", 
    image: "./assets/icon1.png", 
    prerendered: true 
  },
  { 
    name: "gray", 
    image: "./assets/icon2.png", 
    prerendered: true 
  },
];

export default function App() {
  const [currentIcon, setCurrentIcon] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if device supports alternate icons
    const supported = supportsAlternateIcons();
    setIsSupported(supported);
    
    if (supported) {
      // Get current app icon
      const icon = getAppIcon();
      setCurrentIcon(icon);
    }
  }, []);
  
  const changeAppIcon = async (iconName: string) => {
    try {
      const result = await setAppIconAsync(iconName);
      setCurrentIcon(result);
      Alert.alert('Success', `App icon changed to ${result}`);
    } catch (error) {
      Alert.alert('Error', `Failed to change icon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  if (!isSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Device doesn't support alternate icons</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current App Icon: {currentIcon}</Text>
      
      <View style={styles.iconList}>
        {appIcons.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            style={[
              styles.iconButton,
              currentIcon === icon.name ? styles.selectedIcon : null
            ]}
            onPress={() => changeAppIcon(icon.name)}
            disabled={currentIcon === icon.name}
          >
            <Text style={styles.iconText}>{icon.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconList: {
    width: '100%',
  },
  iconButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  selectedIcon: {
    backgroundColor: '#c8e6c9',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  iconText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
});

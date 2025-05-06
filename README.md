# expo-dynamic-app-icon

Programmatically change the app icon in Expo.

## Install

```
npx expo install expo-dynamic-app-icon
```

## Set icon file

add plugins in `app.json`

```typescript
 "plugins": [
      [
        "expo-dynamic-app-icon",
        {
          "red": { // icon name
            "image": "./assets/icon1.png", // icon path
            "prerendered": true // for ios UIPrerenderedIcon option
          },
          "gray": {
            "image": "./assets/icon2.png",
            "prerendered": true
          }
        }
      ]
    ]
```

## Check AndroidManifest (for android)

```
expo prebuild
```

check added line
[AndroidManifest.xml](./example/android/app/src/main/AndroidManifest.xml#L33-L44)

```xml
  ...
    <activity-alias android:name="expo.modules.dynamicappicon.example.MainActivityred" android:enabled="false" android:exported="true" android:icon="@mipmap/red" android:targetActivity=".MainActivity">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
    </activity-alias>
    <activity-alias android:name="expo.modules.dynamicappicon.example.MainActivitygray" android:enabled="false" android:exported="true" android:icon="@mipmap/gray" android:targetActivity=".MainActivity">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
    </activity-alias>
  ...
```

## Create new `expo-dev-client`

create a new `expo-dev-client` and begin using `expo-dynamic-app-icon`

## API

### Check if device supports alternate icons

```typescript
import { supportsAlternateIcons } from "expo-dynamic-app-icon";

// Check if device supports changing app icons
const isSupported = supportsAlternateIcons(); // returns boolean
```

### Change app icon (async with Promise)

The recommended way to change app icons:

```typescript
import { setAppIconAsync } from "expo-dynamic-app-icon";

try {
  // Returns a Promise that resolves to the icon name
  const newIcon = await setAppIconAsync("red");
  console.log(`Icon changed to ${newIcon}`);
} catch (error) {
  console.error("Failed to change icon:", error);
}
```

### Change app icon (legacy method)

For backward compatibility:

```typescript
import { setAppIcon } from "expo-dynamic-app-icon";

// Returns the icon name if successful, false if failed
const result = setAppIcon("red");
if (result === false) {
  console.log("Failed to change icon");
} else {
  console.log(`Icon changed to ${result}`);
}
```

### Get current app icon name

```typescript
import { getAppIcon } from "expo-dynamic-app-icon";

// Returns current icon name, or "DEFAULT" if using the original icon
const currentIcon = getAppIcon();
```

### Get all available app icons

```typescript
import { getAvailableAppIcons } from "expo-dynamic-app-icon";

// Returns array of available icon names including "DEFAULT"
const availableIcons = getAvailableAppIcons();
```

## Example

```typescript
import React, { useEffect, useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { 
  supportsAlternateIcons, 
  setAppIconAsync, 
  getAppIcon, 
  getAvailableAppIcons 
} from 'expo-dynamic-app-icon';

export default function App() {
  const [currentIcon, setCurrentIcon] = useState<string>('');
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    // Check if the device supports changing app icons
    const supported = supportsAlternateIcons();
    setIsSupported(supported);

    if (supported) {
      // Get the current app icon
      setCurrentIcon(getAppIcon());
      
      // Get all available app icons
      setAvailableIcons(getAvailableAppIcons());
    }
  }, []);

  const changeIcon = async (iconName: string) => {
    try {
      const newIcon = await setAppIconAsync(iconName);
      setCurrentIcon(newIcon);
      Alert.alert('Success', `App icon changed to ${newIcon}`);
    } catch (error) {
      Alert.alert('Error', `Failed to change app icon: ${error.message}`);
    }
  };

  if (!isSupported) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This device doesn't support changing app icons</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current icon: {currentIcon}</Text>
      <View style={{ marginTop: 20 }}>
        {availableIcons.map(icon => (
          <Button
            key={icon}
            title={`Change to ${icon}`}
            onPress={() => changeIcon(icon)}
            disabled={icon === currentIcon}
          />
        ))}
      </View>
    </View>
  );
}
```

<a href="https://www.buymeacoffee.com/outsung" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

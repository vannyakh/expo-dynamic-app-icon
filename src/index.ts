import ExpoDynamicAppIconModule from "./ExpoDynamicAppIconModule";

/**
 * Check if the device supports changing app icons
 * @returns true if the device supports changing app icons
 */
export function supportsAlternateIcons(): boolean {
  return ExpoDynamicAppIconModule.supportsAlternateIcons?.() ?? false;
}

/**
 * Change the app icon to the specified name
 * @param name The name of the app icon to change to, or "DEFAULT" for the original icon
 * @returns A promise that resolves to the name of the new icon, or rejects with an error
 */
export async function setAppIconAsync(name: string): Promise<string> {
  // Use async version if available (new in v2+), otherwise use sync version with promise wrapper
  if (ExpoDynamicAppIconModule.setAppIcon.length >= 2) {
    return await ExpoDynamicAppIconModule.setAppIcon(name);
  } else {
    return new Promise((resolve, reject) => {
      try {
        const result = ExpoDynamicAppIconModule.setAppIcon(name);
        if (result === false) {
          reject(new Error("Failed to change app icon"));
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

/**
 * Change the app icon to the specified name (synchronous, legacy support)
 * @param name The name of the app icon to change to, or "DEFAULT" for the original icon
 * @returns The name of the new icon or false if failed
 * @deprecated Use setAppIconAsync instead
 */
export function setAppIcon(name: string): string | false {
  return ExpoDynamicAppIconModule.setAppIcon(name);
}

/**
 * Get the current app icon name
 * @returns The name of the current app icon, or "DEFAULT" if using the original icon
 */
export function getAppIcon(): string {
  return ExpoDynamicAppIconModule.getAppIcon();
}

/**
 * Get all available app icons
 * @returns Array of available app icon names including "DEFAULT"
 */
export function getAvailableAppIcons(): string[] {
  return ExpoDynamicAppIconModule.getAvailableAppIcons?.() ?? ["DEFAULT"];
}

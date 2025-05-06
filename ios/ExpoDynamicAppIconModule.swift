import ExpoModulesCore

public class ExpoDynamicAppIconModule: Module {
  public func definition() -> ModuleDefinition {
    
    Name("ExpoDynamicAppIcon")
    
    // Check if app icon changing is supported
    Function("supportsAlternateIcons") { () -> Bool in
      return UIApplication.shared.supportsAlternateIcons
    }
    
    // Set app icon with Promise support
    AsyncFunction("setAppIcon") { (name: String, promise: Promise) in
      do {
        try self.setAppIconWithoutAlert(name) { error in
          if let error = error {
            promise.reject("ERR_CHANGE_ICON", "Failed to change app icon: \(error.localizedDescription)", error)
          } else {
            promise.resolve(name)
          }
        }
      } catch {
        promise.reject("ERR_CHANGE_ICON", "Failed to change app icon: \(error.localizedDescription)", error)
      }
    }
    
    // Maintain backward compatibility
    Function("setAppIcon") { (name: String) -> String in
      do {
        try self.setAppIconWithoutAlert(name)
        return name
      } catch {
        return "DEFAULT"
      }
    }
    
    // Get current app icon
    Function("getAppIcon") { () -> String in
      return UIApplication.shared.alternateIconName ?? "DEFAULT"
    }
    
    // Get all available app icons
    Function("getAvailableAppIcons") { () -> [String] in
      var iconNames = ["DEFAULT"]
      
      // Get available alternate icon names from Info.plist if possible
      if let icons = Bundle.main.object(forInfoDictionaryKey: "CFBundleIcons") as? [String: Any],
         let alternateIcons = icons["CFBundleAlternateIcons"] as? [String: Any] {
        iconNames.append(contentsOf: alternateIcons.keys)
      }
      
      return iconNames
    }
  }
  
  private func setAppIconWithoutAlert(_ iconName: String?, completion: ((Error?) -> Void)? = nil) throws {
    guard UIApplication.shared.supportsAlternateIcons else {
      let error = NSError(domain: "ExpoDynamicAppIconModule", code: 1, userInfo: [NSLocalizedDescriptionKey: "Alternate icons not supported"])
      completion?(error)
      throw error
    }
    
    let iconNameToUse = iconName == "DEFAULT" ? nil : iconName
    
    typealias setAlternateIconName = @convention(c) (NSObject, Selector, NSString?, @escaping (NSError) -> ()) -> ()
    
    let selectorString = "_setAlternateIconName:completionHandler:"
    
    guard let selector = NSSelectorFromString(selectorString) else {
      let error = NSError(domain: "ExpoDynamicAppIconModule", code: 2, userInfo: [NSLocalizedDescriptionKey: "Method not found"])
      completion?(error)
      throw error
    }
    
    guard let imp = UIApplication.shared.method(for: selector) else {
      let error = NSError(domain: "ExpoDynamicAppIconModule", code: 3, userInfo: [NSLocalizedDescriptionKey: "Implementation not found"])
      completion?(error)
      throw error
    }
    
    let method = unsafeBitCast(imp, to: setAlternateIconName.self)
    method(UIApplication.shared, selector, iconNameToUse as NSString?, { error in
      completion?(error)
    })
  }
}

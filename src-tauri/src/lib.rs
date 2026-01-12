use tauri::Manager;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

#[tauri::command]
fn update_shortcut(app: tauri::AppHandle, shortcut_str: String) -> Result<String, String> {
    let global_shortcut = app.global_shortcut();

    // Unregister all existing shortcuts first
    if let Err(e) = global_shortcut.unregister_all() {
        println!("Warning: Failed to unregister shortcuts: {:?}", e);
    }

    // Parse the shortcut string
    match shortcut_str.parse::<tauri_plugin_global_shortcut::Shortcut>() {
        Ok(shortcut) => {
            match global_shortcut.register(shortcut) {
                Ok(_) => {
                    println!("Successfully registered shortcut: {}", shortcut_str);
                    Ok(format!("Registered: {}", shortcut_str))
                }
                Err(e) => {
                    println!("Failed to register shortcut: {:?}", e);
                    Err(format!("Failed to register: {:?}", e))
                }
            }
        }
        Err(e) => {
            println!("Failed to parse shortcut '{}': {:?}", shortcut_str, e);
            Err(format!("Invalid shortcut format: {:?}", e))
        }
    }
}

#[tauri::command]
fn get_current_shortcut() -> String {
    // Return default, actual state is managed by frontend
    "CommandOrControl+Alt+D".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    println!("Shortcut {:?} triggered, state: {:?}", shortcut, event.state());
                    if event.state() == ShortcutState::Pressed {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                println!("Hiding window");
                                let _ = window.hide();
                            } else {
                                println!("Showing window");
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(),
        )
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![update_shortcut, get_current_shortcut])
        .setup(|app| {
            // Register default shortcut Cmd+Alt+D
            let shortcut = "CommandOrControl+Alt+D".parse::<tauri_plugin_global_shortcut::Shortcut>()
                .expect("Failed to parse default shortcut");

            match app.global_shortcut().register(shortcut) {
                Ok(_) => println!("Successfully registered default shortcut: Cmd+Alt+D"),
                Err(e) => println!("Failed to register shortcut: {:?}", e),
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

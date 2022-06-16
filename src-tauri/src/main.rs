// #![cfg_attr(
//     all(not(debug_assertions), target_os = "windows"),
//     windows_subsystem = "windows"
// )]

use app::Universe;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
fn get_game_state(game: State<Mutex<Universe>>) -> String {
    game.lock().unwrap().render()
}

#[tauri::command]
fn tick_game(game: State<Mutex<Universe>>) {
    game.lock().unwrap().tick()
}

#[tauri::command]
fn reset_game(game: State<Mutex<Universe>>) {
    *game.lock().unwrap() = Universe::new();
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .manage(Mutex::new(Universe::new()))
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![
            get_game_state,
            tick_game,
            reset_game
        ])
        .run(context)
        .expect("error while running tauri application");
}

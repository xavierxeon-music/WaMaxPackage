{
   // Use IntelliSense to learn about possible attributes.
   // Hover to view descriptions of existing attributes.
   // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
   "version": "0.2.0",
   "configurations": [
      {
         "name": "Rack Small",
         "file": "${workspaceFolder}/maxgui.html?content=mixer/rack_small_ui.js",
         "request": "launch",
         "type": "chrome",
         "includeLaunchArgs": true,
         "runtimeArgs": [
            "--allow-file-access-from-files"
         ],
         "url": "http://localhost:8080",
         "webRoot": "${workspaceFolder}"
      }
   ]
}